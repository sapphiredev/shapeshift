import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './imports';

export class NeverValidator extends BaseValidator<never> {
	protected handle(value: unknown): Result<never, ValidationError> {
		return Result.err(new ValidationError('s.never()', this.validatorOptions.message ?? 'Expected a value to not be passed', value));
	}
}
