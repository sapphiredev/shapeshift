import type { InspectOptionsStylized } from 'node:util';
import { BaseError, customInspectSymbolStackLess } from './BaseError';

export class MissingPropertyError extends BaseError {
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

	// TODO
	public [customInspectSymbolStackLess](depth: number, options: InspectOptionsStylized): string {
		void depth;
		void options;

		throw new Error('Method not implemented.');
	}
}
