import type { IConstraint } from '../constraints/base/IConstraint';
import { stringLengthEq, stringLengthGe, stringLengthGt, stringLengthLe, stringLengthLt, stringLengthNe } from '../constraints/StringConstraints';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './imports';

export class StringValidator<T extends string> extends BaseValidator<T> {
	public lengthLe(length: number): this {
		return this.addConstraint(stringLengthLt(length) as IConstraint<T>);
	}

	public lengthLte(length: number): this {
		return this.addConstraint(stringLengthLe(length) as IConstraint<T>);
	}

	public lengthGe(length: number): this {
		return this.addConstraint(stringLengthGt(length) as IConstraint<T>);
	}

	public lengthGte(length: number): this {
		return this.addConstraint(stringLengthGe(length) as IConstraint<T>);
	}

	public lengthEq(length: number): this {
		return this.addConstraint(stringLengthEq(length) as IConstraint<T>);
	}

	public lengthNe(length: number): this {
		return this.addConstraint(stringLengthNe(length) as IConstraint<T>);
	}

	protected handle(value: unknown): Result<T, ValidationError> {
		const conditioned = this.defaultConstraint?.run(value).unwrap() ?? value;
		return typeof conditioned === 'string' //
			? Result.ok(conditioned as T)
			: Result.err(new ValidationError('StringValidator', 'Expected a string primitive', conditioned));
	}
}
