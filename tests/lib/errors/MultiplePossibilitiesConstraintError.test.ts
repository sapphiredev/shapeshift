import { inspect } from 'node:util';
import { MultiplePossibilitiesConstraintError } from '../../../src';

describe('MultiplePossibilitiesConstraintError', () => {
	const error = new MultiplePossibilitiesConstraintError('s.string().url()', 'Invalid URL domain', 'https://example.org', [
		'discord.js.org',
		'sapphirejs.dev'
	]);

	test('GIVEN an instance THEN assigns fields correctly', () => {
		expect(error.message).toBe('Invalid URL domain');
		expect(error.constraint).toBe('s.string().url()');
		expect(error.given).toBe('https://example.org');
		expect(error.expected).toStrictEqual(['discord.js.org', 'sapphirejs.dev']);
	});

	describe('inspect', () => {
		test('GIVEN an inspected instance THEN formats data correctly', () => {
			const content = inspect(error, { colors: false });
			const expected = [
				'MultiplePossibilitiesConstraintError > s.string().url()',
				'  Invalid URL domain',
				'',
				'  Expected any of the following:',
				'  | - discord.js.org',
				'  | - sapphirejs.dev',
				'',
				'  Received:',
				"  | 'https://example.org'",
				''
			];

			expect(content).toEqual(expect.stringContaining(expected.join('\n')));
		});

		test('GIVEN an inspected instance with negative depth THEN formats name only', () => {
			const content = inspect(error, { colors: false, depth: -1 });
			const expected = [
				'[MultiplePossibilitiesConstraintError: s.string().url()]' //
			];

			expect(content.startsWith(expected.join('\n'))).toBe(true);
		});
	});

	describe('toJSON', () => {
		test('toJSON should return an object with name, message, constraint, given and expected', () => {
			expect(error.toJSON()).toStrictEqual({
				name: 'Error',
				message: 'Invalid URL domain',
				constraint: 's.string().url()',
				given: 'https://example.org',
				expected: ['discord.js.org', 'sapphirejs.dev']
			});
		});
	});
});
