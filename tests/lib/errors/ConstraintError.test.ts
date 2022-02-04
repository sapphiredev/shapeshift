import { inspect } from 'node:util';
import { ConstraintError } from '../../../src';

describe('ConstraintError', () => {
	const error = new ConstraintError('s.number.int', 'Given value is not an integer', 42.1, 'Number.isInteger(expected) to be true');

	test('GIVEN an instance THEN assigns fields correctly', () => {
		expect(error.message).toBe('Given value is not an integer');
		expect(error.constraint).toBe('s.number.int');
		expect(error.given).toBe(42.1);
		expect(error.expected).toBe('Number.isInteger(expected) to be true');
	});

	describe('inspect', () => {
		test('GIVEN an inspected instance THEN formats data correctly', () => {
			const content = inspect(error, { colors: false });
			const expected = [
				'ConstraintError > s.number.int', //
				'  Given value is not an integer',
				'',
				'  Expected: Number.isInteger(expected) to be true',
				'',
				'  Received:',
				'  | 42.1',
				''
			];

			expect(content.startsWith(expected.join('\n'))).toBe(true);
		});

		test('GIVEN an inspected instance with negative depth THEN formats name only', () => {
			const content = inspect(error, { colors: false, depth: -1 });
			const expected = [
				'[ConstraintError: s.number.int]' //
			];

			expect(content.startsWith(expected.join('\n'))).toBe(true);
		});
	});
});
