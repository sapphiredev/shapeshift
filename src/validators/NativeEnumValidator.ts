import { UnknownEnumValueError } from '../lib/errors/UnknownEnumValueError';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import type { ValidatorOptions } from '../lib/util-types';
import { BaseValidator } from './imports';

export class NativeEnumValidator<T extends NativeEnumLike> extends BaseValidator<T[keyof T]> {
	public readonly enumShape: T;
	public readonly hasNumericElements: boolean = false;
	private readonly enumKeys: string[];
	private readonly enumMapping = new Map<string | number, T[keyof T]>();

	public constructor(enumShape: T, validatorOptions: ValidatorOptions = {}) {
		super(validatorOptions);
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

		if (typeOfValue === 'number') {
			if (!this.hasNumericElements) {
				return Result.err(
					new ValidationError('s.nativeEnum(T)', this.validatorOptions.message ?? 'Expected the value to be a string', value)
				);
			}
		} else if (typeOfValue !== 'string') {
			// typeOfValue !== 'number' is implied here
			return Result.err(
				new ValidationError('s.nativeEnum(T)', this.validatorOptions.message ?? 'Expected the value to be a string or number', value)
			);
		}

		const casted = value as string | number;

		const possibleEnumValue = this.enumMapping.get(casted);

		return typeof possibleEnumValue === 'undefined'
			? Result.err(new UnknownEnumValueError(casted, this.enumKeys, this.enumMapping, this.validatorOptions))
			: Result.ok(possibleEnumValue);
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.enumShape, this.validatorOptions]);
	}
}

export interface NativeEnumLike {
	[key: string]: string | number;
	[key: number]: string;
}
