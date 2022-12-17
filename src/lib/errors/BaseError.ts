import type { InspectOptionsStylized } from 'util';
import type { BaseErrorJsonified } from './error-types';

export const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');
export const customInspectSymbolStackLess = Symbol.for('nodejs.util.inspect.custom.stack-less');

export abstract class BaseError extends Error {
	public toJSON(): BaseErrorJsonified {
		return {
			name: this.name,
			message: this.message
		};
	}

	protected [customInspectSymbol](depth: number, options: InspectOptionsStylized) {
		return `${this[customInspectSymbolStackLess](depth, options)}\n${this.stack!.slice(this.stack!.indexOf('\n'))}`;
	}

	protected abstract [customInspectSymbolStackLess](depth: number, options: InspectOptionsStylized): string;
}
