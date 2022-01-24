import type { IConstraint } from '../constraints/base/IConstraint';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './imports';

export class MapValidator<K, V> extends BaseValidator<Map<K, V>> {
	private readonly keyValidator: BaseValidator<K>;
	private readonly valueValidator: BaseValidator<V>;

	public constructor(keyValidator: BaseValidator<K>, valueValidator: BaseValidator<V>, constraints: readonly IConstraint<Map<K, V>>[] = []) {
		super(constraints);
		this.keyValidator = keyValidator;
		this.valueValidator = valueValidator;
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.keyValidator, this.valueValidator, this.constraints]);
	}

	protected handle(value: unknown): Result<Map<K, V>, ValidationError | AggregateError> {
		if (!(value instanceof Map)) {
			return Result.err(new ValidationError('MapValidator', 'Expected a map', value));
		}

		const errors: Error[] = [];
		const transformed = new Map<K, V>();

		for (const [key, val] of value.entries()) {
			const keyResult = this.keyValidator.run(key);
			const valueResult = this.valueValidator.run(val);
			const results = [keyResult, valueResult].filter((result) => result.isErr());
			if (results.length === 0) transformed.set(keyResult.value!, valueResult.value!);
			else errors.push(...results.map((result) => result.error!));
		}

		return errors.length === 0 //
			? Result.ok(transformed)
			: Result.err(new AggregateError(errors, 'Failed to validate at least one entry'));
	}
}
