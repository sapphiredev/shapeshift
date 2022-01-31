import { inspect, type InspectOptionsStylized } from 'node:util';
import { BaseError, customInspectSymbolStackLess } from './BaseError';

export class ValidationError extends BaseError {
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

	protected [customInspectSymbolStackLess](depth: number, options: InspectOptionsStylized): string {
		if (depth < 0) {
			return options.stylize('[ValidationError]', 'special');
		}

		const newOptions = { ...options, depth: options.depth === null ? null : options.depth! - 1, compact: true };

		const padding = `\n  ${options.stylize('|', 'undefined')} `;
		const given = inspect(this.given, newOptions).replaceAll('\n', padding);

		const header = `${options.stylize('ValidationError', 'special')} > ${options.stylize(this.validator, 'string')}`;
		const message = options.stylize(this.message, 'regexp');
		const givenBlock = `\n  ${options.stylize('Received:', 'regexp')}${padding}${given}`;
		return `${header}\n  ${message}\n${givenBlock}`;
	}
}
