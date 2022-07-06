import { Result } from '../lib/Result';
import type { IConstraint } from '../type-exports';
import { BaseValidator, ValidatorError } from './imports';

export class LazyValidator<T> extends BaseValidator<T> {
	private readonly validator: (value: unknown) => BaseValidator<T>;

	public constructor(validator: (value: unknown) => BaseValidator<T>, constraints: readonly IConstraint<T>[] = []) {
		super(constraints);
		this.validator = validator;
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.validator, this.constraints]);
	}

	protected handle(values: unknown): Result<T, ValidatorError> {
		if (!this.shouldRunConstraints) {
			return Result.ok(values as T);
		}

		// eslint-disable-next-line @typescript-eslint/dot-notation
		return this.validator(values)['handle'](values);
	}
}
