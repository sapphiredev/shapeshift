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
import { BaseValidator } from './imports';

export class DateValidator extends BaseValidator<Date> {
	public lessThan(date: Date | number | string): this {
		return this.addConstraint(dateLessThan(new Date(date)));
	}

	public lessThanOrEqual(date: Date | number | string): this {
		return this.addConstraint(dateLessThanOrEqual(new Date(date)));
	}

	public greaterThan(date: Date | number | string): this {
		return this.addConstraint(dateGreaterThan(new Date(date)));
	}

	public greaterThanOrEqual(date: Date | number | string): this {
		return this.addConstraint(dateGreaterThanOrEqual(new Date(date)));
	}

	public equal(date: Date | number | string): this {
		const resolved = new Date(date);
		return Number.isNaN(resolved.getTime()) //
			? this.invalid
			: this.addConstraint(dateEqual(resolved));
	}

	public notEqual(date: Date | number | string): this {
		const resolved = new Date(date);
		return Number.isNaN(resolved.getTime()) //
			? this.valid
			: this.addConstraint(dateNotEqual(resolved));
	}

	public get valid(): this {
		return this.addConstraint(dateValid);
	}

	public get invalid(): this {
		return this.addConstraint(dateInvalid);
	}

	protected handle(value: unknown): Result<Date, ValidationError> {
		return value instanceof Date //
			? Result.ok(value)
			: Result.err(new ValidationError('s.date', 'Expected a Date', value));
	}
}
