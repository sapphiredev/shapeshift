import { dateEq, dateGe, dateGt, dateInvalid, dateLe, dateLt, dateNe, dateValid } from '../constraints/DateConstraints';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './imports';

export class DateValidator extends BaseValidator<Date> {
	public lt(date: Date | number): this {
		return this.addConstraint(dateLt(new Date(date)));
	}

	public le(date: Date | number): this {
		return this.addConstraint(dateLe(new Date(date)));
	}

	public gt(date: Date | number): this {
		return this.addConstraint(dateGt(new Date(date)));
	}

	public ge(date: Date | number): this {
		return this.addConstraint(dateGe(new Date(date)));
	}

	public eq(date: Date | number): this {
		const resolved = new Date(date);
		return Number.isNaN(resolved.getTime()) //
			? this.addConstraint(dateInvalid)
			: this.addConstraint(dateEq(resolved));
	}

	public ne(date: Date | number): this {
		const resolved = new Date(date);
		return Number.isNaN(resolved.getTime()) //
			? this.addConstraint(dateValid)
			: this.addConstraint(dateNe(resolved));
	}

	protected handle(value: unknown): Result<Date, ValidationError> {
		return value instanceof Date //
			? Result.ok(value)
			: Result.err(new ValidationError('s.date', 'Expected a Date', value));
	}
}
