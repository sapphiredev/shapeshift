import { inspect, type InspectOptionsStylized } from 'util';
import type { ValidatorOptions } from '../util-types';
import { BaseError, customInspectSymbolStackLess } from './BaseError';
import type { UnknownEnumKeyErrorJsonified } from './error-types';

export class UnknownPropertyError extends BaseError {
	public readonly property: PropertyKey;
	public readonly value: unknown;

	public constructor(property: PropertyKey, value: unknown, options?: ValidatorOptions) {
		super(options?.message ?? 'Received unexpected property');

		this.property = property;
		this.value = value;
	}

	public override toJSON(): UnknownEnumKeyErrorJsonified {
		return {
			name: this.name,
			message: this.message,
			property: this.property,
			value: this.value
		};
	}

	protected [customInspectSymbolStackLess](depth: number, options: InspectOptionsStylized): string {
		const property = options.stylize(this.property.toString(), 'string');
		if (depth < 0) {
			return options.stylize(`[UnknownPropertyError: ${property}]`, 'special');
		}

		const newOptions = { ...options, depth: options.depth === null ? null : options.depth! - 1, compact: true };

		const padding = `\n  ${options.stylize('|', 'undefined')} `;
		const given = inspect(this.value, newOptions).replace(/\n/g, padding);

		const header = `${options.stylize('UnknownPropertyError', 'special')} > ${property}`;
		const message = options.stylize(this.message, 'regexp');
		const givenBlock = `\n  ${options.stylize('Received:', 'regexp')}${padding}${given}`;
		return `${header}\n  ${message}\n${givenBlock}`;
	}
}
