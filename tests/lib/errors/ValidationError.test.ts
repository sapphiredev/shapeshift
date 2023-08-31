import { inspect } from 'node:util';
import { ValidationError } from '../../../src';

describe('ValidationError', () => {
	const error = new ValidationError('StringValidator', 'Expected a string primitive', 42);

	test('GIVEN an instance THEN assigns fields correctly', () => {
		expect(error.message).toBe('Expected a string primitive');
		expect(error.given).toBe(42);
		expect(error.validator).toBe('StringValidator');
	});

	describe('inspect', () => {
		test('GIVEN an inspected instance THEN formats data correctly', () => {
			const content = inspect(error, { colors: false });
			const expected = [
				'ValidationError > StringValidator', //
				'  Expected a string primitive',
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
				'[ValidationError: StringValidator]' //
			];

			expect(content.startsWith(expected.join('\n'))).toBe(true);
		});
	});

	describe('toJSON', () => {
		test('toJSON should return an object with name, message, validator and given', () => {
			expect(error.toJSON()).toStrictEqual({
				name: 'Error',
				message: 'Unknown validation error occurred.',
				validator: 'StringValidator',
				given: 42
			});
		});
	});
});
