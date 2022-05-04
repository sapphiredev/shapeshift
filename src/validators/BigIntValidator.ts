import type { IConstraint } from '../constraints/base/IConstraint';
import {
	bigintDivisibleBy,
	bigintEqual,
	bigintGreaterThan,
	bigintGreaterThanOrEqual,
	bigintLessThan,
	bigintLessThanOrEqual,
	bigintNotEqual
} from '../constraints/BigIntConstraints';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './imports';

export class BigIntValidator<T extends bigint> extends BaseValidator<T> {
	public lessThan(number: bigint): this {
		return this.addConstraint(bigintLessThan(number) as IConstraint<T>);
	}

	public lessThanOrEqual(number: bigint): this {
		return this.addConstraint(bigintLessThanOrEqual(number) as IConstraint<T>);
	}

	public greaterThan(number: bigint): this {
		return this.addConstraint(bigintGreaterThan(number) as IConstraint<T>);
	}

	public greaterThanOrEqual(number: bigint): this {
		return this.addConstraint(bigintGreaterThanOrEqual(number) as IConstraint<T>);
	}

	public equal<N extends bigint>(number: N): BigIntValidator<N> {
		return this.addConstraint(bigintEqual(number) as IConstraint<T>) as unknown as BigIntValidator<N>;
	}

	public notEqual(number: bigint): this {
		return this.addConstraint(bigintNotEqual(number) as IConstraint<T>);
	}

	public get positive(): this {
		return this.greaterThanOrEqual(0n);
	}

	public get negative(): this {
		return this.lessThan(0n);
	}

	public divisibleBy(number: bigint): this {
		return this.addConstraint(bigintDivisibleBy(number) as IConstraint<T>);
	}

	public get abs(): this {
		return this.transform((value) => (value < 0 ? -value : value) as T);
	}

	public intN(bits: number): this {
		return this.transform((value) => BigInt.asIntN(bits, value) as T);
	}

	public uintN(bits: number): this {
		return this.transform((value) => BigInt.asUintN(bits, value) as T);
	}

	protected handle(value: unknown): Result<T, ValidationError> {
		return typeof value === 'bigint' //
			? Result.ok(value as T)
			: Result.err(new ValidationError('s.bigint', 'Expected a bigint primitive', value));
	}
}
