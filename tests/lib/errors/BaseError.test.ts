import { BaseError, customInspectSymbolStackLess } from '../../../src/lib/errors/BaseError';
import type { InspectOptionsStylized } from 'node:util';

describe('BaseError', () => {
	test('GIVEN method call of toJson THEN converts to JSON correctly', () => {
		// @ts-expect-error abstract class
		const error = new BaseError();
		const json = error.toJSON();

		expect(json).toEqual({
			name: error.name,
			message: error.message
		});
	});

	test('GIVEN thrown error when customInspectSymbolStackLess is called THEN rethrows error', () => {
		// @ts-expect-error abstract class
		const error = new BaseError();
		const depth = 0;
		// @ts-expect-error dummy object
		const options: InspectOptionsStylized = {};

		expect(() => error[customInspectSymbolStackLess](depth, options)).toThrow();
	});
});
