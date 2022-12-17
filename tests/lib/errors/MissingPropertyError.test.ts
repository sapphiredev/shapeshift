import { inspect } from 'node:util';
import { MissingPropertyError } from '../../../src';

describe('MissingPropertyError', () => {
	const error = new MissingPropertyError('foo');

	test('GIVEN an instance THEN assigns fields correctly', () => {
		expect(error.message).toBe('A required property is missing');
		expect(error.property).toBe('foo');
	});

	describe('inspect', () => {
		test('GIVEN an inspected instance THEN formats data correctly', () => {
			const content = inspect(error, { colors: false });
			const expected = [
				'MissingPropertyError > foo', //
				'  A required property is missing',
				''
			];

			expect(content.startsWith(expected.join('\n'))).toBe(true);
		});

		test('GIVEN an inspected instance with negative depth THEN formats name only', () => {
			const content = inspect(error, { colors: false, depth: -1 });
			const expected = [
				'[MissingPropertyError: foo]' //
			];

			expect(content.startsWith(expected.join('\n'))).toBe(true);
		});
	});

	describe('toJSON', () => {
		test('toJSON should return an object with name, message, and property', () => {
			expect(error.toJSON()).toEqual({
				name: 'Error',
				message: 'A required property is missing',
				property: 'foo'
			});
		});
	});
});
