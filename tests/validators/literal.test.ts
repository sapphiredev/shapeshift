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

	describe('DateLiteral', () => {
		const date = new Date('2022-01-01');
		const dateLiteralPredicate = s.literal(date);
		const datePredicate = s.date;

		test('GIVEN a date literal THEN returns the given value', () => {
			expect(dateLiteralPredicate.parse(date)).toStrictEqual(datePredicate.parse(date));
		});
	});

	test('GIVEN clone THEN returns similar instance', () => {
		// @ts-expect-error Test clone
		const clonePredicate = predicate.clone();

		expect(clonePredicate).toBeInstanceOf(predicate.constructor);
		expect(clonePredicate.parse('sapphire')).toBe('sapphire');
	});
});
