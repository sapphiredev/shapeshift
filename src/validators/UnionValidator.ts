import type { IConstraint } from '../constraints/base/IConstraint';
import type { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './BaseValidator';

export class UnionValidator<T> extends BaseValidator<T> {
	private validators: readonly BaseValidator<T>[];

	public constructor(constraints: readonly IConstraint<T>[] = [], validators: readonly BaseValidator<T>[] = []) {
		super(constraints);
		this.validators = validators;
	}

	public override run(value: unknown): Result<T, AggregateError> {
		const results: Error[] = [];

		for (const validator of this.validators) {
			const result = validator.run(value);
			if (result.isOk()) return result as Result<T, AggregateError>;
			results.push(result.error!);
		}

		return Result.err(new AggregateError(results, 'Could not match any of the defined validators'));
	}

	public override parse(value: unknown): T {
		const results: Error[] = [];

		for (const validator of this.validators) {
			const result = validator.run(value);
			if (result.isOk()) return result.value;
			results.push(result.error!);
		}

		throw new AggregateError(results, 'Could not match any of the defined validators');
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.constraints, this.validators]);
	}

	protected handle(): Result<T, ValidationError> {
		throw new Error('Unreachable');
	}
}
