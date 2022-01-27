import type { IConstraint } from '../constraints/base/IConstraint';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './imports';

export class ArrayValidator<T> extends BaseValidator<T[]> {
	private readonly validator: BaseValidator<T>;

	public constructor(validator: BaseValidator<T>, constraints: readonly IConstraint<T[]>[] = []) {
		super(constraints);
		this.validator = validator;
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.validator, this.constraints]);
	}

	protected handle(values: unknown): Result<T[], ValidationError | AggregateError> {
		if (!Array.isArray(values)) {
			return Result.err(new ValidationError('ArrayValidator', 'Expected an array', values));
		}

		const errors: Error[] = [];
		const transformed: T[] = [];

		for (const value of values) {
			const result = this.validator.run(value);
			if (result.isOk()) transformed.push(result.value);
			else errors.push(result.error!);
		}

		return errors.length === 0 //
			? Result.ok(transformed)
			: Result.err(new AggregateError(errors, 'Failed to validate at least one entry'));
	}
}
