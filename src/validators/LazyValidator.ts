import type { Result } from '../lib/Result';
import type { IConstraint, Unwrap } from '../type-exports';
import { BaseValidator, type ValidatorError } from './imports';

export class LazyValidator<T extends BaseValidator<unknown>, R = Unwrap<T>> extends BaseValidator<R> {
	private readonly validator: (value: unknown) => T;

	public constructor(validator: (value: unknown) => T, constraints: readonly IConstraint<R>[] = []) {
		super(constraints);
		this.validator = validator;
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.validator, this.constraints]);
	}

	protected handle(values: unknown): Result<R, ValidatorError> {
		return this.validator(values).run(values) as Result<R, ValidatorError>;
	}
}
