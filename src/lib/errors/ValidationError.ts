export class ValidationError extends Error {
	public readonly validator: string;
	public readonly given: unknown;

	public constructor(validator: string, message: string, given: unknown) {
		super(message);

		this.validator = validator;
		this.given = given;
	}

	public toJSON() {
		return {
			name: this.name,
			validator: this.validator,
			given: this.given
		};
	}
}
