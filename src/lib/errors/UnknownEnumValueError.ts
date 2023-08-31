import type { InspectOptionsStylized } from 'util';
import type { ValidatorOptions } from '../util-types';
import { BaseError, customInspectSymbolStackLess } from './BaseError';
import type { UnknownEnumValueErrorJsonified } from './error-types';

export class UnknownEnumValueError extends BaseError {
	public readonly value: string | number;
	public readonly enumKeys: string[];
	public readonly enumMappings: Map<string | number, string | number>;

	public constructor(
		value: string | number,
		keys: string[],
		enumMappings: Map<string | number, string | number>,
		validatorOptions?: ValidatorOptions
	) {
		super(validatorOptions?.message ?? 'Expected the value to be one of the following enum values:');

		this.value = value;
		this.enumKeys = keys;
		this.enumMappings = enumMappings;
	}

	public override toJSON(): UnknownEnumValueErrorJsonified {
		return {
			name: this.name,
			message: this.message,
			value: this.value,
			enumKeys: this.enumKeys,
			enumMappings: [...this.enumMappings.entries()]
		};
	}

	protected [customInspectSymbolStackLess](depth: number, options: InspectOptionsStylized): string {
		const value = options.stylize(this.value.toString(), 'string');
		if (depth < 0) {
			return options.stylize(`[UnknownEnumValueError: ${value}]`, 'special');
		}

		const padding = `\n  ${options.stylize('|', 'undefined')} `;
		const pairs = this.enumKeys
			.map((key) => {
				const enumValue = this.enumMappings.get(key)!;
				return `${options.stylize(key, 'string')} or ${options.stylize(
					enumValue.toString(),
					typeof enumValue === 'number' ? 'number' : 'string'
				)}`;
			})
			.join(padding);

		const header = `${options.stylize('UnknownEnumValueError', 'special')} > ${value}`;
		const message = options.stylize(this.message, 'regexp');
		const pairsBlock = `${padding}${pairs}`;
		return `${header}\n  ${message}\n${pairsBlock}`;
	}
}
