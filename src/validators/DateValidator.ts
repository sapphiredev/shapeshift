import { dateEq, dateGe, dateGt, dateInvalid, dateLe, dateLt, dateNe, dateValid } from '../constraints/DateConstraints';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './imports';

export class DateValidator extends BaseValidator<Date> {
	public lt(date: Date | number | string): this {
		return this.addConstraint(dateLt(new Date(date)));
	}

	public le(date: Date | number | string): this {
		return this.addConstraint(dateLe(new Date(date)));
	}

	public gt(date: Date | number | string): this {
		return this.addConstraint(dateGt(new Date(date)));
	}

	public ge(date: Date | number | string): this {
		return this.addConstraint(dateGe(new Date(date)));
	}

	public eq(date: Date | number | string): this {
		const resolved = new Date(date);
		return Number.isNaN(resolved.getTime()) //
			? this.invalid
			: this.addConstraint(dateEq(resolved));
	}

	public ne(date: Date | number | string): this {
		const resolved = new Date(date);
		return Number.isNaN(resolved.getTime()) //
			? this.valid
			: this.addConstraint(dateNe(resolved));
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
