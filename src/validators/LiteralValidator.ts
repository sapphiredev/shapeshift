import type { IConstraint } from '../constraints/base/IConstraint';
import { ExpectedValidationError } from '../lib/errors/ExpectedValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './imports';

export class LiteralValidator<T> extends BaseValidator<T> {
	public readonly expected: T;

	public constructor(literal: T, constraints: readonly IConstraint<T>[] = []) {
		super(constraints);
		this.expected = literal;
	}

	protected handle(value: unknown): Result<T, ExpectedValidationError<T>> {
		return Object.is(value, this.expected) //
			? Result.ok(value as T)
			: Result.err(new ExpectedValidationError('LiteralValidator', 'Expected values to be equals', value, this.expected));
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.expected, this.constraints]);
	}
}
