import type { IConstraint } from '../constraints/base/IConstraint';
import {
	numberDivisibleBy,
	numberEqual,
	numberFinite,
	numberGreaterThan,
	numberGreaterThanOrEqual,
	numberInt,
	numberLessThan,
	numberLessThanOrEqual,
	numberNaN,
	numberNotEqual,
	numberNotNaN,
	numberSafeInt
} from '../constraints/NumberConstraints';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import type { ValidatorOptions } from '../lib/util-types';
import { BaseValidator } from './imports';

export class NumberValidator<T extends number> extends BaseValidator<T> {
	public lessThan(number: number, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(numberLessThan(number, options) as IConstraint<T>);
	}

	public lessThanOrEqual(number: number, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(numberLessThanOrEqual(number, options) as IConstraint<T>);
	}

	public greaterThan(number: number, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(numberGreaterThan(number, options) as IConstraint<T>);
	}

	public greaterThanOrEqual(number: number, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(numberGreaterThanOrEqual(number, options) as IConstraint<T>);
	}

	public equal<N extends number>(number: N, options: ValidatorOptions = this.validatorOptions): NumberValidator<N> {
		return Number.isNaN(number) //
			? (this.addConstraint(numberNaN(options) as IConstraint<T>) as unknown as NumberValidator<N>)
			: (this.addConstraint(numberEqual(number, options) as IConstraint<T>) as unknown as NumberValidator<N>);
	}

	public notEqual(number: number, options: ValidatorOptions = this.validatorOptions): this {
		return Number.isNaN(number) //
			? this.addConstraint(numberNotNaN(options) as IConstraint<T>)
			: this.addConstraint(numberNotEqual(number, options) as IConstraint<T>);
	}

	public int(options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(numberInt(options) as IConstraint<T>);
	}

	public safeInt(options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(numberSafeInt(options) as IConstraint<T>);
	}

	public finite(options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(numberFinite(options) as IConstraint<T>);
	}

	public positive(options: ValidatorOptions = this.validatorOptions): this {
		return this.greaterThanOrEqual(0, options);
	}

	public negative(options: ValidatorOptions = this.validatorOptions): this {
		return this.lessThan(0, options);
	}

	public divisibleBy(divider: number, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(numberDivisibleBy(divider, options) as IConstraint<T>);
	}

	public abs(options: ValidatorOptions = this.validatorOptions): this {
		return this.transform(Math.abs as (value: number) => T, options);
	}

	public sign(options: ValidatorOptions = this.validatorOptions): this {
		return this.transform(Math.sign as (value: number) => T, options);
	}

	public trunc(options: ValidatorOptions = this.validatorOptions): this {
		return this.transform(Math.trunc as (value: number) => T, options);
	}

	public floor(options: ValidatorOptions = this.validatorOptions): this {
		return this.transform(Math.floor as (value: number) => T, options);
	}

	public fround(options: ValidatorOptions = this.validatorOptions): this {
		return this.transform(Math.fround as (value: number) => T, options);
	}

	public round(options: ValidatorOptions = this.validatorOptions): this {
		return this.transform(Math.round as (value: number) => T, options);
	}

	public ceil(options: ValidatorOptions = this.validatorOptions): this {
		return this.transform(Math.ceil as (value: number) => T, options);
	}

	protected handle(value: unknown): Result<T, ValidationError> {
		return typeof value === 'number' //
			? Result.ok(value as T)
			: Result.err(new ValidationError('s.number()', this.validatorOptions.message ?? 'Expected a number primitive', value));
	}
}
