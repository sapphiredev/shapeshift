import { inspect, type InspectOptionsStylized } from 'util';
import { customInspectSymbolStackLess } from './BaseError';
import type { ExpectedValidationErrorJsonified } from './error-types';
import { ValidationError } from './ValidationError';

export class ExpectedValidationError<T> extends ValidationError {
	public readonly expected: T;

	public constructor(validator: string, message: string, given: unknown, expected: T) {
		super(validator, message, given);
		this.expected = expected;
	}

	public override toJSON(): ExpectedValidationErrorJsonified<T> {
		return {
			name: this.name,
			validator: this.validator,
			given: this.given,
			expected: this.expected,
			message: this.message
		};
	}

	protected [customInspectSymbolStackLess](depth: number, options: InspectOptionsStylized): string {
		const validator = options.stylize(this.validator, 'string');
		if (depth < 0) {
			return options.stylize(`[ExpectedValidationError: ${validator}]`, 'special');
		}

		const newOptions = { ...options, depth: options.depth === null ? null : options.depth! - 1 };

		const padding = `\n  ${options.stylize('|', 'undefined')} `;
		const expected = inspect(this.expected, newOptions).replace(/\n/g, padding);
		const given = inspect(this.given, newOptions).replace(/\n/g, padding);

		const header = `${options.stylize('ExpectedValidationError', 'special')} > ${validator}`;
		const message = options.stylize(this.message, 'regexp');
		const expectedBlock = `\n  ${options.stylize('Expected:', 'string')}${padding}${expected}`;
		const givenBlock = `\n  ${options.stylize('Received:', 'regexp')}${padding}${given}`;
		return `${header}\n  ${message}\n${expectedBlock}\n${givenBlock}`;
	}
}
