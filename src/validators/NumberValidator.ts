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
import { BaseValidator } from './imports';

export class NumberValidator<T extends number> extends BaseValidator<T> {
	public lessThan(number: number): this {
		return this.addConstraint(numberLessThan(number) as IConstraint<T>);
	}

	public lessThanOrEqual(number: number): this {
		return this.addConstraint(numberLessThanOrEqual(number) as IConstraint<T>);
	}

	public greaterThan(number: number): this {
		return this.addConstraint(numberGreaterThan(number) as IConstraint<T>);
	}

	public greaterThanOrEqual(number: number): this {
		return this.addConstraint(numberGreaterThanOrEqual(number) as IConstraint<T>);
	}

	public equal<N extends number>(number: N): NumberValidator<N> {
		return Number.isNaN(number) //
			? (this.addConstraint(numberNaN as IConstraint<T>) as unknown as NumberValidator<N>)
			: (this.addConstraint(numberEqual(number) as IConstraint<T>) as unknown as NumberValidator<N>);
	}

	public notEqual(number: number): this {
		return Number.isNaN(number) //
			? this.addConstraint(numberNotNaN as IConstraint<T>)
			: this.addConstraint(numberNotEqual(number) as IConstraint<T>);
	}

	public get int(): this {
		return this.addConstraint(numberInt as IConstraint<T>);
	}

	public get safeInt(): this {
		return this.addConstraint(numberSafeInt as IConstraint<T>);
	}

	public get finite(): this {
		return this.addConstraint(numberFinite as IConstraint<T>);
	}

	public get positive(): this {
		return this.greaterThanOrEqual(0);
	}

	public get negative(): this {
		return this.lessThan(0);
	}

	public divisibleBy(divider: number): this {
		return this.addConstraint(numberDivisibleBy(divider) as IConstraint<T>);
	}

	public get abs(): this {
		return this.transform(Math.abs as (value: number) => T);
	}

	public get sign(): this {
		return this.transform(Math.sign as (value: number) => T);
	}

	public get trunc(): this {
		return this.transform(Math.trunc as (value: number) => T);
	}

	public get floor(): this {
		return this.transform(Math.floor as (value: number) => T);
	}

	public get fround(): this {
		return this.transform(Math.fround as (value: number) => T);
	}

	public get round(): this {
		return this.transform(Math.round as (value: number) => T);
	}

	public get ceil(): this {
		return this.transform(Math.ceil as (value: number) => T);
	}

	protected handle(value: unknown): Result<T, ValidationError> {
		return typeof value === 'number' //
			? Result.ok(value as T)
			: Result.err(new ValidationError('s.number', 'Expected a number primitive', value));
	}
}
