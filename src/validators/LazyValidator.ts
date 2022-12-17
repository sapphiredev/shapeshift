import type { IConstraint } from '../constraints/base/IConstraint';
import type { Result } from '../lib/Result';
import type { Unwrap, ValidatorOptions } from '../lib/util-types';
import { BaseValidator, type ValidatorError } from './imports';

export class LazyValidator<T extends BaseValidator<unknown>, R = Unwrap<T>> extends BaseValidator<R> {
	private readonly validator: (value: unknown) => T;

	public constructor(validator: (value: unknown) => T, validatorOptions: ValidatorOptions = {}, constraints: readonly IConstraint<R>[] = []) {
		super(validatorOptions, constraints);
		this.validator = validator;
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.validator, this.validatorOptions, this.constraints]);
	}

	protected handle(values: unknown): Result<R, ValidatorError> {
		return this.validator(values).run(values) as Result<R, ValidatorError>;
	}
}
