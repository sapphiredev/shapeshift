import type { IConstraint } from '../constraints/base/IConstraint';
import type { BaseError } from '../lib/errors/BaseError';
import { CombinedPropertyError } from '../lib/errors/CombinedPropertyError';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import type { ValidatorOptions } from '../lib/util-types';
import { BaseValidator } from './imports';

export class TupleValidator<T extends any[]> extends BaseValidator<[...T]> {
	private readonly validators: BaseValidator<[...T]>[] = [];

	public constructor(
		validators: BaseValidator<[...T]>[],
		validatorOptions: ValidatorOptions = {},
		constraints: readonly IConstraint<[...T]>[] = []
	) {
		super(validatorOptions, constraints);
		this.validators = validators;
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.validators, this.validatorOptions, this.constraints]);
	}

	protected handle(values: unknown): Result<[...T], ValidationError | CombinedPropertyError> {
		if (!Array.isArray(values)) {
			return Result.err(new ValidationError('s.tuple(T)', this.validatorOptions.message ?? 'Expected an array', values));
		}

		if (values.length !== this.validators.length) {
			return Result.err(
				new ValidationError('s.tuple(T)', this.validatorOptions.message ?? `Expected an array of length ${this.validators.length}`, values)
			);
		}

		if (!this.shouldRunConstraints) {
			return Result.ok(values as [...T]);
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
			: Result.err(new CombinedPropertyError(errors, this.validatorOptions));
	}
}
