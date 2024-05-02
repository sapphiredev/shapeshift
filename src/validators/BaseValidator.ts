import type { IConstraint } from '../constraints/base/IConstraint';
import { whenConstraint, type WhenKey, type WhenOptions } from '../constraints/ObjectConstrains';
import { getGlobalValidationEnabled } from '../lib/configs';
import type { BaseConstraintError } from '../lib/errors/BaseConstraintError';
import type { BaseError } from '../lib/errors/BaseError';
import type { CombinedError } from '../lib/errors/CombinedError';
import type { CombinedPropertyError } from '../lib/errors/CombinedPropertyError';
import type { UnknownEnumValueError } from '../lib/errors/UnknownEnumValueError';
import type { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import type { InferResultType, ValidatorOptions } from '../lib/util-types';
import { ArrayValidator, DefaultValidator, LiteralValidator, NullishValidator, SetValidator, UnionValidator } from './imports';
import { getValue } from './util/getValue';

export abstract class BaseValidator<T> {
	public description?: string;
	protected validatorOptions: ValidatorOptions;
	protected parent?: object;
	protected constraints: readonly IConstraint<T>[] = [];
	protected isValidationEnabled: boolean | (() => boolean) | null = null;

	public constructor(validatorOptions: ValidatorOptions = {}, constraints: readonly IConstraint<T>[] = []) {
		this.constraints = constraints;
		this.validatorOptions = validatorOptions;
	}

	public setParent(parent: object): this {
		this.parent = parent;
		return this;
	}

	public optional(options: ValidatorOptions = this.validatorOptions): UnionValidator<T | undefined> {
		return new UnionValidator([new LiteralValidator(undefined, options), this.clone()], options);
	}

	public nullable(options: ValidatorOptions = this.validatorOptions): UnionValidator<T | null> {
		return new UnionValidator([new LiteralValidator(null, options), this.clone()], options);
	}

	public nullish(options: ValidatorOptions = this.validatorOptions): UnionValidator<T | null | undefined> {
		return new UnionValidator([new NullishValidator(options), this.clone()], options);
	}

	public array(options: ValidatorOptions = this.validatorOptions): ArrayValidator<T[]> {
		return new ArrayValidator<T[]>(this.clone(), options);
	}

	public set(options: ValidatorOptions = this.validatorOptions): SetValidator<T> {
		return new SetValidator<T>(this.clone(), options);
	}

	public or<O>(...predicates: readonly BaseValidator<O>[]): UnionValidator<T | O> {
		return new UnionValidator<T | O>([this.clone(), ...predicates], this.validatorOptions);
	}

	public transform(cb: (value: T) => T, options?: ValidatorOptions): this;
	public transform<O>(cb: (value: T) => O, options?: ValidatorOptions): BaseValidator<O>;
	public transform<O>(cb: (value: T) => O, options: ValidatorOptions = this.validatorOptions): BaseValidator<O> {
		return this.addConstraint(
			{
				run: (input) => Result.ok(cb(input) as unknown as T)
			},
			options
		) as unknown as BaseValidator<O>;
	}

	public reshape(cb: (input: T) => Result<T>, options?: ValidatorOptions): this;
	public reshape<R extends Result<unknown>, O = InferResultType<R>>(cb: (input: T) => R, options?: ValidatorOptions): BaseValidator<O>;
	public reshape<R extends Result<unknown>, O = InferResultType<R>>(
		cb: (input: T) => R,
		options: ValidatorOptions = this.validatorOptions
	): BaseValidator<O> {
		return this.addConstraint(
			{
				run: cb as unknown as (input: T) => Result<T, BaseConstraintError<T>>
			},
			options
		) as unknown as BaseValidator<O>;
	}

	public default(
		value: Exclude<T, undefined> | (() => Exclude<T, undefined>),
		options: ValidatorOptions = this.validatorOptions
	): DefaultValidator<Exclude<T, undefined>> {
		return new DefaultValidator(this.clone() as unknown as BaseValidator<Exclude<T, undefined>>, value, options);
	}

	public when<Key extends WhenKey, This extends BaseValidator<any> = this>(
		key: Key,
		options: WhenOptions<This, Key>,
		validatorOptions?: ValidatorOptions
	): this {
		return this.addConstraint(whenConstraint<This, T, Key>(key, options, this as unknown as This, validatorOptions));
	}

	public describe(description: string): this {
		const clone = this.clone();
		clone.description = description;
		return clone;
	}

	public run(value: unknown): Result<T, BaseError> {
		let result = this.handle(value) as Result<T, BaseError>;
		if (result.isErr()) return result;

		for (const constraint of this.constraints) {
			result = constraint.run(result.value as T, this.parent);
			if (result.isErr()) break;
		}

		return result;
	}

	public parse<R extends T = T>(value: unknown): R {
		// If validation is disabled (at the validator or global level), we only run the `handle` method, which will do some basic checks
		// (like that the input is a string for a string validator)
		if (!this.shouldRunConstraints) {
			return this.handle(value).unwrap() as R;
		}

		return this.constraints.reduce((v, constraint) => constraint.run(v).unwrap(), this.handle(value).unwrap()) as R;
	}

	public is<R extends T = T>(value: unknown): value is R {
		return this.run(value).isOk();
	}

	/**
	 * Sets if the validator should also run constraints or just do basic checks.
	 * @param isValidationEnabled Whether this validator should be enabled or disabled. You can pass boolean or a function returning boolean which will be called just before parsing.
	 * Set to `null` to go off of the global configuration.
	 */
	public setValidationEnabled(isValidationEnabled: boolean | (() => boolean) | null): this {
		const clone = this.clone();
		clone.isValidationEnabled = isValidationEnabled;
		return clone;
	}

	public getValidationEnabled() {
		return getValue(this.isValidationEnabled);
	}

	protected get shouldRunConstraints(): boolean {
		return getValue(this.isValidationEnabled) ?? getGlobalValidationEnabled();
	}

	protected clone(): this {
		const clone: this = Reflect.construct(this.constructor, [this.validatorOptions, this.constraints]);
		clone.isValidationEnabled = this.isValidationEnabled;
		return clone;
	}

	protected abstract handle(value: unknown): Result<T, ValidatorError>;

	protected addConstraint(constraint: IConstraint<T>, validatorOptions: ValidatorOptions = this.validatorOptions): this {
		const clone = this.clone();
		clone.validatorOptions = validatorOptions;
		clone.constraints = clone.constraints.concat(constraint);
		return clone;
	}
}

export type ValidatorError = ValidationError | CombinedError | CombinedPropertyError | UnknownEnumValueError;
