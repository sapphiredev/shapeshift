import type { InspectOptionsStylized } from 'node:util';
import { BaseError, customInspectSymbolStackLess } from './BaseError';

export class CombinedPropertyError extends BaseError {
	public readonly errors: [PropertyKey, BaseError][];

	public constructor(errors: [PropertyKey, BaseError][]) {
		super(errors.length === 1 ? errors[0][1].message : `Received ${errors.length} errors:\n${errors.map(e => e[1].message).join("\n")}`);

		this.errors = errors;
	}

	protected [customInspectSymbolStackLess](depth: number, options: InspectOptionsStylized): string {
		if (depth < 0) {
			return options.stylize('[CombinedPropertyError]', 'special');
		}

		const newOptions = { ...options, depth: options.depth === null ? null : options.depth! - 1, compact: true };

		const padding = `\n  ${options.stylize('|', 'undefined')} `;

		const header = `${options.stylize('CombinedPropertyError', 'special')} (${options.stylize(this.errors.length.toString(), 'number')})`;
		const message = options.stylize(this.message, 'regexp');
		const errors = this.errors
			.map(([key, error]) => {
				const property = CombinedPropertyError.formatProperty(key, options);
				const body = error[customInspectSymbolStackLess](depth - 1, newOptions).replace(/\n/g, padding);

				return `  input${property}${padding}${body}`;
			})
			.join('\n\n');
		return `${header}\n  ${message}\n\n${errors}`;
	}

	private static formatProperty(key: PropertyKey, options: InspectOptionsStylized): string {
		if (typeof key === 'string') return options.stylize(`.${key}`, 'symbol');
		if (typeof key === 'number') return `[${options.stylize(key.toString(), 'number')}]`;
		return `[${options.stylize('Symbol', 'symbol')}(${key.description})]`;
	}
}
