import { inspect } from 'node:util';
import { UnknownPropertyError } from '../../../src';

describe('UnknownPropertyError', () => {
	const error = new UnknownPropertyError('foo', 42);

	test('GIVEN an instance THEN assigns fields correctly', () => {
		expect(error.message).toBe('Received unexpected property');
		expect(error.property).toBe('foo');
		expect(error.value).toBe(42);
	});

	describe('inspect', () => {
		test('GIVEN an inspected instance THEN formats data correctly', () => {
			const content = inspect(error, { colors: false });
			const expected = [
				'UnknownPropertyError > foo', //
				'  Received unexpected property',
				'',
				'  Received:',
				'  | 42',
				''
			];

			expect(content.startsWith(expected.join('\n'))).toBe(true);
		});

		test('GIVEN an inspected instance with negative depth THEN formats name only', () => {
			const content = inspect(error, { colors: false, depth: -1 });
			const expected = [
				'[UnknownPropertyError: foo]' //
			];

			expect(content.startsWith(expected.join('\n'))).toBe(true);
		});
	});

	describe('toJSON', () => {
		test('toJSON should return an object with name, message, property and value', () => {
			expect(error.toJSON()).toStrictEqual({
				name: 'Error',
				message: 'Received unexpected property',
				property: 'foo',
				value: 42
			});
		});
	});
});
