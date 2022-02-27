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
			const lengthLtPredicate = s.string.lengthLt(5);

			test.each(['Hi'])('GIVEN %s THEN returns given value', (input) => {
				expect(lengthLtPredicate.parse(input)).toBe(input);
			});

			test.each(['Hello', 'Foo Bar'])('GIVEN %s THEN throws a ConstraintError', (input) => {
				expect(() => lengthLtPredicate.parse(input)).toThrow(
					new ConstraintError('s.string.lengthLt', 'Invalid string length', input, 'expected.length < 5')
				);
			});
		});

		describe('lengthLe', () => {
			const lengthLePredicate = s.string.lengthLe(5);

			test.each(['Hi', 'Hello'])('GIVEN %s THEN returns given value', (input) => {
				expect(lengthLePredicate.parse(input)).toBe(input);
			});

			test.each(['Foo Bar'])('GIVEN %s THEN throws a ConstraintError', (input) => {
				expect(() => lengthLePredicate.parse(input)).toThrow(
					new ConstraintError('s.string.lengthLt', 'Invalid string length', input, 'expected.length <= 5')
				);
			});
		});

		describe('lengthGt', () => {
			const lengthGtPredicate = s.string.lengthGt(5);

			test.each(['Foo Bar'])('GIVEN %s THEN returns given value', (input) => {
				expect(lengthGtPredicate.parse(input)).toBe(input);
			});

			test.each(['Hi', 'Hello'])('GIVEN %s THEN throws a ConstraintError', (input) => {
				expect(() => lengthGtPredicate.parse(input)).toThrow(
					new ConstraintError('s.string.lengthGt', 'Invalid string length', input, 'expected.length > 5')
				);
			});
		});

		describe('lengthGe', () => {
			const lengthGePredicate = s.string.lengthGe(5);

			test.each(['Hello', 'Foo Bar'])('GIVEN %s THEN returns given value', (input) => {
				expect(lengthGePredicate.parse(input)).toBe(input);
			});

			test.each(['Hi'])('GIVEN %s THEN throws a ConstraintError', (input) => {
				expect(() => lengthGePredicate.parse(input)).toThrow(
					new ConstraintError('s.string.lengthGe', 'Invalid string length', input, 'expected.length >= 5')
				);
			});
		});

		describe('lengthEq', () => {
			const lengthEqPredicate = s.string.lengthEq(5);

			test.each(['Hello'])('GIVEN %s THEN returns given value', (input) => {
				expect(lengthEqPredicate.parse(input)).toBe(input);
			});

			test.each(['Hi', 'Foo Bar'])('GIVEN %s THEN throws a ConstraintError', (input) => {
				expect(() => lengthEqPredicate.parse(input)).toThrow(
					new ConstraintError('s.string.lengthEq', 'Invalid string length', input, 'expected.length === 5')
				);
			});
		});

		describe('lengthNe', () => {
			const lengthNePredicate = s.string.lengthNe(5);

			test.each(['Hi', 'Foo Bar'])('GIVEN %s THEN returns given value', (input) => {
				expect(lengthNePredicate.parse(input)).toBe(input);
			});

			test.each(['Hello'])('GIVEN %s THEN throws a ConstraintError', (input) => {
				expect(() => lengthNePredicate.parse(input)).toThrow(
					new ConstraintError('s.string.lengthNe', 'Invalid string length', input, 'expected.length === 5')
				);
			});
		});
	});
});
