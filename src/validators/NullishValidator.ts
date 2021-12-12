import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './BaseValidator';

export class NullishValidator extends BaseValidator<undefined | null> {
	protected handle(value: unknown): Result<undefined | null, ValidationError> {
		return value === undefined || value === null //
			? Result.ok(value)
			: Result.err(new ValidationError('NullishValidator', 'Expected undefined or null', value));
	}
}
