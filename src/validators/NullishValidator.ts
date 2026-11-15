import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './imports';

export class NullishValidator extends BaseValidator<null | undefined> {
	protected handle(value: unknown): Result<null | undefined, ValidationError> {
		return value === undefined || value === null //
			? Result.ok(value)
			: Result.err(new ValidationError('s.nullish()', this.validatorOptions.message ?? 'Expected undefined or null', value));
	}
}
