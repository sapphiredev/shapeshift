import type { IConstraint } from '../constraints/base/IConstraint';
import type { BaseError } from '../lib/errors/BaseError';
import { CombinedPropertyError } from '../lib/errors/CombinedPropertyError';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import type { ValidatorOptions } from '../lib/util-types';
import { BaseValidator } from './imports';

export class MapValidator<K, V> extends BaseValidator<Map<K, V>> {
	private readonly keyValidator: BaseValidator<K>;
	private readonly valueValidator: BaseValidator<V>;

	public constructor(
		keyValidator: BaseValidator<K>,
		valueValidator: BaseValidator<V>,
		validatorOptions: ValidatorOptions = {},
		constraints: readonly IConstraint<Map<K, V>>[] = []
	) {
		super(validatorOptions, constraints);
		this.keyValidator = keyValidator;
		this.valueValidator = valueValidator;
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.keyValidator, this.valueValidator, this.validatorOptions, this.constraints]);
	}

	protected handle(value: unknown): Result<Map<K, V>, ValidationError | CombinedPropertyError> {
		if (!(value instanceof Map)) {
			return Result.err(new ValidationError('s.map(K, V)', this.validatorOptions.message ?? 'Expected a map', value));
		}

		if (!this.shouldRunConstraints) {
			return Result.ok(value);
		}

		const errors: [string, BaseError][] = [];
		const transformed = new Map<K, V>();

		for (const [key, val] of value.entries()) {
			const keyResult = this.keyValidator.run(key);
			const valueResult = this.valueValidator.run(val);
			const { length } = errors;
			if (keyResult.isErr()) errors.push([key, keyResult.error]);
			if (valueResult.isErr()) errors.push([key, valueResult.error]);
			if (errors.length === length) transformed.set(keyResult.value!, valueResult.value!);
		}

		return errors.length === 0 //
			? Result.ok(transformed)
			: Result.err(new CombinedPropertyError(errors, this.validatorOptions));
	}
}
