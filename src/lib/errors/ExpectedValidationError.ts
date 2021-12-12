import { ValidationError } from './ValidationError';

export class ExpectedValidationError<T> extends ValidationError {
	public readonly expected: T;

	public constructor(validator: string, message: string, given: unknown, expected: T) {
		super(validator, message, given);
		this.expected = expected;
	}

	public toJSON() {
		return {
			name: this.name,
			validator: this.validator,
			given: this.given,
			expected: this.expected
		};
	}
}
