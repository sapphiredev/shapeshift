import { ExpectedValidationError, s } from '../../src';

describe('LiteralValidator', () => {
	const predicate = s.literal('sapphire');

	test('GIVEN a literal THEN returns the given value', () => {
		expect(predicate.parse('sapphire')).toBe('sapphire');
	});

	test("GIVEN anything which isn't the literal THEN throws ValidationError", () => {
		expect(() => predicate.parse('hello')).toThrow(
			new ExpectedValidationError('LiteralValidator', 'Expected values to be equals', 'hello', 'sapphire')
		);
	});
});
