import { CombinedError, s, ValidationError } from '../../src';

describe('UnionValidator', () => {
	const stringPredicate = s.string;
	const numberPredicate = s.number;

	const unionPredicate = s.union(stringPredicate, numberPredicate);

	test('GIVEN a string THEN returns string', () => {
		expect<string | number>(unionPredicate.parse('hello')).toBe('hello');
	});

	test('GIVEN a number THEN returns number', () => {
		expect<string | number>(unionPredicate.parse(5)).toBe(5);
	});

	test('GIVEN a boolean THEN throw a ConstraintError', () => {
		expect(() => unionPredicate.parse(true)).toThrow(
			new CombinedError([
				new ValidationError('s.string', 'Expected a string primitive', true),
				new ValidationError('s.number', 'Expected a number primitive', true)
			])
		);
	});

	describe('or', () => {
		test('GIVEN string, number, array THEN return the input', () => {
			const orPredicate = unionPredicate.or(s.union(s.string.array, s.number.array));

			expect<string | number | string[] | number[]>(orPredicate.parse(['hello'])).toStrictEqual(['hello']);
			expect(orPredicate.parse([5])).toStrictEqual([5]);
			expect(orPredicate.parse('hello')).toBe('hello');
			expect(orPredicate.parse(5)).toBe(5);
		});
	});

	test('optional', () => {
		const optionalPredicate = unionPredicate.optional;

		expect<string | number | undefined>(optionalPredicate.parse(undefined)).toBeUndefined();
		expect(optionalPredicate.parse('hello')).toBe('hello');
		expect(optionalPredicate.parse(5)).toBe(5);

		expect(() => optionalPredicate.parse(null)).toThrow(
			new CombinedError([
				new ValidationError('s.string', 'Expected a string primitive', null),
				new ValidationError('s.number', 'Expected a number primitive', null)
			])
		);
	});

	test('nullable', () => {
		const nullablePredicate = unionPredicate.nullable;

		expect<string | number | null>(nullablePredicate.parse(null)).toBeNull();
		expect(nullablePredicate.parse('hello')).toBe('hello');
		expect(nullablePredicate.parse(5)).toBe(5);

		expect(() => nullablePredicate.parse(undefined)).toThrow(
			new CombinedError([
				new ValidationError('s.string', 'Expected a string primitive', undefined),
				new ValidationError('s.number', 'Expected a number primitive', undefined)
			])
		);
	});

	test('nullish', () => {
		const nullishPredicate = unionPredicate.nullish;

		expect<string | number | undefined | null>(nullishPredicate.parse(null)).toBeNull();
		expect(nullishPredicate.parse('hello')).toBe('hello');
		expect(nullishPredicate.parse(5)).toBe(5);
		expect(nullishPredicate.parse(undefined)).toBeUndefined();

		expect(() => nullishPredicate.parse(false)).toThrow(
			new CombinedError([
				new ValidationError('s.string', 'Expected a string primitive', false),
				new ValidationError('s.number', 'Expected a number primitive', false)
			])
		);
	});

	test('GIVEN clone THEN returns similar instance', () => {
		// @ts-expect-error Test clone
		const clonePredicate = unionPredicate.clone();

		expect(clonePredicate).toBeInstanceOf(unionPredicate.constructor);
		expect(clonePredicate.parse('hello')).toBe(unionPredicate.parse('hello'));
		expect(clonePredicate.parse(5)).toBe(unionPredicate.parse(5));
	});
});
