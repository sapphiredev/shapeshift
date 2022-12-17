import type { InspectOptionsStylized } from 'util';
import type { ValidatorOptions } from '../util-types';
import { BaseError, customInspectSymbolStackLess } from './BaseError';

export class CombinedError extends BaseError {
	public readonly errors: readonly BaseError[];

	public constructor(errors: readonly BaseError[], validatorOptions?: ValidatorOptions) {
		super(validatorOptions?.message ?? 'Received one or more errors');

		this.errors = errors;
	}

	protected [customInspectSymbolStackLess](depth: number, options: InspectOptionsStylized): string {
		if (depth < 0) {
			return options.stylize('[CombinedError]', 'special');
		}

		const newOptions = { ...options, depth: options.depth === null ? null : options.depth! - 1, compact: true };

		const padding = `\n  ${options.stylize('|', 'undefined')} `;

		const header = `${options.stylize('CombinedError', 'special')} (${options.stylize(this.errors.length.toString(), 'number')})`;
		const message = options.stylize(this.message, 'regexp');
		const errors = this.errors
			.map((error, i) => {
				const index = options.stylize((i + 1).toString(), 'number');
				const body = error[customInspectSymbolStackLess](depth - 1, newOptions).replace(/\n/g, padding);

				return `  ${index} ${body}`;
			})
			.join('\n\n');
		return `${header}\n  ${message}\n\n${errors}`;
	}
}
