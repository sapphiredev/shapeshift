import type { IConstraint } from '../constraints/base/IConstraint';
import type { BaseError } from '../lib/errors/BaseError';
import { CombinedPropertyError } from '../lib/errors/CombinedPropertyError';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './imports';

export class TupleValidator<T extends any[]> extends BaseValidator<[...T]> {
	private readonly validators: BaseValidator<[...T]>[] = [];

	public constructor(validators: BaseValidator<[...T]>[], constraints: readonly IConstraint<[...T]>[] = []) {
		super(constraints);
		this.validators = validators;
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.validators, this.constraints]);
	}

	protected handle(values: unknown): Result<[...T], ValidationError | CombinedPropertyError> {
		if (!Array.isArray(values)) {
			return Result.err(new ValidationError('s.tuple(T)', 'Expected an array', values));
		}

		if (values.length !== this.validators.length) {
			return Result.err(new ValidationError('s.tuple(T)', `Expected an array of length ${this.validators.length}`, values));
		}

		const errors: [number, BaseError][] = [];
		const transformed: T = [] as unknown as T;

		for (let i = 0; i < values.length; i++) {
			const result = this.validators[i].run(values[i]);
			if (result.isOk()) transformed.push(result.value);
			else errors.push([i, result.error!]);
		}

		return errors.length === 0 //
			? Result.ok(transformed)
			: Result.err(new CombinedPropertyError(errors));
	}
}
