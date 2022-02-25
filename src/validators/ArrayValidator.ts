import { arrayLengthEq, arrayLengthGe, arrayLengthGt, arrayLengthLe, arrayLengthLt, arrayLengthNe } from '../constraints/ArrayLengthConstraints';
import type { IConstraint } from '../constraints/base/IConstraint';
import type { BaseError } from '../lib/errors/BaseError';
import { CombinedPropertyError } from '../lib/errors/CombinedPropertyError';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './imports';

export class ArrayValidator<T> extends BaseValidator<T[]> {
	private readonly validator: BaseValidator<T>;

	public constructor(validator: BaseValidator<T>, constraints: readonly IConstraint<T[]>[] = []) {
		super(constraints);
		this.validator = validator;
	}

	public lengthLt(length: number): this {
		return this.addConstraint(arrayLengthLt(length) as IConstraint<T[]>);
	}

	public lengthLe(length: number): this {
		return this.addConstraint(arrayLengthLe(length) as IConstraint<T[]>);
	}

	public lengthGt(length: number): this {
		return this.addConstraint(arrayLengthGt(length) as IConstraint<T[]>);
	}

	public lengthGe(length: number): this {
		return this.addConstraint(arrayLengthGe(length) as IConstraint<T[]>);
	}

	public lengthEq(length: number): this {
		return this.addConstraint(arrayLengthEq(length) as IConstraint<T[]>);
	}

	public lengthNe(length: number): this {
		return this.addConstraint(arrayLengthNe(length) as IConstraint<T[]>);
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.validator, this.constraints]);
	}

	protected handle(values: unknown): Result<T[], ValidationError | CombinedPropertyError> {
		if (!Array.isArray(values)) {
			return Result.err(new ValidationError('ArrayValidator', 'Expected an array', values));
		}

		const errors: [number, BaseError][] = [];
		const transformed: T[] = [];

		for (let i = 0; i < values.length; i++) {
			const result = this.validator.run(values[i]);
			if (result.isOk()) transformed.push(result.value);
			else errors.push([i, result.error!]);
		}

		return errors.length === 0 //
			? Result.ok(transformed)
			: Result.err(new CombinedPropertyError(errors));
	}
}
