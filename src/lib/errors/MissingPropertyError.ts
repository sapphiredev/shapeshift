import type { InspectOptionsStylized } from 'util';
import type { ValidatorOptions } from '../util-types';
import { BaseError, customInspectSymbolStackLess } from './BaseError';
import type { MissingPropertyErrorJsonified } from './error-types';

export class MissingPropertyError extends BaseError {
	public readonly property: PropertyKey;

	public constructor(property: PropertyKey, validatorOptions?: ValidatorOptions) {
		super(validatorOptions?.message ?? 'A required property is missing');
		this.property = property;
	}

	public override toJSON(): MissingPropertyErrorJsonified {
		return {
			name: this.name,
			message: this.message,
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
