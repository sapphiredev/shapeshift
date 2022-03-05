import { UnknownEnumValueError } from '../lib/errors/UnknownEnumValueError';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './imports';

export class NativeEnumValidator<T extends NativeEnumLike> extends BaseValidator<T[keyof T]> {
	public readonly enumShape: T;
	public readonly hasNumericElements: boolean = false;
	private readonly enumKeys: string[];
	private readonly enumMapping = new Map<string | number, T[keyof T]>();

	public constructor(enumShape: T) {
		super();
		this.enumShape = enumShape;

		this.enumKeys = Object.keys(enumShape).filter((key) => {
			return typeof enumShape[enumShape[key]] !== 'number';
		});

		for (const key of this.enumKeys) {
			const enumValue = enumShape[key] as T[keyof T];

			this.enumMapping.set(key, enumValue);
			this.enumMapping.set(enumValue, enumValue);

			if (typeof enumValue === 'number') {
				this.hasNumericElements = true;
				this.enumMapping.set(`${enumValue}`, enumValue);
			}
		}
	}

	protected override handle(value: unknown): Result<T[keyof T], ValidationError | UnknownEnumValueError> {
		const typeOfValue = typeof value;

		// Step 1. Possible numeric enum
		if (typeOfValue === 'number' && !this.hasNumericElements) {
			return Result.err(new ValidationError('s.nativeEnum(T)', 'Expected the value to be a string', value));
		}

		// Ensure type is string or number
		if (typeOfValue !== 'string' && typeOfValue !== 'number') {
			return Result.err(new ValidationError('s.nativeEnum(T)', 'Expected the value to be a string or number', value));
		}

		const casted = value as string | number;

		const possibleEnumValue = this.enumMapping.get(casted);

		return typeof possibleEnumValue === 'undefined'
			? Result.err(new UnknownEnumValueError(casted, this.enumKeys, this.enumMapping))
			: Result.ok(possibleEnumValue);
	}

	protected clone(): this {
		return Reflect.construct(this.constructor, [this.enumShape]);
	}
}

export interface NativeEnumLike {
	[key: string]: string | number;
	[key: number]: string;
}
