import type { IConstraint } from '../constraints/base/IConstraint';
import { ExpectedValidationError } from '../lib/errors/ExpectedValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './BaseValidator';

export class InstanceValidator<T> extends BaseValidator<T> {
	public readonly expected: Constructor<T>;

	public constructor(expected: Constructor<T>, constraints: readonly IConstraint<T>[] = []) {
		super(constraints);
		this.expected = expected;
	}

	protected handle(value: unknown): Result<T, ExpectedValidationError<Constructor<T>>> {
		return value instanceof this.expected //
			? Result.ok(value)
			: Result.err(new ExpectedValidationError('InstanceValidator', 'Expected', value, this.expected));
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.expected, this.constraints]);
	}
}

export type Constructor<T> = (new (...args: readonly any[]) => T) | (abstract new (...args: readonly any[]) => T);
