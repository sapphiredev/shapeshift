import {
	dateEqual,
	dateGreaterThan,
	dateGreaterThanOrEqual,
	dateInvalid,
	dateLessThan,
	dateLessThanOrEqual,
	dateNotEqual,
	dateValid
} from '../constraints/DateConstraints';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import type { ValidatorOptions } from '../lib/util-types';
import { BaseValidator } from './imports';

export class DateValidator extends BaseValidator<Date> {
	public lessThan(date: Date | number | string, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(dateLessThan(new Date(date), options));
	}

	public lessThanOrEqual(date: Date | number | string, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(dateLessThanOrEqual(new Date(date), options));
	}

	public greaterThan(date: Date | number | string, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(dateGreaterThan(new Date(date), options));
	}

	public greaterThanOrEqual(date: Date | number | string, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(dateGreaterThanOrEqual(new Date(date), options));
	}

	public equal(date: Date | number | string, options: ValidatorOptions = this.validatorOptions): this {
		const resolved = new Date(date);
		return Number.isNaN(resolved.getTime()) //
			? this.invalid(options)
			: this.addConstraint(dateEqual(resolved, options));
	}

	public notEqual(date: Date | number | string, options: ValidatorOptions = this.validatorOptions): this {
		const resolved = new Date(date);
		return Number.isNaN(resolved.getTime()) //
			? this.valid(options)
			: this.addConstraint(dateNotEqual(resolved, options));
	}

	public valid(options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(dateValid(options));
	}

	public invalid(options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(dateInvalid(options));
	}

	protected handle(value: unknown): Result<Date, ValidationError> {
		return value instanceof Date //
			? Result.ok(value)
			: Result.err(new ValidationError('s.date()', this.validatorOptions.message ?? 'Expected a Date', value));
	}
}
