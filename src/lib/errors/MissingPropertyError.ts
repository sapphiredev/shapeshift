export class MissingPropertyError extends Error {
	public readonly property: PropertyKey;

	public constructor(property: PropertyKey) {
		super(`Expected property "${String(property)}" is missing`);

		this.property = property;
	}

	public toJSON() {
		return {
			name: this.name,
			property: this.property
		};
	}
}
