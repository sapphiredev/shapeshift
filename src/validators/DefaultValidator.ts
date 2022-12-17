import type { IConstraint } from '../constraints/base/IConstraint';
import { Result } from '../lib/Result';
import type { ValidatorOptions } from '../lib/util-types';
import type { ValidatorError } from './BaseValidator';
import { BaseValidator } from './imports';
import { getValue } from './util/getValue';

export class DefaultValidator<T> extends BaseValidator<T> {
	private readonly validator: BaseValidator<T>;
	private defaultValue: T | (() => T);

	public constructor(
		validator: BaseValidator<T>,
		value: T | (() => T),
		validatorOptions: ValidatorOptions = {},
		constraints: readonly IConstraint<T>[] = []
	) {
		super(validatorOptions, constraints);
		this.validator = validator;
		this.defaultValue = value;
	}

	public override default(value: Exclude<T, undefined> | (() => Exclude<T, undefined>)): DefaultValidator<Exclude<T, undefined>> {
		const clone = this.clone() as unknown as DefaultValidator<Exclude<T, undefined>>;
		clone.defaultValue = value;
		return clone;
	}

	protected handle(value: unknown): Result<T, ValidatorError> {
		return typeof value === 'undefined' //
			? Result.ok(getValue(this.defaultValue))
			: this.validator['handle'](value); // eslint-disable-line @typescript-eslint/dot-notation
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.validator, this.defaultValue, this.validatorOptions, this.constraints]);
	}
}
