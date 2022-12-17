import type { IConstraint } from '../constraints/base/IConstraint';
import type { BaseError } from '../lib/errors/BaseError';
import { CombinedPropertyError } from '../lib/errors/CombinedPropertyError';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import type { ValidatorOptions } from '../lib/util-types';
import { BaseValidator } from './imports';

export class RecordValidator<T> extends BaseValidator<Record<string, T>> {
	private readonly validator: BaseValidator<T>;

	public constructor(
		validator: BaseValidator<T>,
		validatorOptions: ValidatorOptions = {},
		constraints: readonly IConstraint<Record<string, T>>[] = []
	) {
		super(validatorOptions, constraints);
		this.validator = validator;
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.validator, this.validatorOptions, this.constraints]);
	}

	protected handle(value: unknown): Result<Record<string, T>, ValidationError | CombinedPropertyError> {
		if (typeof value !== 'object') {
			return Result.err(new ValidationError('s.record(T)', this.validatorOptions.message ?? 'Expected an object', value));
		}

		if (value === null) {
			return Result.err(new ValidationError('s.record(T)', this.validatorOptions.message ?? 'Expected the value to not be null', value));
		}

		if (Array.isArray(value)) {
			return Result.err(new ValidationError('s.record(T)', this.validatorOptions.message ?? 'Expected the value to not be an array', value));
		}

		if (!this.shouldRunConstraints) {
			return Result.ok(value as Record<string, T>);
		}

		const errors: [string, BaseError][] = [];
		const transformed: Record<string, T> = {};

		for (const [key, val] of Object.entries(value!)) {
			const result = this.validator.run(val);
			if (result.isOk()) transformed[key] = result.value;
			else errors.push([key, result.error!]);
		}

		return errors.length === 0 //
			? Result.ok(transformed)
			: Result.err(new CombinedPropertyError(errors, this.validatorOptions));
	}
}
