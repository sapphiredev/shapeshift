import { inspect, type InspectOptionsStylized } from 'node:util';
import { BaseError, customInspectSymbolStackLess } from './BaseError';

export class ConstraintError<T = unknown> extends BaseError {
	public readonly constraint: string;
	public readonly given: T;
	public readonly expected: string;

	public constructor(validator: string, message: string, given: T, expected: string) {
		super(message);
		this.constraint = validator;
		this.given = given;
		this.expected = expected;
	}

	public toJSON() {
		return {
			name: this.name,
			constraint: this.constraint,
			given: this.given,
			expected: this.expected
		};
	}

	protected [customInspectSymbolStackLess](depth: number, options: InspectOptionsStylized): string {
		if (depth < 0) {
			return options.stylize('[ConstraintError]', 'special');
		}

		const newOptions = { ...options, depth: options.depth === null ? null : options.depth! - 1 };

		const padding = `\n  ${options.stylize('|', 'undefined')} `;
		const given = inspect(this.given, newOptions).replaceAll('\n', padding);

		const header = `${options.stylize('ConstraintError', 'special')} > ${options.stylize(this.constraint, 'string')}`;
		const message = options.stylize(this.message, 'regexp');
		const expectedBlock = `\n  ${options.stylize(`Expected ${this.expected}`, 'string')}`;
		const givenBlock = `\n  ${options.stylize('Received:', 'regexp')}${padding}${given}`;
		return `${header}\n  ${message}\n${expectedBlock}\n${givenBlock}`;
	}
}
