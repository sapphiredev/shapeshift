import type { IConstraint } from '../constraints/base/IConstraint';
import { ExpectedValidationError } from '../lib/errors/ExpectedValidationError';
import { Result } from '../lib/Result';
import type { Constructor, ValidatorOptions } from '../lib/util-types';
import { BaseValidator } from './imports';

export class InstanceValidator<T> extends BaseValidator<T> {
	public readonly expected: Constructor<T>;

	public constructor(expected: Constructor<T>, validatorOptions: ValidatorOptions = {}, constraints: readonly IConstraint<T>[] = []) {
		super(validatorOptions, constraints);
		this.expected = expected;
	}

	protected handle(value: unknown): Result<T, ExpectedValidationError<Constructor<T>>> {
		return value instanceof this.expected //
			? Result.ok(value)
			: Result.err(new ExpectedValidationError('s.instance(V)', this.validatorOptions.message ?? 'Expected', value, this.expected));
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.expected, this.validatorOptions, this.constraints]);
	}
}
