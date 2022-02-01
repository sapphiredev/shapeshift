import { inspect } from 'node:util';
import { UnknownPropertyError } from '../../../src';

describe('UnknownPropertyError', () => {
	test('GIVEN an instance THEN assigns fields correctly', () => {
		const error = new UnknownPropertyError('foo', 42);
		expect(error.message).toBe('Unknown property received');
		expect(error.property).toBe('foo');
		expect(error.value).toBe(42);
	});

	describe('inspect', () => {
		test('GIVEN an inspected instance THEN formats data correctly', () => {
			const error = new UnknownPropertyError('foo', 42);
			const content = inspect(error, { colors: false });
			const expected = [
				'UnknownPropertyError > foo', //
				'  Unknown property received',
				'',
				'  Received:',
				'  | 42',
				''
			];

			expect(content.startsWith(expected.join('\n'))).toBe(true);
		});

		test('GIVEN an inspected instance with negative depth THEN formats name only', () => {
			const error = new UnknownPropertyError('foo', 42);
			const content = inspect(error, { colors: false, depth: -1 });
			const expected = [
				'[UnknownPropertyError]' //
			];

			expect(content.startsWith(expected.join('\n'))).toBe(true);
		});
	});
});
