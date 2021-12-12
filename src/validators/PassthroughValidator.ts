import type { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './BaseValidator';

export class PassthroughValidator<T extends any | unknown> extends BaseValidator<T> {
	protected handle(value: unknown): Result<T, ValidationError> {
		return Result.ok(value as T);
	}
}
