import { inspect } from 'node:util';
import { UnknownEnumValueError } from '../../../src';

describe('UnknownEnumValueError', () => {
	const error = new UnknownEnumValueError(
		'foo',
		['bar', 'baz'],
		new Map<string | number, string | number>([
			['bar', 1],
			['baz', 'boo']
		])
	);

	test('GIVEN an instance THEN assigns fields correctly', () => {
		expect(error.message).toBe('Expected the value to be one of the following enum values:');
		expect(error.value).toBe('foo');
		expect(error.enumKeys).toEqual(['bar', 'baz']);
		expect(error.enumMappings).toStrictEqual(
			new Map<string | number, string | number>([
				['bar', 1],
				['baz', 'boo']
			])
		);
	});

	describe('inspect', () => {
		test('GIVEN an inspected instance THEN formats data correctly', () => {
			const content = inspect(error, { colors: false });
			const expected = [
				'UnknownEnumValueError > foo', //
				'  Expected the value to be one of the following enum values:',
				'',
				'  | bar or 1',
				'  | baz or boo'
			];

			expect(content.startsWith(expected.join('\n'))).toBe(true);
		});

		test('GIVEN an inspected instance with negative depth THEN formats name only', () => {
			const content = inspect(error, { colors: false, depth: -1 });
			const expected = [
				'[UnknownEnumValueError: foo]' //
			];

			expect(content.startsWith(expected.join('\n'))).toBe(true);
		});
	});

	describe('toJSON', () => {
		test('toJSON should return an object with name, message, value, enumKeys, and enumMappings', () => {
			expect(error.toJSON()).toEqual({
				name: 'Error',
				message: 'Expected the value to be one of the following enum values:',
				value: 'foo',
				enumKeys: ['bar', 'baz'],
				enumMappings: [
					['bar', 1],
					['baz', 'boo']
				]
			});
		});
	});
});
