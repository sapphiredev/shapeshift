import { inspect, type InspectOptionsStylized } from 'util';
import { BaseError, customInspectSymbolStackLess } from './BaseError';
import type { ValidationErrorJsonified } from './error-types';

export class ValidationError extends BaseError {
	public readonly validator: string;
	public readonly given: unknown;

	public constructor(validator: string, message: string, given: unknown) {
		super(message);

		this.validator = validator;
		this.given = given;
	}

	public override toJSON(): ValidationErrorJsonified {
		return {
			name: this.name,
			message: 'Unknown validation error occurred.',
			validator: this.validator,
			given: this.given
		};
	}

	protected [customInspectSymbolStackLess](depth: number, options: InspectOptionsStylized): string {
		const validator = options.stylize(this.validator, 'string');
		if (depth < 0) {
			return options.stylize(`[ValidationError: ${validator}]`, 'special');
		}

		const newOptions = { ...options, depth: options.depth === null ? null : options.depth! - 1, compact: true };

		const padding = `\n  ${options.stylize('|', 'undefined')} `;
		const given = inspect(this.given, newOptions).replace(/\n/g, padding);

		const header = `${options.stylize('ValidationError', 'special')} > ${validator}`;
		const message = options.stylize(this.message, 'regexp');
		const givenBlock = `\n  ${options.stylize('Received:', 'regexp')}${padding}${given}`;
		return `${header}\n  ${message}\n${givenBlock}`;
	}
}
