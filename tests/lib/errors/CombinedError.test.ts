import { inspect } from 'node:util';
import { CombinedError, ValidationError } from '../../../src';

describe('CombinedError', () => {
	const error = new CombinedError([
		new ValidationError('StringValidator', 'Expected a string primitive', 42),
		new ValidationError('StringValidator', 'Expected a string primitive', true)
	]);

	test('GIVEN an instance THEN assigns fields correctly', () => {
		expect(error.message).toBe('Received 2 errors:\nExpected a string primitive\nExpected a string primitive');
		expect(error.errors).toHaveLength(2);
		expect(error.errors[0]).toBeInstanceOf(ValidationError);
		expect(error.errors[1]).toBeInstanceOf(ValidationError);
	});

	describe('inspect', () => {
		test('GIVEN an inspected instance THEN formats data correctly', () => {
			const content = inspect(error, { colors: false });
			const expected = [
				'CombinedError (2)',
				'  Received 2 errors:',
				'Expected a string primitive',
				'Expected a string primitive',
				'',
				'  1 ValidationError > StringValidator',
				'  |   Expected a string primitive',
				'  | ',
				'  |   Received:',
				'  |   | 42',
				'',
				'  2 ValidationError > StringValidator',
				'  |   Expected a string primitive',
				'  | ',
				'  |   Received:',
				'  |   | true',
				''
			];

			expect(content.startsWith(expected.join('\n'))).toBe(true);
		});

		test('GIVEN an inspected instance with negative depth THEN formats name only', () => {
			const content = inspect(error, { colors: false, depth: -1 });
			const expected = [
				'[CombinedError]' //
			];

			expect(content.startsWith(expected.join('\n'))).toBe(true);
		});
	});
});
