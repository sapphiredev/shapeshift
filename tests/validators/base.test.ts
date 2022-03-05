import { CombinedError, ExpectedValidationError, s, ValidationError } from '../../src';
import { expectClonedValidator, expectError, expectModifiedClonedValidator } from '../common/macros/comparators';

describe('BaseValidator', () => {
	describe('optional', () => {
		const optionalPredicate = s.string.optional;

		test.each([undefined, 'hello'])('GIVEN %p THEN returns given value', (input) => {
			expect<string | undefined>(optionalPredicate.parse(input)).toEqual(input);
		});

		test.each([null, 0, false, true])('GIVEN %p THEN throws CombinedError', (input) => {
			expectError(
				() => optionalPredicate.parse(input),
				new CombinedError([
					new ExpectedValidationError('s.literal(V)', 'Expected values to be equals', input, undefined),
					new ValidationError('s.string', 'Expected a string primitive', input)
				])
			);
		});
	});

	describe('nullable', () => {
		const nullablePredicate = s.string.nullable;

		test.each([null, 'Hello There'])('GIVEN %p THEN returns given value', (input) => {
			expect<string | null>(nullablePredicate.parse(input)).toBe(input);
		});

		test.each([0, false, true])('GIVEN %p THEN throws CombinedError', (input) => {
			expectError(
				() => nullablePredicate.parse(input),
				new CombinedError([
					new ExpectedValidationError('s.literal(V)', 'Expected values to be equals', input, null),
					new ValidationError('s.string', 'Expected a string primitive', input)
				])
			);
		});
	});

	describe('nullish', () => {
		const nullishPredicate = s.string.nullish;

		test.each(['Hello There', undefined, null])('GIVEN %p THEN returns the given value', (input) => {
			expect<string | undefined | null>(nullishPredicate.parse(input)).toBe(input);
		});

		test.each([0, false, true])('GIVEN %p THEN throws CombinedError', (input) => {
			expectError(
				() => nullishPredicate.parse(input),
				new CombinedError([
					new ValidationError('s.nullish', 'Expected undefined or null', input),
					new ValidationError('s.string', 'Expected a string primitive', input)
				])
			);
		});
	});

	describe('array', () => {
		const numberArrayPredicate = s.number.array;
		const input = [1, 2, 3];

		test('GIVEN an array of string THEN returns the given value', () => {
			expect<number[]>(numberArrayPredicate.parse(input)).toStrictEqual(input);
		});

		test('GIVEN s.string.array THEN returns s.array(s.string)', () => {
			const arrayNumberPredicate = s.array(s.number);

			expectClonedValidator(numberArrayPredicate, arrayNumberPredicate);
		});
	});

	describe('set', () => {
		const numberSetPredicate = s.number.set;
		const input = new Set([1, 2, 3]);

		test('GIVEN a set of numbers THEN returns the given value', () => {
			expect<Set<number>>(numberSetPredicate.parse(input)).toStrictEqual(input);
		});

		test('GIVEN s.number.set THEN returns s.set(s.number)', () => {
			const setNumberPredicate = s.set(s.number);

			expectClonedValidator(numberSetPredicate, setNumberPredicate);
		});
	});

	describe('or', () => {
		const stringOrPredicate = s.string.or(s.number);

		test.each(['Hello There', 6])('GIVEN a string or number (%p) THEN returns a string or number', (input) => {
			expect<string | number>(stringOrPredicate.parse(input)).toBe(input);
		});

		test.each([false, true, null])('GIVEN %p THEN throws CombinedError', (input) => {
			expectError(
				() => stringOrPredicate.parse(input),
				new CombinedError([
					new ValidationError('s.string', 'Expected a string primitive', input),
					new ValidationError('s.number', 'Expected a number primitive', input)
				])
			);
		});

		test('GIVEN s.string.or(s.number) THEN returns s.union(s.number)', () => {
			const unionPredicate = s.union(s.string, s.number);

			expectClonedValidator(stringOrPredicate, unionPredicate);
		});
	});

	describe('transform', () => {
		const transformPredicate = s.string.transform((value) => value.toUpperCase());

		test('GIVEN a string THEN returns uppercase string', () => {
			expect<string>(transformPredicate.parse('Hello There')).toStrictEqual('HELLO THERE');
		});
	});

	describe('transform with union', () => {
		const unionTransformPredicate = s.string.transform((value) => value.toUpperCase()).or(s.number);

		test('GIVEN string THEN returns uppercase string', () => {
			expect<string | number>(unionTransformPredicate.parse('Hello There')).toStrictEqual('HELLO THERE');
		});
		test('GIVEN number THEN returns number', () => {
			expect<string | number>(unionTransformPredicate.parse(6)).toStrictEqual(6);
		});

		test.each([false, true, null, undefined])('GIVEN %p THEN throws CombinedError', (input) => {
			expectError(
				() => unionTransformPredicate.parse(input),
				new CombinedError([
					new ValidationError('s.string', 'Expected a string primitive', input),
					new ValidationError('s.number', 'Expected a number primitive', input)
				])
			);
		});
	});

	describe('default', () => {
		describe('required', () => {
			const defaultPredicate = s.string.default('foo');

			test('GIVEN a string THEN returns the given string', () => {
				expect<string>(defaultPredicate.parse('bar')).toBe('bar');
			});

			test('GIVEN undefined THEN returns the default string', () => {
				expect<string>(defaultPredicate.parse(undefined)).toBe('foo');
			});
		});

		describe('optional', () => {
			const defaultPredicate = s.string.optional.default('foo');

			test('GIVEN a string THEN returns the given string', () => {
				expect<string>(defaultPredicate.parse('bar')).toBe('bar');
			});

			test('GIVEN undefined THEN returns the default string', () => {
				expect<string>(defaultPredicate.parse(undefined)).toBe('foo');
			});
		});
	});

	describe('clone', () => {
		test('GIVEN clone THEN returns similar instance', () => {
			const predicate = s.string;

			// eslint-disable-next-line @typescript-eslint/dot-notation
			expectClonedValidator(predicate, predicate['clone']());
		});

		test('GIVEN clone of default THEN returns similar instance', () => {
			const predicate = s.number.default(5);

			// eslint-disable-next-line @typescript-eslint/dot-notation
			expectClonedValidator(predicate, predicate['clone']());
		});
	});

	describe('Methods and Getters returns a clone', () => {
		test('GIVEN string.length constraint THEN returns modified clone of the validator', () => {
			const stringPredicate = s.string;

			expectModifiedClonedValidator(stringPredicate, stringPredicate.lengthEq(1));
			expectModifiedClonedValidator(stringPredicate, stringPredicate.lengthGe(1));
			expectModifiedClonedValidator(stringPredicate, stringPredicate.lengthGt(1));
			expectModifiedClonedValidator(stringPredicate, stringPredicate.lengthLe(1));
			expectModifiedClonedValidator(stringPredicate, stringPredicate.lengthLt(1));
			expectModifiedClonedValidator(stringPredicate, stringPredicate.lengthNe(1));
		});

		test('GIVEN number.comparator constraint THEN returns modified clone of the validator', () => {
			const numberPredicate = s.number;

			expectModifiedClonedValidator(numberPredicate, numberPredicate.eq(1));
			expectModifiedClonedValidator(numberPredicate, numberPredicate.ge(1));
			expectModifiedClonedValidator(numberPredicate, numberPredicate.gt(1));
			expectModifiedClonedValidator(numberPredicate, numberPredicate.le(1));
			expectModifiedClonedValidator(numberPredicate, numberPredicate.lt(1));
			expectModifiedClonedValidator(numberPredicate, numberPredicate.ne(1));
		});

		test('GIVEN bigint.comparator constraint THEN returns modified clone of the validator', () => {
			const bigintPredicate = s.bigint;

			expectModifiedClonedValidator(bigintPredicate, bigintPredicate.eq(1n));
			expectModifiedClonedValidator(bigintPredicate, bigintPredicate.ge(1n));
			expectModifiedClonedValidator(bigintPredicate, bigintPredicate.gt(1n));
			expectModifiedClonedValidator(bigintPredicate, bigintPredicate.le(1n));
			expectModifiedClonedValidator(bigintPredicate, bigintPredicate.lt(1n));
			expectModifiedClonedValidator(bigintPredicate, bigintPredicate.ne(1n));
		});
	});
});
