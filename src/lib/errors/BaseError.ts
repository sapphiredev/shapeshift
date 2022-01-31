import type { InspectOptionsStylized } from 'node:util';

export const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');
export const customInspectSymbolStackLess = Symbol.for('nodejs.util.inspect.custom.stack-less');

export abstract class BaseError extends Error {
	protected [customInspectSymbol](depth: number, options: InspectOptionsStylized) {
		return `${this[customInspectSymbolStackLess](depth, options)}\n${this.stack!.slice(this.stack!.indexOf('\n'))}`;
	}

	protected abstract [customInspectSymbolStackLess](depth: number, options: InspectOptionsStylized): string;
}
