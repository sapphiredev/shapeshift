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
import type { ValidatorOptions } from '../lib/util-types';
import { BaseValidator } from './imports';

export class BigIntValidator<T extends bigint> extends BaseValidator<T> {
	public lessThan(number: bigint, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(bigintLessThan(number, options) as IConstraint<T>);
	}

	public lessThanOrEqual(number: bigint, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(bigintLessThanOrEqual(number, options) as IConstraint<T>);
	}

	public greaterThan(number: bigint, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(bigintGreaterThan(number, options) as IConstraint<T>);
	}

	public greaterThanOrEqual(number: bigint, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(bigintGreaterThanOrEqual(number, options) as IConstraint<T>);
	}

	public equal<N extends bigint>(number: N, options: ValidatorOptions = this.validatorOptions): BigIntValidator<N> {
		return this.addConstraint(bigintEqual(number, options) as IConstraint<T>) as unknown as BigIntValidator<N>;
	}

	public notEqual(number: bigint, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(bigintNotEqual(number, options) as IConstraint<T>);
	}

	public positive(options: ValidatorOptions = this.validatorOptions): this {
		return this.greaterThanOrEqual(0n, options);
	}

	public negative(options: ValidatorOptions = this.validatorOptions): this {
		return this.lessThan(0n, options);
	}

	public divisibleBy(number: bigint, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(bigintDivisibleBy(number, options) as IConstraint<T>);
	}

	public abs(options: ValidatorOptions = this.validatorOptions): this {
		return this.transform((value) => (value < 0 ? -value : value) as T, options);
	}

	public intN(bits: number, options: ValidatorOptions = this.validatorOptions): this {
		return this.transform((value) => BigInt.asIntN(bits, value) as T, options);
	}

	public uintN(bits: number, options: ValidatorOptions = this.validatorOptions): this {
		return this.transform((value) => BigInt.asUintN(bits, value) as T, options);
	}

	protected handle(value: unknown): Result<T, ValidationError> {
		return typeof value === 'bigint' //
			? Result.ok(value as T)
			: Result.err(new ValidationError('s.bigint()', this.validatorOptions.message ?? 'Expected a bigint primitive', value));
	}
}
