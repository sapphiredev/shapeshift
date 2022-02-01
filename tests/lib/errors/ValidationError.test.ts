import { inspect } from 'node:util';
import { ValidationError } from '../../../src';

describe('ValidationError', () => {
	test('GIVEN an instance THEN assigns fields correctly', () => {
		const error = new ValidationError('StringValidator', 'Expected a string primitive', 42);
		expect(error.message).toBe('Expected a string primitive');
		expect(error.given).toBe(42);
		expect(error.validator).toBe('StringValidator');
	});

	describe('inspect', () => {
		test('GIVEN an inspected instance THEN formats data correctly', () => {
			const error = new ValidationError('StringValidator', 'Expected a string primitive', 42);
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
			const error = new ValidationError('StringValidator', 'Expected a string primitive', 42);
			const content = inspect(error, { colors: false, depth: -1 });
			const expected = [
				'[ValidationError]' //
			];

			expect(content.startsWith(expected.join('\n'))).toBe(true);
		});
	});
});
