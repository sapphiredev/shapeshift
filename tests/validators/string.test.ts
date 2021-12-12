import { ConstraintError, s, ValidationError } from '../../src';

describe('StringValidator', () => {
	const predicate = s.string;

	test('GIVEN a string THEN returns a string', () => {
		expect(predicate.parse('Hello There')).toBe('Hello There');
	});

	test('GIVEN a non-string THEN throws ValidationError', () => {
		expect(() => predicate.parse(42)).toThrow(new ValidationError('StringValidator', 'Expected a string primitive', 42));
	});

	describe('Comparators', () => {
		describe('lengthLt', () => {
			const lengthLtPredicate = s.string.lengthLe(5);

			test.each(['Hi'])('GIVEN %s THEN returns given value', (input) => {
				expect(lengthLtPredicate.parse(input)).toBe(input);
			});

			test.each(['Hello', 'Foo Bar'])('GIVEN %s THEN throws a ConstraintError', (input) => {
				expect(() => lengthLtPredicate.parse(input)).toThrow(
					new ConstraintError(
						'stringLengthLt',
						`Expected string to have less than 5 characters, but received one with ${input.length} characters`,
						input,
						'An integer'
					)
				);
			});
		});

		describe('lengthLe', () => {
			const lengthLePredicate = s.string.lengthLte(5);

			test.each(['Hi', 'Hello'])('GIVEN %s THEN returns given value', (input) => {
				expect(lengthLePredicate.parse(input)).toBe(input);
			});

			test.each(['Foo Bar'])('GIVEN %s THEN throws a ConstraintError', (input) => {
				expect(() => lengthLePredicate.parse(input)).toThrow(
					new ConstraintError(
						'stringLengthLe',
						`Expected string to have maximum 5 characters, but received one with ${input.length} characters`,
						input,
						'An integer'
					)
				);
			});
		});
	});
});
