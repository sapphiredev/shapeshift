import type { IConstraint } from '../constraints/base/IConstraint';
import type { BaseError } from '../lib/errors/BaseError';
import { CombinedError } from '../lib/errors/CombinedError';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import type { ValidatorOptions } from '../lib/util-types';
import { BaseValidator } from './imports';

export class SetValidator<T> extends BaseValidator<Set<T>> {
	private readonly validator: BaseValidator<T>;

	public constructor(validator: BaseValidator<T>, validatorOptions?: ValidatorOptions, constraints: readonly IConstraint<Set<T>>[] = []) {
		super(validatorOptions, constraints);
		this.validator = validator;
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.validator, this.validatorOptions, this.constraints]);
	}

	protected handle(values: unknown): Result<Set<T>, ValidationError | CombinedError> {
		if (!(values instanceof Set)) {
			return Result.err(new ValidationError('s.set(T)', this.validatorOptions.message ?? 'Expected a set', values));
		}

		if (!this.shouldRunConstraints) {
			return Result.ok(values);
		}

		const errors: BaseError[] = [];
		const transformed = new Set<T>();

		for (const value of values) {
			const result = this.validator.run(value);
			if (result.isOk()) transformed.add(result.value);
			else errors.push(result.error!);
		}

		return errors.length === 0 //
			? Result.ok(transformed)
			: Result.err(new CombinedError(errors, this.validatorOptions));
	}
}
