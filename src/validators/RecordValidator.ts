import type { IConstraint } from '../constraints/base/IConstraint';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './imports';

export class RecordValidator<T> extends BaseValidator<Record<string, T>> {
	private readonly validator: BaseValidator<T>;

	public constructor(validator: BaseValidator<T>, constraints: readonly IConstraint<Record<string, T>>[] = []) {
		super(constraints);
		this.validator = validator;
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.validator, this.constraints]);
	}

	protected handle(value: unknown): Result<Record<string, T>, ValidationError | AggregateError> {
		const conditioned = this.defaultConstraint?.run(value).unwrap() ?? value;
		if (typeof conditioned !== 'object') {
			return Result.err(new ValidationError('RecordValidator', 'Expected an object', conditioned));
		}

		if (conditioned === null) {
			return Result.err(new ValidationError('RecordValidator', 'Expected the value to not be null', conditioned));
		}

		const errors: Error[] = [];
		const transformed: Record<string, T> = {};

		for (const [key, val] of Object.entries(conditioned!)) {
			const result = this.validator.run(val);
			if (result.isOk()) transformed[key] = result.value;
			else errors.push(result.error!);
		}

		return errors.length === 0 //
			? Result.ok(transformed)
			: Result.err(new AggregateError(errors, 'Failed to validate at least one entry'));
	}
}
