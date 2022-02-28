import { CombinedError, ExpectedValidationError, s, ValidationError } from '../../src';

describe('BaseValidator', () => {
	describe('optional', () => {
		const optionalPredicate = s.string.optional;

		test.each([undefined, 'hello'])('GIVEN %s THEN returns given value', (input) => {
			expect<string | undefined>(optionalPredicate.parse(input)).toEqual(input);
		});

		test.each([null, 0, false, true])('GIVEN %s THEN throws CombinedError', (input) => {
			expect(() => optionalPredicate.parse(input)).toThrow(
				new CombinedError([
					new ValidationError('s.string', 'Expected a string primitive', input),
					new ExpectedValidationError('LiteralValidator', 'Expected values to be equals', input, undefined)
				])
			);
		});
	});

	describe('nullable', () => {
		const nullablePredicate = s.string.nullable;

		test.each([null, 'Hello There'])('GIVEN %s THEN returns given value', (input) => {
			expect<string | null>(nullablePredicate.parse(input)).toBe(input);
		});

		test.each([0, false, true])('GIVEN %s THEN throws CombinedError', (input) => {
			expect(() => nullablePredicate.parse(input)).toThrow(
				new CombinedError([
					new ValidationError('s.string', 'Expected a string primitive', input),
					new ExpectedValidationError('LiteralValidator', 'Expected values to be equals', input, null)
				])
			);
		});
	});

	describe('nullish', () => {
		const nullishPredicate = s.string.nullish;

		test.each(['Hello There', undefined, null])('GIVEN %s THEN returns the given value', (input) => {
			expect<string | undefined | null>(nullishPredicate.parse(input)).toBe(input);
		});

		test.each([0, false, true])('GIVEN %s THEN throws CombinedError', (input) => {
			expect(() => nullishPredicate.parse(input)).toThrow(
				new CombinedError([
					new ValidationError('s.string', 'Expected a string primitive', input),
					new ExpectedValidationError('LiteralValidator', 'Expected values to be equals', input, undefined),
					new ExpectedValidationError('LiteralValidator', 'Expected values to be equals', input, null)
				])
			);
		});
	});

	describe('array', () => {
		const arrayPredicate = s.number.array;

		test('GIVEN an array of string THEN returns the given value', () => {
			expect<number[]>(arrayPredicate.parse([1, 2, 3])).toStrictEqual([1, 2, 3]);
		});

		test('GIVEN s.string.array THEN returns s.array(s.string)', () => {
			expect(arrayPredicate.parse([1, 2, 3])).toStrictEqual(s.array(s.number).parse([1, 2, 3]));
		});
	});

	describe('set', () => {
		const setPredicate = s.number.set;

		test('GIVEN a set of string THEN returns the given value', () => {
			expect<Set<number>>(setPredicate.parse(new Set([1, 2, 3]))).toStrictEqual(new Set([1, 2, 3]));
		});

		test('GIVEN s.string.set THEN returns s.set(s.string)', () => {
			const set = new Set([1]);

			expect(setPredicate.parse(set)).toStrictEqual(s.set(s.number).parse(set));
		});
	});

	describe('or', () => {
		const orPredicate = s.string.or(s.number);

		test.each(['Hello There', 6])('GIVEN a string or number THEN returns a string', (input) => {
			expect<string | number>(orPredicate.parse(input)).toBe(input);
		});

		test.each([false, true, null])('GIVEN %s THEN throws CombinedError', (input) => {
			expect(() => orPredicate.parse(input)).toThrow(
				new CombinedError([
					new ValidationError('s.string', 'Expected a string primitive', input),
					new ValidationError('s.number', 'Expected a number primitive', input)
				])
			);
		});

		test('GIVEN s.string.or(s.number) THEN returns s.union(s.number)', () => {
			const orUnionPredicate = s.string.or(s.number);
			const unionPredicate = s.union(s.string, s.number);

			expect(orUnionPredicate).toBeInstanceOf(unionPredicate.constructor);
			expect(unionPredicate).toStrictEqual(orUnionPredicate);
		});
	});

	describe('transform', () => {
		const transformPredicate = s.string.transform((value) => value.toUpperCase());

		test('GIVEN a string THEN returns a number', () => {
			expect<string>(transformPredicate.parse('Hello There')).toStrictEqual('HELLO THERE');
		});

		const unionTransformPredicate = s.string.transform((value) => value.toUpperCase()).or(s.number);

		test('GIVEN string THEN returns uppercase string', () => {
			expect<string | number>(unionTransformPredicate.parse('Hello There')).toStrictEqual('HELLO THERE');
		});
		test('GIVEN number THEN returns number', () => {
			expect<string | number>(unionTransformPredicate.parse(6)).toStrictEqual(6);
		});

		test.each([false, true, null])('GIVEN %s THEN throws CombinedError', (input) => {
			expect(() => unionTransformPredicate.parse(input)).toThrow(
				new CombinedError([
					new ValidationError('s.string', 'Expected a string primitive', input),
					new ValidationError('s.number', 'Expected a number primitive', input)
				])
			);
		});
	});

	describe('default', () => {
		const defaultPredicate = s.string.default('Hello There');

		test('GIVEN a string THEN returns the given string', () => {
			expect(defaultPredicate.parse('Hello There')).toBe('Hello There');
		});

		test('GIVEN undefined THEN returns the default string', () => {
			expect(defaultPredicate.parse(undefined)).toBe('Hello There');
		});
	});

	test('GIVEN clone THEN returns similar instance', () => {
		const stringPredicate = s.string;
		// @ts-expect-error Test clone
		const clonePredicate = stringPredicate.clone();

		expect(clonePredicate).toBeInstanceOf(stringPredicate.constructor);
		expect(clonePredicate.parse('Hello There')).toStrictEqual(stringPredicate.parse('Hello There'));
	});

	test('GIVEN clone of default THEN returns similar instance', () => {
		const predicate = s.number.default(5);
		// @ts-expect-error Test clone
		const clonePredicate = predicate.clone();

		expect(clonePredicate).toBeInstanceOf(predicate.constructor);
		expect(clonePredicate.parse(undefined)).toStrictEqual(5);
		expect(clonePredicate.parse(10)).toStrictEqual(10);
	});

	describe('Methods and Getters returns a clone', () => {
		const stringPredicate = s.string;

		test('', () => {
			expect(stringPredicate.lengthEq(1)).not.toStrictEqual(stringPredicate);
			expect(stringPredicate.lengthEq(1)).toBeInstanceOf(stringPredicate.constructor);
		});
	});
});
