import type { IConstraint } from '../constraints/base/IConstraint';
import { booleanFalse, booleanTrue } from '../constraints/BooleanConstraints';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './imports';

export class BooleanValidator<T extends boolean = boolean> extends BaseValidator<T> {
	public get true(): BooleanValidator<true> {
		return this.addConstraint(booleanTrue as IConstraint<T>) as BooleanValidator<true>;
	}

	public get false(): BooleanValidator<false> {
		return this.addConstraint(booleanFalse as IConstraint<T>) as BooleanValidator<false>;
	}

	public eq<R extends true | false>(value: R): BooleanValidator<R> {
		return (value ? this.true : this.false) as BooleanValidator<R>;
	}

	public ne<R extends true | false>(value: R): BooleanValidator<R> {
		return (value ? this.false : this.true) as BooleanValidator<R>;
	}

	protected handle(value: unknown): Result<T, ValidationError> {
		const conditioned = this.defaultConstraint?.run(value).unwrap() ?? value;
		return typeof conditioned === 'boolean' //
			? Result.ok(conditioned as T)
			: Result.err(new ValidationError('BooleanValidator', 'Expected a boolean primitive', conditioned));
	}
}
