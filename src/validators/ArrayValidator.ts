import type { IConstraint } from '../constraints/base/IConstraint';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './BaseValidator';

export class ArrayValidator<T> extends BaseValidator<T[]> {
	private readonly validator: BaseValidator<T>;

	public constructor(validator: BaseValidator<T>, constraints: readonly IConstraint<T[]>[] = []) {
		super(constraints);
		this.validator = validator;
	}

	public run(values: unknown): Result<T[], Error> {
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
			: Result.err(new AggregateError(errors, 'Could not match any of the defined validators'));
	}

	public parse(value: unknown): T[] {
		return this.run(value).unwrap();
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.validator, this.constraints]);
	}

	protected handle(): Result<T[], ValidationError> {
		throw new Error('Unreachable');
	}
}
