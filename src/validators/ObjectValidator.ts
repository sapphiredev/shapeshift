import type { IConstraint } from '../constraints/base/IConstraint';
import type { BaseError } from '../lib/errors/BaseError';
import { CombinedPropertyError } from '../lib/errors/CombinedPropertyError';
import { MissingPropertyError } from '../lib/errors/MissingPropertyError';
import { UnknownPropertyError } from '../lib/errors/UnknownPropertyError';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import type { MappedObjectValidator, NonNullObject } from '../lib/util-types';
import { BaseValidator } from './BaseValidator';

export class ObjectValidator<T extends NonNullObject> extends BaseValidator<T> {
	public readonly shape: MappedObjectValidator<T>;
	public readonly strategy: ObjectValidatorStrategy;
	private readonly keys: readonly (keyof T)[];
	private readonly handleStrategy: (value: NonNullObject) => Result<T, CombinedPropertyError>;

	public constructor(
		shape: MappedObjectValidator<T>,
		strategy: ObjectValidatorStrategy = ObjectValidatorStrategy.Ignore,
		constraints: readonly IConstraint<T>[] = []
	) {
		super(constraints);
		this.shape = shape;
		this.keys = Object.keys(shape) as (keyof T)[];
		this.strategy = strategy;

		switch (this.strategy) {
			case ObjectValidatorStrategy.Ignore:
				this.handleStrategy = (value) => this.handleIgnoreStrategy(value);
				break;
			case ObjectValidatorStrategy.Strict: {
				this.handleStrategy = (value) => this.handleStrictStrategy(value);
				break;
			}
			case ObjectValidatorStrategy.Passthrough:
				this.handleStrategy = (value) => this.handlePassthroughStrategy(value);
				break;
		}
	}

	public get strict(): ObjectValidator<{ [Key in keyof T]-?: T[Key] }> {
		return Reflect.construct(this.constructor, [this.shape, ObjectValidatorStrategy.Strict, this.constraints]);
	}

	public get ignore(): this {
		return Reflect.construct(this.constructor, [this.shape, ObjectValidatorStrategy.Ignore, this.constraints]);
	}

	public get passthrough(): this {
		return Reflect.construct(this.constructor, [this.shape, ObjectValidatorStrategy.Passthrough, this.constraints]);
	}

	public get partial(): ObjectValidator<{ [Key in keyof T]?: T[Key] }> {
		const shape = Object.fromEntries(this.keys.map((key) => [key, this.shape[key].optional]));
		return Reflect.construct(this.constructor, [shape, this.strategy, this.constraints]);
	}

	public extend<ET extends NonNullObject>(schema: ObjectValidator<ET> | MappedObjectValidator<ET>): ObjectValidator<T & ET> {
		const shape = { ...this.shape, ...(schema instanceof ObjectValidator ? schema.shape : schema) };
		return Reflect.construct(this.constructor, [shape, this.strategy, this.constraints]);
	}

	public pick<K extends keyof T>(keys: readonly K[]): ObjectValidator<{ [Key in keyof Pick<T, K>]: T[Key] }> {
		const shape = Object.fromEntries(keys.filter((key) => this.keys.includes(key)).map((key) => [key, this.shape[key]]));
		return Reflect.construct(this.constructor, [shape, this.strategy, this.constraints]);
	}

	public omit<K extends keyof T>(keys: readonly K[]): ObjectValidator<{ [Key in keyof Omit<T, K>]: T[Key] }> {
		const shape = Object.fromEntries(this.keys.filter((key) => !keys.includes(key as any)).map((key) => [key, this.shape[key]]));
		return Reflect.construct(this.constructor, [shape, this.strategy, this.constraints]);
	}

	protected override handle(value: unknown): Result<T, ValidationError | CombinedPropertyError> {
		const typeOfValue = typeof value;
		if (typeOfValue !== 'object') {
			return Result.err(new ValidationError('s.object(T)', `Expected the value to be an object, but received ${typeOfValue} instead`, value));
		}

		if (value === null) {
			return Result.err(new ValidationError('s.object(T)', 'Expected the value to not be null', value));
		}

		return this.handleStrategy(value as NonNullObject);
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.shape, this.strategy, this.constraints]);
	}

	private handleIgnoreStrategy(value: NonNullObject, errors: [PropertyKey, BaseError][] = []): Result<T, CombinedPropertyError> {
		const entries = {} as T;
		let i = this.keys.length;

		while (i--) {
			const key = this.keys[i];
			const result = this.shape[key].run(value[key as keyof NonNullObject]);

			if (result.isOk()) {
				entries[key] = result.value;
			} else {
				const error = result.error!;
				if (error instanceof ValidationError && error.given === undefined) {
					errors.push([key, new MissingPropertyError(key)]);
				} else {
					errors.push([key, error]);
				}
			}
		}

		return errors.length === 0 //
			? Result.ok(entries)
			: Result.err(new CombinedPropertyError(errors));
	}

	private handleStrictStrategy(value: NonNullObject): Result<T, CombinedPropertyError> {
		const errors: [PropertyKey, BaseError][] = [];
		const finalResult = {} as T;
		const keysToIterateOver = [...new Set([...Object.keys(value), ...this.keys])].reverse();
		let i = keysToIterateOver.length;

		while (i--) {
			const key = keysToIterateOver[i] as string;

			if (Object.prototype.hasOwnProperty.call(this.shape, key)) {
				const result = this.shape[key as keyof MappedObjectValidator<T>].run(value[key as keyof NonNullObject]);

				if (result.isOk()) {
					finalResult[key as keyof T] = result.value;
				} else {
					const error = result.error!;
					if (error instanceof ValidationError && error.given === undefined) {
						errors.push([key, new MissingPropertyError(key)]);
					} else {
						errors.push([key, error]);
					}
				}

				continue;
			}

			errors.push([key, new UnknownPropertyError(key, value[key as keyof NonNullObject])]);
		}

		return errors.length === 0 //
			? Result.ok(finalResult)
			: Result.err(new CombinedPropertyError(errors));
	}

	private handlePassthroughStrategy(value: NonNullObject): Result<T, CombinedPropertyError> {
		const result = this.handleIgnoreStrategy(value);
		return result.isErr() ? result : Result.ok({ ...value, ...result.value } as T);
	}
}

export const enum ObjectValidatorStrategy {
	Ignore,
	Strict,
	Passthrough
}
