import type { IConstraint } from '../constraints/base/IConstraint';
import { booleanFalse, booleanTrue } from '../constraints/BooleanConstraints';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import type { ValidatorOptions } from '../lib/util-types';
import { BaseValidator } from './imports';

export class BooleanValidator<T extends boolean = boolean> extends BaseValidator<T> {
	public true(options: ValidatorOptions = this.validatorOptions): BooleanValidator<true> {
		return this.addConstraint(booleanTrue(options) as IConstraint<T>) as BooleanValidator<true>;
	}

	public false(options: ValidatorOptions = this.validatorOptions): BooleanValidator<false> {
		return this.addConstraint(booleanFalse(options) as IConstraint<T>) as BooleanValidator<false>;
	}

	public equal<R extends true | false>(value: R, options: ValidatorOptions = this.validatorOptions): BooleanValidator<R> {
		return (value ? this.true(options) : this.false(options)) as BooleanValidator<R>;
	}

	public notEqual<R extends true | false>(value: R, options: ValidatorOptions = this.validatorOptions): BooleanValidator<R> {
		return (value ? this.false(options) : this.true(options)) as BooleanValidator<R>;
	}

	protected handle(value: unknown): Result<T, ValidationError> {
		return typeof value === 'boolean' //
			? Result.ok(value as T)
			: Result.err(new ValidationError('s.boolean()', this.validatorOptions.message ?? 'Expected a boolean primitive', value));
	}
}
