import type { IConstraint } from '../constraints/base/IConstraint';
import type { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './imports';
import { getValue } from './util/getValue';

export class DefaultValidator<T> extends BaseValidator<T> {
	private readonly validator: BaseValidator<T>;
	private readonly defaultValue: T | (() => T);

	public constructor(validator: BaseValidator<T>, value: T | (() => T), constraints: readonly IConstraint<T>[] = []) {
		super(constraints);
		this.validator = validator;
		this.defaultValue = value;
	}

	protected handle(value: undefined): Result<T, ValidationError | AggregateError> {
		return typeof value === 'undefined' //
			? Result.ok(getValue(this.defaultValue))
			: this.validator['handle'](value); // eslint-disable-line @typescript-eslint/dot-notation
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.validator, this.defaultValue, this.constraints]);
	}
}
