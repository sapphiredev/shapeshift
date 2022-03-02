import type { IConstraint } from '../constraints/base/IConstraint';
import {
	numberDivisibleBy,
	numberEq,
	numberFinite,
	numberGe,
	numberGt,
	numberInt,
	numberLe,
	numberLt,
	numberNaN,
	numberNe,
	numberNeNaN,
	numberSafeInt
} from '../constraints/NumberConstraints';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './imports';

export class NumberValidator<T extends number> extends BaseValidator<T> {
	public lt(number: number): this {
		return this.addConstraint(numberLt(number) as IConstraint<T>);
	}

	public le(number: number): this {
		return this.addConstraint(numberLe(number) as IConstraint<T>);
	}

	public gt(number: number): this {
		return this.addConstraint(numberGt(number) as IConstraint<T>);
	}

	public ge(number: number): this {
		return this.addConstraint(numberGe(number) as IConstraint<T>);
	}

	public eq<N extends number>(number: N): NumberValidator<N> {
		return Number.isNaN(number) //
			? (this.addConstraint(numberNaN as IConstraint<T>) as unknown as NumberValidator<N>)
			: (this.addConstraint(numberEq(number) as IConstraint<T>) as unknown as NumberValidator<N>);
	}

	public ne(number: number): this {
		return Number.isNaN(number) //
			? this.addConstraint(numberNeNaN as IConstraint<T>)
			: this.addConstraint(numberNe(number) as IConstraint<T>);
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
		return this.ge(0);
	}

	public get negative(): this {
		return this.lt(0);
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
