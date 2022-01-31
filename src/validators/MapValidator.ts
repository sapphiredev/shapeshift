import type { IConstraint } from '../constraints/base/IConstraint';
import type { BaseError } from '../lib/errors/BaseError';
import { CombinedError } from '../lib/errors/CombinedError';
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

	protected handle(value: unknown): Result<Map<K, V>, ValidationError | CombinedError> {
		if (!(value instanceof Map)) {
			return Result.err(new ValidationError('MapValidator', 'Expected a map', value));
		}

		const errors: BaseError[] = [];
		const transformed = new Map<K, V>();

		for (const [key, val] of value.entries()) {
			const keyResult = this.keyValidator.run(key);
			const valueResult = this.valueValidator.run(val);
			const { length } = errors;
			if (keyResult.isErr()) errors.push(keyResult.error);
			if (valueResult.isErr()) errors.push(valueResult.error);
			if (errors.length === length) transformed.set(keyResult.value!, valueResult.value!);
		}

		return errors.length === 0 //
			? Result.ok(transformed)
			: Result.err(new CombinedError(errors));
	}
}
