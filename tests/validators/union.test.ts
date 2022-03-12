import { CombinedError, ExpectedValidationError, s, ValidationError } from '../../src';
import { expectClonedValidator, expectError } from '../common/macros/comparators';

describe('UnionValidator', () => {
	const stringPredicate = s.string;
	const numberPredicate = s.number;

	const predicate = s.union(stringPredicate, numberPredicate);

	test('GIVEN a string THEN returns string', () => {
		expect<string | number>(predicate.parse('hello')).toBe('hello');
	});

	test('GIVEN a number THEN returns number', () => {
		expect<string | number>(predicate.parse(5)).toBe(5);
	});

	test('GIVEN a boolean THEN throw a ConstraintError', () => {
		expectError(
			() => predicate.parse(true),
			new CombinedError([
				new ValidationError('s.string', 'Expected a string primitive', true),
				new ValidationError('s.number', 'Expected a number primitive', true)
			])
		);
	});

	describe('or', () => {
		const orPredicate = predicate.or(s.string.array);

		test.each([5, 'foo', ['bar']])('GIVEN %p THEN returns the input', (value) => {
			expect<string | number | string[]>(orPredicate.parse(value)).toStrictEqual(value);
		});

		test.each([null, undefined, true])('GIVEN %p THEN throws CombinedError', (value) => {
			expectError(
				() => orPredicate.parse(value),
				new CombinedError([
					new ValidationError('s.string', 'Expected a string primitive', value),
					new ValidationError('s.number', 'Expected a number primitive', value),
					new ValidationError('s.array(T)', 'Expected an array', value)
				])
			);
		});

		test('GIVEN s.union(s.string, s.number).or(s.string.array) THEN returns s.union(s.string, s.number, s.string.array)', () => {
			expectClonedValidator(orPredicate, s.union(s.string, s.number, s.string.array));
		});
	});

	describe('optional', () => {
		const optionalPredicate = predicate.optional;

		test.each([undefined, 'hello', 5])('GIVEN %p THEN returns %p', (value) => {
			expect<string | number | undefined>(optionalPredicate.parse(value)).toBe(value);
		});

		test.each([null, true, {}])('GIVEN %p THEN throws CombinedError', (value) => {
			expectError(
				() => optionalPredicate.parse(value),
				new CombinedError([
					new ExpectedValidationError('s.literal(V)', 'Expected values to be equals', value, undefined),
					new ValidationError('s.string', 'Expected a string primitive', value),
					new ValidationError('s.number', 'Expected a number primitive', value)
				])
			);
		});

		test('GIVEN s.union(s.string, s.number).optional THEN returns s.union(s.undefined, s.string, s.number)', () => {
			expectClonedValidator(optionalPredicate, s.union(s.undefined, s.string, s.number));
		});

		describe('nullish', () => {
			const nullishPredicate = optionalPredicate.nullish;

			test('GIVEN s.union(s.string, s.number).nullable.nullish THEN returns s.union(s.nullish, s.string, s.number)', () => {
				expectClonedValidator(nullishPredicate, s.union(s.nullish, s.string, s.number));
			});
		});
	});

	describe('nullable', () => {
		const nullablePredicate = predicate.nullable;

		test.each([null, 'hello', 5])('GIVEN %p THEN returns %p', (value) => {
			expect<string | number | null>(nullablePredicate.parse(value)).toBe(value);
		});

		test.each([undefined, true, {}])('GIVEN %p THEN throws CombinedError', (value) => {
			expectError(
				() => nullablePredicate.parse(value),
				new CombinedError([
					new ExpectedValidationError('s.literal(V)', 'Expected values to be equals', value, null),
					new ValidationError('s.string', 'Expected a string primitive', value),
					new ValidationError('s.number', 'Expected a number primitive', value)
				])
			);
		});

		test('GIVEN s.union(s.string, s.number).nullable THEN returns s.union(s.null, s.string, s.number)', () => {
			expectClonedValidator(nullablePredicate, s.union(s.null, s.string, s.number));
		});

		describe('nullish', () => {
			const nullishPredicate = nullablePredicate.nullish;

			test('GIVEN s.union(s.string, s.number).nullable.nullish THEN returns s.union(s.nullish, s.string, s.number)', () => {
				expectClonedValidator(nullishPredicate, s.union(s.nullish, s.string, s.number));
			});
		});
	});

	describe('nullish', () => {
		const nullishPredicate = predicate.nullish;

		test.each([null, undefined, 'hello', 5])('GIVEN %p THEN returns %p', (value) => {
			expect<string | number | undefined | null>(nullishPredicate.parse(value)).toBe(value);
		});

		test.each([true, {}])('GIVEN %p THEN throws CombinedError', (value) => {
			expectError(
				() => nullishPredicate.parse(value),
				new CombinedError([
					new ValidationError('s.nullish', 'Expected undefined or null', value),
					new ValidationError('s.string', 'Expected a string primitive', value),
					new ValidationError('s.number', 'Expected a number primitive', value)
				])
			);
		});

		test('GIVEN s.union(s.string, s.number).nullable THEN returns s.union(s.null, s.string, s.number)', () => {
			expectClonedValidator(nullishPredicate, s.union(s.null, s.string, s.number));
		});
	});

	test('GIVEN clone THEN returns similar instance', () => {
		// eslint-disable-next-line @typescript-eslint/dot-notation
		expectClonedValidator(predicate, predicate['clone']());
	});
});
