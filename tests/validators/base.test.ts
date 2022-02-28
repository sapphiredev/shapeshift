import { s } from '../../src';

describe('BaseValidator', () => {
	describe('optional', () => {
		const optionalPredicate = s.string.optional;

		test.each([undefined, 'hello'])('GIVEN %s THEN returns given value', (input) => {
			expect(optionalPredicate.parse(input)).toEqual(input);
		});
	});

	describe('nullable', () => {
		const nullablePredicate = s.string.nullable;

		test.each([null, 'Hello There'])('GIVEN %s THEN returns given value', (input) => {
			expect<string | null>(nullablePredicate.parse(input)).toBe(input);
		});
	});

	describe('nullish', () => {
		const nullishPredicate = s.string.nullish;

		test.each(['Hello There', undefined, null])('GIVEN %s THEN returns the given value', (input) => {
			expect<string | undefined | null>(nullishPredicate.parse(input)).toBe(input);
		});
	});

	describe('array', () => {
		const arrayPredicate = s.number.array;

		test('GIVEN an array of string THEN returns the given value', () => {
			expect(arrayPredicate.parse([1, 2, 3])).toStrictEqual([1, 2, 3]);
		});
	});

	describe('set', () => {
		const setPredicate = s.number.set;

		test('GIVEN a set of string THEN returns the given value', () => {
			expect(setPredicate.parse(new Set([1, 2, 3]))).toStrictEqual(new Set([1, 2, 3]));
		});
	});

	describe('or', () => {
		const orPredicate = s.string.or(s.number);

		test.each(['Hello There', 6])('GIVEN a string or number THEN returns a string', (input) => {
			expect(orPredicate.parse(input)).toBe(input);
		});
	});

	describe('transform', () => {
		const transformPredicate = s.string.transform((value) => value.toUpperCase());

		test('GIVEN a string THEN returns a number', () => {
			expect(transformPredicate.parse('Hello There')).toStrictEqual('HELLO THERE');
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
});
