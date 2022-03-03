import type { InspectOptionsStylized } from 'node:util';
import { BaseError, customInspectSymbolStackLess } from './BaseError';

export class WrongEnumInputError extends BaseError {
	public readonly value: string | number;
	public readonly pairs: [key: string, value: string | number][];

	public constructor(value: string | number, pairs: [key: string, value: string | number][]) {
		super('Expected the value to be one of the following enum values:');

		this.value = value;
		this.pairs = pairs;
	}

	public toJSON() {
		return {
			name: this.name,
			value: this.value,
			pairs: this.pairs
		};
	}

	protected [customInspectSymbolStackLess](depth: number, options: InspectOptionsStylized): string {
		const value = options.stylize(this.value.toString(), 'string');
		if (depth < 0) {
			return options.stylize(`[WrongEnumInputError: ${value}]`, 'special');
		}

		const padding = `\n  ${options.stylize('|', 'undefined')} `;
		const pairs = this.pairs
			.map(
				([key, value]) =>
					`${options.stylize(key, 'string')} or ${options.stylize(value.toString(), typeof value === 'number' ? 'number' : 'string')}`
			)
			.join(padding);

		const header = `${options.stylize('WrongEnumInputError', 'special')} > ${value}`;
		const message = options.stylize(this.message, 'regexp');
		const pairsBlock = `${padding}${pairs}`;
		return `${header}\n  ${message}\n${pairsBlock}`;
	}
}
