import type { InspectOptionsStylized } from 'util';
import { BaseError, customInspectSymbolStackLess } from './BaseError';

export class MissingPropertyError extends BaseError {
	public readonly property: PropertyKey;

	public constructor(property: PropertyKey) {
		super('A required property is missing');
		this.property = property;
	}

	public toJSON() {
		return {
			name: this.name,
			property: this.property
		};
	}

	protected [customInspectSymbolStackLess](depth: number, options: InspectOptionsStylized): string {
		const property = options.stylize(this.property.toString(), 'string');
		if (depth < 0) {
			return options.stylize(`[MissingPropertyError: ${property}]`, 'special');
		}

		const header = `${options.stylize('MissingPropertyError', 'special')} > ${property}`;
		const message = options.stylize(this.message, 'regexp');
		return `${header}\n  ${message}`;
	}
}
