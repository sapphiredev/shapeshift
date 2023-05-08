import { getGlobalValidationEnabled } from '../lib/configs';
import { Result } from '../lib/Result';
import { ArrayValidator, DefaultValidator, LiteralValidator, NullishValidator, SetValidator, UnionValidator } from './imports';
import { getValue } from './util/getValue';
import { whenConstraint, type WhenKey, type WhenOptions } from '../constraints/ObjectConstrains';
import type { CombinedError } from '../lib/errors/CombinedError';
import type { CombinedPropertyError } from '../lib/errors/CombinedPropertyError';
import type { UnknownEnumValueError } from '../lib/errors/UnknownEnumValueError';
import type { ValidationError } from '../lib/errors/ValidationError';
import type { BaseConstraintError, InferResultType } from '../type-exports';
import type { IConstraint } from '../constraints/base/IConstraint';
import type { BaseError } from '../lib/errors/BaseError';

export abstract class BaseValidator<T> {
	public description?: string;
	protected parent?: object;
	protected constraints: readonly IConstraint<T>[] = [];
	protected isValidationEnabled: boolean | (() => boolean) | null = null;

	public constructor(constraints: readonly IConstraint<T>[] = []) {
		this.constraints = constraints;
	}

	public setParent(parent: object): this {
		this.parent = parent;
		return this;
	}

	public get optional(): UnionValidator<T | undefined> {
		return new UnionValidator([new LiteralValidator(undefined), this.clone()]);
	}

	public get nullable(): UnionValidator<T | null> {
		return new UnionValidator([new LiteralValidator(null), this.clone()]);
	}

	public get nullish(): UnionValidator<T | null | undefined> {
		return new UnionValidator([new NullishValidator(), this.clone()]);
	}

	public get array(): ArrayValidator<T[]> {
		return new ArrayValidator<T[]>(this.clone());
	}

	public get set(): SetValidator<T> {
		return new SetValidator<T>(this.clone());
	}

	public or<O>(...predicates: readonly BaseValidator<O>[]): UnionValidator<T | O> {
		return new UnionValidator<T | O>([this.clone(), ...predicates]);
	}

	public transform(cb: (value: T) => T): this;
	public transform<O>(cb: (value: T) => O): BaseValidator<O>;
	public transform<O>(cb: (value: T) => O): BaseValidator<O> {
		return this.addConstraint({ run: (input) => Result.ok(cb(input) as unknown as T) }) as unknown as BaseValidator<O>;
	}

	public reshape(cb: (input: T) => Result<T>): this;
	public reshape<R extends Result<unknown>, O = InferResultType<R>>(cb: (input: T) => R): BaseValidator<O>;
	public reshape<R extends Result<unknown>, O = InferResultType<R>>(cb: (input: T) => R): BaseValidator<O> {
		return this.addConstraint({ run: cb as unknown as (input: T) => Result<T, BaseConstraintError<T>> }) as unknown as BaseValidator<O>;
	}

	public default(value: Exclude<T, undefined> | (() => Exclude<T, undefined>)): DefaultValidator<Exclude<T, undefined>> {
		return new DefaultValidator(this.clone() as unknown as BaseValidator<Exclude<T, undefined>>, value);
	}

	public when<Key extends WhenKey, This extends BaseValidator<any> = this>(key: Key, options: WhenOptions<This, Key>): this {
		return this.addConstraint(whenConstraint<This, T, Key>(key, options, this as unknown as This));
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
		const clone: this = Reflect.construct(this.constructor, [this.constraints]);
		clone.isValidationEnabled = this.isValidationEnabled;
		return clone;
	}

	protected abstract handle(value: unknown): Result<T, ValidatorError>;

	protected addConstraint(constraint: IConstraint<T>): this {
		const clone = this.clone();
		clone.constraints = clone.constraints.concat(constraint);
		return clone;
	}
}

export type ValidatorError = ValidationError | CombinedError | CombinedPropertyError | UnknownEnumValueError;
