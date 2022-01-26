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
		const conditioned = this.defaultConstraint?.run(value).unwrap() ?? value;
		return Object.is(conditioned, this.expected) //
			? Result.ok(conditioned as T)
			: Result.err(new ExpectedValidationError('LiteralValidator', 'Expected', conditioned, this.expected));
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.expected, this.constraints]);
	}
}
