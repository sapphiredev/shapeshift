import { inspect } from 'node:util';
import { MissingPropertyError } from '../../../src';

describe('MissingPropertyError', () => {
	test('GIVEN an instance THEN assigns fields correctly', () => {
		const error = new MissingPropertyError('foo');
		expect(error.message).toBe('A required property is missing');
		expect(error.property).toBe('foo');
	});

	describe('inspect', () => {
		test('GIVEN an inspected instance THEN formats data correctly', () => {
			const error = new MissingPropertyError('foo');
			const content = inspect(error, { colors: false });
			const expected = [
				'MissingPropertyError > foo', //
				'  A required property is missing',
				''
			];

			expect(content.startsWith(expected.join('\n'))).toBe(true);
		});

		test('GIVEN an inspected instance with negative depth THEN formats name only', () => {
			const error = new MissingPropertyError('foo');
			const content = inspect(error, { colors: false, depth: -1 });
			const expected = [
				'[MissingPropertyError]' //
			];

			expect(content.startsWith(expected.join('\n'))).toBe(true);
		});
	});
});
