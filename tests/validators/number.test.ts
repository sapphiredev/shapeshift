import { ConstraintError, s, ValidationError } from '../../src';

describe('NumberValidator', () => {
	const predicate = s.number;

	test('GIVEN a number THEN returns a number', () => {
		expect(predicate.parse(42)).toBe(42);
	});

	test('GIVEN a non-number THEN throws ValidationError', () => {
		expect(() => predicate.parse('Hello there')).toThrow(new ValidationError('NumberValidator', 'Expected a number primitive', 'Hello there'));
	});

	describe('Comparators', () => {
		describe('lt', () => {
			const ltPredicate = s.number.lt(42);

			// TODO: Rewrite to test.each
			test('GIVEN a smaller number THEN returns a number', () => {
				expect(ltPredicate.parse(10)).toBe(10);
			});

			test('GIVEN an equal number THEN throws ConstraintError', () => {
				expect(() => ltPredicate.parse(42)).toThrow(
					new ConstraintError('numberLt', 'Expected number to be less than 42, but received 42', 42, 42) //
				);
			});

			test('GIVEN a greater number THEN throws ConstraintError', () => {
				expect(() => ltPredicate.parse(100)).toThrow(
					new ConstraintError('numberLt', 'Expected number to be less than 42, but received 100', 100, 42)
				);
			});
		});

		describe('le', () => {
			const ltePredicate = s.number.le(42);

			// TODO: Rewrite to test.each
			test('GIVEN a smaller number THEN returns a number', () => {
				expect(ltePredicate.parse(10)).toBe(10);
			});

			test('GIVEN an equal number THEN returns a number', () => {
				expect(ltePredicate.parse(42)).toBe(42);
			});

			test('GIVEN a greater number THEN throws ConstraintError', () => {
				expect(() => ltePredicate.parse(100)).toThrow(
					new ConstraintError('numberLe', 'Expected number to be less or equals than 42, but received 100', 100, 42)
				);
			});
		});

		// TODO: Add GT
		// TODO: Add GE
		// TODO: Add EQ
		// TODO: Add NE
	});

	describe('Constraints', () => {
		const safeInteger = 42;
		// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
		const unsafeInteger = 242043489611808769;

		describe('Integer', () => {
			const intPredicate = s.number.int;

			test.each([safeInteger, unsafeInteger])('GIVEN %d THEN returns given value', (input) => {
				expect(intPredicate.parse(input)).toBe(input);
			});

			test.each([42.1, Infinity, NaN])('GIVEN %d THEN throws a ConstraintError', (input) => {
				expect(() => intPredicate.parse(input)).toThrow(
					new ConstraintError('numberInt', `Expected number to be an integer, but received ${input}`, input, 'An integer')
				);
			});
		});

		describe('SafeInteger', () => {
			const safeIntPredicate = s.number.safeInt;

			test.each([safeInteger])('GIVEN %d THEN returns given value', (input) => {
				expect(safeIntPredicate.parse(input)).toBe(input);
			});

			test.each([unsafeInteger, 42.1, Infinity, NaN])('GIVEN %d THEN throws a ConstraintError', (input) => {
				expect(() => safeIntPredicate.parse(input)).toThrow(
					new ConstraintError('numberSafeInt', `Expected number to be a safe integer, but received ${input}`, input, 'A safe integer')
				);
			});
		});

		describe('Positive', () => {
			const positivePredicate = s.number.positive;

			test.each([safeInteger, unsafeInteger, 42.1, Infinity])('GIVEN %d THEN returns given value', (input) => {
				expect(positivePredicate.parse(input)).toBe(input);
			});

			test.each([-safeInteger, -unsafeInteger, -42.1, -Infinity])('GIVEN %d THEN throws a ConstraintError', (input) => {
				expect(() => positivePredicate.parse(input)).toThrow(
					new ConstraintError('numberGe', `Expected number to be greater or equals than 0, but received ${input}`, input, 0)
				);
			});
		});

		describe('Negative', () => {
			const positivePredicate = s.number.negative;

			test.each([-safeInteger, -unsafeInteger, -42.1, -Infinity])('GIVEN %d THEN returns given value', (input) => {
				expect(positivePredicate.parse(input)).toBe(input);
			});

			test.each([safeInteger, unsafeInteger, 42.1, Infinity])('GIVEN %d THEN throws a ConstraintError', (input) => {
				expect(() => positivePredicate.parse(input)).toThrow(
					new ConstraintError('numberLt', `Expected number to be less than 0, but received ${input}`, input, 0)
				);
			});
		});

		describe('Finite', () => {
			const finitePredicate = s.number.finite;

			test.each([safeInteger, unsafeInteger, 42.1])('GIVEN %d THEN returns given value', (input) => {
				expect(finitePredicate.parse(input)).toBe(input);
			});

			test.each([Infinity, -Infinity, NaN])('GIVEN %d THEN throws a ConstraintError', (input) => {
				expect(() => finitePredicate.parse(input)).toThrow(
					new ConstraintError('numberFinite', `Expected number to be a finite number, but received ${input}`, input, 'A finite number')
				);
			});
		});

		describe('NaN', () => {
			const nanPredicate = s.number.eq(NaN);

			test.each([NaN])('GIVEN %d THEN returns given value', (input) => {
				expect(nanPredicate.parse(input)).toBe(input);
			});

			test.each([safeInteger, unsafeInteger, 42.1, Infinity, -Infinity])('GIVEN %d THEN throws a ConstraintError', (input) => {
				expect(() => nanPredicate.parse(input)).toThrow(
					new ConstraintError('numberNaN', `Expected number to be a NaN, but received ${input}`, input, 'A NaN')
				);
			});
		});

		describe('NeNaN', () => {
			const neNanPredicate = s.number.ne(NaN);

			test.each([safeInteger, unsafeInteger, 42.1, Infinity, -Infinity])('GIVEN %d THEN returns given value', (input) => {
				expect(neNanPredicate.parse(input)).toBe(input);
			});

			test.each([NaN])('GIVEN %d THEN throws a ConstraintError', (input) => {
				expect(() => neNanPredicate.parse(input)).toThrow(
					new ConstraintError('numberNeNaN', `Expected number to not be a NaN, but received ${input}`, input, 'Not NaN')
				);
			});
		});
	});
});
