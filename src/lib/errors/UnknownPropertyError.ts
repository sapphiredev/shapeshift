export class UnknownPropertyError extends Error {
	public readonly property: PropertyKey;
	public readonly value: unknown;

	public constructor(property: PropertyKey, value: unknown) {
		super('Unknown property received');

		this.property = property;
		this.value = value;
	}

	public toJSON() {
		return {
			name: this.name,
			property: this.property,
			value: this.value
		};
	}
}
