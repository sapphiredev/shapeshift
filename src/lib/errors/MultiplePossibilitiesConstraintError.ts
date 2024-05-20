import { inspect, type InspectOptionsStylized } from 'util';
import { BaseConstraintError, type ConstraintErrorNames } from './BaseConstraintError';
import { customInspectSymbolStackLess } from './BaseError';
import type { MultiplePossibilitiesConstraintErrorJsonified } from './error-types';

export class MultiplePossibilitiesConstraintError<T = unknown> extends BaseConstraintError<T> {
	public readonly expected: readonly string[];

	public constructor(constraint: ConstraintErrorNames, message: string, given: T, expected: readonly string[]) {
		super(constraint, message, given);
		this.expected = expected;
	}

	public override toJSON(): MultiplePossibilitiesConstraintErrorJsonified<T> {
		return {
			name: this.name,
			message: this.message,
			constraint: this.constraint,
			given: this.given,
			expected: this.expected
		};
	}

	protected [customInspectSymbolStackLess](depth: number, options: InspectOptionsStylized): string {
		const constraint = options.stylize(this.constraint, 'string');
		if (depth < 0) {
			return options.stylize(`[MultiplePossibilitiesConstraintError: ${constraint}]`, 'special');
		}

		const newOptions = { ...options, depth: options.depth === null ? null : options.depth! - 1 };

		const verticalLine = options.stylize('|', 'undefined');
		const padding = `\n  ${verticalLine} `;
		const given = inspect(this.given, newOptions).replace(/\n/g, padding);

		const header = `${options.stylize('MultiplePossibilitiesConstraintError', 'special')} > ${constraint}`;
		const message = options.stylize(this.message, 'regexp');

		const expectedPadding = `\n  ${verticalLine} - `;
		const expectedBlock = `\n  ${options.stylize('Expected any of the following:', 'string')}${expectedPadding}${this.expected
			.map((possible) => options.stylize(possible, 'boolean'))
			.join(expectedPadding)}`;
		const givenBlock = `\n  ${options.stylize('Received:', 'regexp')}${padding}${given}`;
		return `${header}\n  ${message}\n${expectedBlock}\n${givenBlock}`;
	}
}
