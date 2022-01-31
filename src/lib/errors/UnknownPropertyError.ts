import type { InspectOptionsStylized } from 'util';
import { BaseError, customInspectSymbolStackLess } from './BaseError';

export class UnknownPropertyError extends BaseError {
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

	// TODO
	public [customInspectSymbolStackLess](depth: number, options: InspectOptionsStylized): string {
		void depth;
		void options;

		throw new Error('Method not implemented.');
	}
}
