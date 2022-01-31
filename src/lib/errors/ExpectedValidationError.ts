import { inspect, type InspectOptionsStylized } from 'node:util';
import { customInspectSymbolStackLess } from './BaseError';
import { ValidationError } from './ValidationError';

export class ExpectedValidationError<T> extends ValidationError {
	public readonly expected: T;

	public constructor(validator: string, message: string, given: unknown, expected: T) {
		super(validator, message, given);
		this.expected = expected;
	}

	public toJSON() {
		return {
			name: this.name,
			validator: this.validator,
			given: this.given,
			expected: this.expected
		};
	}

	public [customInspectSymbolStackLess](depth: number, options: InspectOptionsStylized): string {
		if (depth < 0) {
			return options.stylize('[ExpectedValidationError]', 'special');
		}

		const newOptions = { ...options, depth: options.depth === null ? null : options.depth! - 1 };

		const padding = `\n  ${options.stylize('|', 'undefined')} `;
		const expected = inspect(this.expected, newOptions).replaceAll('\n', padding);
		const given = inspect(this.given, newOptions).replaceAll('\n', padding);

		const header = `${options.stylize('ExpectedValidationError', 'special')} > ${options.stylize(this.validator, 'string')}`;
		const message = options.stylize(this.message, 'regexp');
		const expectedBlock = `\n  ${options.stylize('Expected:', 'string')}${padding}${expected}`;
		const givenBlock = `\n  ${options.stylize('Received:', 'regexp')}${padding}${given}`;
		return `${header}\n  ${message}\n${expectedBlock}\n${givenBlock}`;
	}
}
