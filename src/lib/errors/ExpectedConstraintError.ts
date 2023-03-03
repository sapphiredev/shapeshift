import { inspect, type InspectOptionsStylized } from 'util';
import { customInspectSymbolStackLess } from './BaseError';
import { BaseConstraintError, type ConstraintErrorNames } from './BaseConstraintError';

export class ExpectedConstraintError<T = unknown> extends BaseConstraintError<T> {
	public readonly expected: string;

	public constructor(constraint: ConstraintErrorNames, message: string, given: T, expected: string) {
		super(constraint, message, given);
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
		const constraint = options.stylize(this.constraint, 'string');
		if (depth < 0) {
			return options.stylize(`[ExpectedConstraintError: ${constraint}]`, 'special');
		}

		const newOptions = { ...options, depth: options.depth === null ? null : options.depth! - 1 };

		const padding = `\n  ${options.stylize('|', 'undefined')} `;
		const given = inspect(this.given, newOptions).replace(/\n/g, padding);

		const header = `${options.stylize('ExpectedConstraintError', 'special')} > ${constraint}`;
		const message = options.stylize(this.message, 'regexp');
		const expectedBlock = `\n  ${options.stylize('Expected: ', 'string')}${options.stylize(this.expected, 'boolean')}`;
		const givenBlock = `\n  ${options.stylize('Received:', 'regexp')}${padding}${given}`;
		return `${header}\n  ${message}\n${expectedBlock}\n${givenBlock}`;
	}
}
