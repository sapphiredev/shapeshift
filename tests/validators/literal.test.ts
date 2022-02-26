import { ExpectedValidationError, s } from '../../src';

describe('LiteralValidator', () => {
	const predicate = s.literal('sapphire');

	test('GIVEN a literal THEN returns the given value', () => {
		expect(predicate.parse('sapphire')).toBe('sapphire');
	});

	test("GIVEN anything which isn't the literal THEN throws ExpectedValidationError", () => {
		expect(() => predicate.parse('hello')).toThrow(
			new ExpectedValidationError('LiteralValidator', 'Expected values to be equals', 'hello', 'sapphire')
		);
	});

	test('Clone', () => {
		// @ts-expect-error Test clone
		const clonePredicate = predicate.clone();

		expect(clonePredicate.parse('sapphire')).toBe('sapphire');
	});
});
