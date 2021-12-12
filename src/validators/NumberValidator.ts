import type { IConstraint } from '../constraints/base/IConstraint';
import {
	numberEq,
	numberFinite,
	numberGt,
	numberGe,
	numberInt,
	numberLt,
	numberLe,
	numberNaN,
	numberNe,
	numberNeNaN,
	numberSafeInt
} from '../constraints/NumberConstraints';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './BaseValidator';

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

	protected handle(value: unknown): Result<T, ValidationError> {
		return typeof value === 'number' //
			? Result.ok(value as T)
			: Result.err(new ValidationError('NumberValidator', 'Expected a number primitive', value));
	}
}
