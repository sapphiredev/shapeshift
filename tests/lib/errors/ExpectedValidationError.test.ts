import { inspect } from 'node:util';
import { ExpectedValidationError } from '../../../src';

describe('ExpectedValidationError', () => {
	const error = new ExpectedValidationError('LiteralValidator', 'Expected values to be equals', 'world', 'hello');

	test('GIVEN an instance THEN assigns fields correctly', () => {
		expect(error.message).toBe('Expected values to be equals');
		expect(error.validator).toBe('LiteralValidator');
		expect(error.given).toBe('world');
		expect(error.expected).toBe('hello');
	});

	describe('inspect', () => {
		test('GIVEN an inspected instance THEN formats data correctly', () => {
			const content = inspect(error, { colors: false });
			const expected = [
				'ExpectedValidationError > LiteralValidator', //
				'  Expected values to be equals',
				'',
				'  Expected:',
				"  | 'hello'",
				'',
				'  Received:',
				"  | 'world'",
				''
			];

			expect(content.startsWith(expected.join('\n'))).toBe(true);
		});

		test('GIVEN an inspected instance with negative depth THEN formats name only', () => {
			const content = inspect(error, { colors: false, depth: -1 });
			const expected = [
				'[ExpectedValidationError: LiteralValidator]' //
			];

			expect(content.startsWith(expected.join('\n'))).toBe(true);
		});
	});

	describe('toJSON', () => {
		test('toJSON should return an object with name, message, validator, given and expected', () => {
			expect(error.toJSON()).toStrictEqual({
				name: 'Error',
				message: 'Expected values to be equals',
				validator: 'LiteralValidator',
				given: 'world',
				expected: 'hello'
			});
		});
	});
});
