export class ConstraintError<T = unknown> extends Error {
	public readonly constraint: string;
	public readonly given: T;
	public readonly expected: unknown;

	public constructor(validator: string, message: string, given: T, expected: unknown) {
		super(message);
		this.constraint = validator;
		this.given = given;
		this.expected = expected;
	}

	public toJSON() {
		return {
			name: this.name,
			constraint: this.constraint,
			given: this.given,
			expected: this.expected
		};
	}
}

export interface ConstraintErrorMessageBuilder<T = unknown> {
	(given: T, expected: unknown): string;
}
