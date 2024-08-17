import { inspect } from 'node:util';
import { CombinedPropertyError, ValidationError } from '../../../../src';

describe('CombinedError', () => {
	const error = new CombinedPropertyError([
		['foo', new ValidationError('StringValidator', 'Expected a string primitive', 42)],
		[2, new ValidationError('StringValidator', 'Expected a string primitive', true)],
		[Symbol('hello.there'), new ValidationError('StringValidator', 'Expected a string primitive', 75n)]
	]);

	test('GIVEN an instance THEN assigns fields correctly', () => {
		expect(error.message).toBe('Received one or more errors');
		expect(error.errors).toHaveLength(3);
		expect(error.errors[0][1]).toBeInstanceOf(ValidationError);
		expect(error.errors[1][1]).toBeInstanceOf(ValidationError);
		expect(error.errors[2][1]).toBeInstanceOf(ValidationError);
	});

	describe('inspect', () => {
		test('GIVEN an inspected instance THEN formats data correctly', () => {
			const content = inspect(error, { colors: false });
			const expected = [
				'CombinedPropertyError (3)',
				'  Received one or more errors',
				'',
				'  input.foo',
				'  | ValidationError > StringValidator',
				'  |   Expected a string primitive',
				'  | ',
				'  |   Received:',
				'  |   | 42',
				'',
				'  input[2]',
				'  | ValidationError > StringValidator',
				'  |   Expected a string primitive',
				'  | ',
				'  |   Received:',
				'  |   | true',
				'',
				'  input[Symbol(hello.there)]',
				'  | ValidationError > StringValidator',
				'  |   Expected a string primitive',
				'  | ',
				'  |   Received:',
				'  |   | 75n',
				''
			];

			expect(content.startsWith(expected.join('\n'))).toBe(true);
		});

		test('GIVEN an inspected instance with negative depth THEN formats name only', () => {
			const content = inspect(error, { colors: false, depth: -1 });
			const expected = [
				'[CombinedPropertyError]' //
			];

			expect(content.startsWith(expected.join('\n'))).toBe(true);
		});
	});
});
