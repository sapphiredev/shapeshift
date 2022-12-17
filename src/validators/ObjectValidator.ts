import type { IConstraint } from '../constraints/base/IConstraint';
import type { BaseError } from '../lib/errors/BaseError';
import { CombinedPropertyError } from '../lib/errors/CombinedPropertyError';
import { MissingPropertyError } from '../lib/errors/MissingPropertyError';
import { UnknownPropertyError } from '../lib/errors/UnknownPropertyError';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import type { MappedObjectValidator, UndefinedToOptional, ValidatorOptions } from '../lib/util-types';
import { BaseValidator } from './BaseValidator';
import { DefaultValidator } from './DefaultValidator';
import { LiteralValidator } from './LiteralValidator';
import { NullishValidator } from './NullishValidator';
import { UnionValidator } from './UnionValidator';

export class ObjectValidator<T extends object, I = UndefinedToOptional<T>> extends BaseValidator<I> {
	public readonly shape: MappedObjectValidator<T>;
	public readonly strategy: ObjectValidatorStrategy;
	private readonly keys: readonly (keyof I)[] = [];
	private readonly handleStrategy: (value: object) => Result<I, CombinedPropertyError>;

	private readonly requiredKeys = new Map<keyof I, BaseValidator<unknown>>();
	private readonly possiblyUndefinedKeys = new Map<keyof I, BaseValidator<unknown>>();
	private readonly possiblyUndefinedKeysWithDefaults = new Map<keyof I, DefaultValidator<unknown>>();

	public constructor(
		shape: MappedObjectValidator<T>,
		strategy: ObjectValidatorStrategy = ObjectValidatorStrategy.Ignore,
		validatorOptions: ValidatorOptions = {},
		constraints: readonly IConstraint<I>[] = []
	) {
		super(validatorOptions, constraints);
		this.shape = shape;
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

		const shapeEntries = Object.entries(shape) as [keyof I, BaseValidator<T>][];
		this.keys = shapeEntries.map(([key]) => key);

		for (const [key, validator] of shapeEntries) {
			if (validator instanceof UnionValidator) {
				// eslint-disable-next-line @typescript-eslint/dot-notation
				const [possiblyLiteralOrNullishPredicate] = validator['validators'];

				if (possiblyLiteralOrNullishPredicate instanceof NullishValidator) {
					this.possiblyUndefinedKeys.set(key, validator);
				} else if (possiblyLiteralOrNullishPredicate instanceof LiteralValidator) {
					if (possiblyLiteralOrNullishPredicate.expected === undefined) {
						this.possiblyUndefinedKeys.set(key, validator);
					} else {
						this.requiredKeys.set(key, validator);
					}
				} else if (validator instanceof DefaultValidator) {
					this.possiblyUndefinedKeysWithDefaults.set(key, validator);
				} else {
					this.requiredKeys.set(key, validator);
				}
			} else if (validator instanceof NullishValidator) {
				this.possiblyUndefinedKeys.set(key, validator);
			} else if (validator instanceof LiteralValidator) {
				if (validator.expected === undefined) {
					this.possiblyUndefinedKeys.set(key, validator);
				} else {
					this.requiredKeys.set(key, validator);
				}
			} else if (validator instanceof DefaultValidator) {
				this.possiblyUndefinedKeysWithDefaults.set(key, validator);
			} else {
				this.requiredKeys.set(key, validator);
			}
		}
	}

	public strict(options: ValidatorOptions = this.validatorOptions): this {
		return Reflect.construct(this.constructor, [this.shape, ObjectValidatorStrategy.Strict, options, this.constraints]);
	}

	public ignore(options: ValidatorOptions = this.validatorOptions): this {
		return Reflect.construct(this.constructor, [this.shape, ObjectValidatorStrategy.Ignore, options, this.constraints]);
	}

	public passthrough(options: ValidatorOptions = this.validatorOptions): this {
		return Reflect.construct(this.constructor, [this.shape, ObjectValidatorStrategy.Passthrough, options, this.constraints]);
	}

	public partial(options: ValidatorOptions = this.validatorOptions): ObjectValidator<{ [Key in keyof I]?: I[Key] }> {
		const shape = Object.fromEntries(this.keys.map((key) => [key, this.shape[key as unknown as keyof typeof this.shape].optional(options)]));
		return Reflect.construct(this.constructor, [shape, this.strategy, options, this.constraints]);
	}

	public required(options: ValidatorOptions = this.validatorOptions): ObjectValidator<{ [Key in keyof I]-?: I[Key] }> {
		const shape = Object.fromEntries(
			this.keys.map((key) => {
				let validator = this.shape[key as unknown as keyof typeof this.shape];
				if (validator instanceof UnionValidator) validator = validator.required(options);
				return [key, validator];
			})
		);
		return Reflect.construct(this.constructor, [shape, this.strategy, options, this.constraints]);
	}

	public extend<ET extends object>(
		schema: ObjectValidator<ET> | MappedObjectValidator<ET>,
		options: ValidatorOptions = this.validatorOptions
	): ObjectValidator<T & ET> {
		const shape = { ...this.shape, ...(schema instanceof ObjectValidator ? schema.shape : schema) };
		return Reflect.construct(this.constructor, [shape, this.strategy, options, this.constraints]);
	}

	public pick<K extends keyof I>(
		keys: readonly K[],
		options: ValidatorOptions = this.validatorOptions
	): ObjectValidator<{ [Key in keyof Pick<I, K>]: I[Key] }> {
		const shape = Object.fromEntries(
			keys.filter((key) => this.keys.includes(key)).map((key) => [key, this.shape[key as unknown as keyof typeof this.shape]])
		);
		return Reflect.construct(this.constructor, [shape, this.strategy, options, this.constraints]);
	}

	public omit<K extends keyof I>(
		keys: readonly K[],
		options: ValidatorOptions = this.validatorOptions
	): ObjectValidator<{ [Key in keyof Omit<I, K>]: I[Key] }> {
		const shape = Object.fromEntries(
			this.keys.filter((key) => !keys.includes(key as any)).map((key) => [key, this.shape[key as unknown as keyof typeof this.shape]])
		);
		return Reflect.construct(this.constructor, [shape, this.strategy, options, this.constraints]);
	}

	protected override handle(value: unknown): Result<I, ValidationError | CombinedPropertyError> {
		const typeOfValue = typeof value;
		if (typeOfValue !== 'object') {
			return Result.err(
				new ValidationError(
					's.object(T)',
					this.validatorOptions.message ?? `Expected the value to be an object, but received ${typeOfValue} instead`,
					value
				)
			);
		}

		if (value === null) {
			return Result.err(new ValidationError('s.object(T)', this.validatorOptions.message ?? 'Expected the value to not be null', value));
		}

		if (Array.isArray(value)) {
			return Result.err(new ValidationError('s.object(T)', this.validatorOptions.message ?? 'Expected the value to not be an array', value));
		}

		if (!this.shouldRunConstraints) {
			return Result.ok(value as I);
		}

		for (const predicate of Object.values(this.shape) as BaseValidator<any>[]) {
			predicate.setParent(this.parent ?? value!);
		}

		return this.handleStrategy(value as object);
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.shape, this.strategy, this.validatorOptions, this.constraints]);
	}

	private handleIgnoreStrategy(value: object): Result<I, CombinedPropertyError> {
		const errors: [PropertyKey, BaseError][] = [];
		const finalObject = {} as I;
		const inputEntries = new Map(Object.entries(value) as [keyof I, unknown][]);

		const runPredicate = (key: keyof I, predicate: BaseValidator<unknown>) => {
			const result = predicate.run(value[key as keyof object]);

			if (result.isOk()) {
				finalObject[key] = result.value as I[keyof I];
			} else {
				const error = result.error!;
				errors.push([key, error]);
			}
		};

		for (const [key, predicate] of this.requiredKeys) {
			if (inputEntries.delete(key)) {
				runPredicate(key, predicate);
			} else {
				errors.push([key, new MissingPropertyError(key, this.validatorOptions)]);
			}
		}

		// Run possibly undefined keys that also have defaults even if there are no more keys to process (this is necessary so we fill in those defaults)
		for (const [key, validator] of this.possiblyUndefinedKeysWithDefaults) {
			inputEntries.delete(key);
			runPredicate(key, validator);
		}

		// Early exit if there are no more properties to validate in the object and there are errors to report
		if (inputEntries.size === 0) {
			return errors.length === 0 //
				? Result.ok(finalObject)
				: Result.err(new CombinedPropertyError(errors, this.validatorOptions));
		}

		// In the event the remaining keys to check are less than the number of possible undefined keys, we check those
		// as it could yield a faster execution
		const checkInputEntriesInsteadOfSchemaKeys = this.possiblyUndefinedKeys.size > inputEntries.size;

		if (checkInputEntriesInsteadOfSchemaKeys) {
			for (const [key] of inputEntries) {
				const predicate = this.possiblyUndefinedKeys.get(key);

				if (predicate) {
					runPredicate(key, predicate);
				}
			}
		} else {
			for (const [key, predicate] of this.possiblyUndefinedKeys) {
				if (inputEntries.delete(key)) {
					runPredicate(key, predicate);
				}
			}
		}

		return errors.length === 0 //
			? Result.ok(finalObject)
			: Result.err(new CombinedPropertyError(errors, this.validatorOptions));
	}

	private handleStrictStrategy(value: object): Result<I, CombinedPropertyError> {
		const errors: [PropertyKey, BaseError][] = [];
		const finalResult = {} as I;
		const inputEntries = new Map(Object.entries(value) as [keyof I, unknown][]);

		const runPredicate = (key: keyof I, predicate: BaseValidator<unknown>) => {
			const result = predicate.run(value[key as keyof object]);

			if (result.isOk()) {
				finalResult[key] = result.value as I[keyof I];
			} else {
				const error = result.error!;
				errors.push([key, error]);
			}
		};

		for (const [key, predicate] of this.requiredKeys) {
			if (inputEntries.delete(key)) {
				runPredicate(key, predicate);
			} else {
				errors.push([key, new MissingPropertyError(key, this.validatorOptions)]);
			}
		}

		// Run possibly undefined keys that also have defaults even if there are no more keys to process (this is necessary so we fill in those defaults)
		for (const [key, validator] of this.possiblyUndefinedKeysWithDefaults) {
			inputEntries.delete(key);
			runPredicate(key, validator);
		}

		for (const [key, predicate] of this.possiblyUndefinedKeys) {
			// All of these validators are assumed to be possibly undefined, so if we have gone through the entire object and there's still validators,
			// safe to assume we're done here
			if (inputEntries.size === 0) {
				break;
			}

			if (inputEntries.delete(key)) {
				runPredicate(key, predicate);
			}
		}

		if (inputEntries.size !== 0) {
			for (const [key, value] of inputEntries.entries()) {
				errors.push([key, new UnknownPropertyError(key, value, this.validatorOptions)]);
			}
		}

		return errors.length === 0 //
			? Result.ok(finalResult)
			: Result.err(new CombinedPropertyError(errors, this.validatorOptions));
	}

	private handlePassthroughStrategy(value: object): Result<I, CombinedPropertyError> {
		const result = this.handleIgnoreStrategy(value);
		return result.isErr() ? result : Result.ok({ ...value, ...result.value } as I);
	}
}

export enum ObjectValidatorStrategy {
	Ignore,
	Strict,
	Passthrough
}
