import { CombinedError, s, ValidationError } from '../../src';

describe('UnionValidator', () => {
	const stringPredicate = s.string;
	const numberPredicate = s.number;

	const unionPredicate = s.union(stringPredicate, numberPredicate);

	test('Given a string should return string', () => {
		expect<string | number>(unionPredicate.parse('hello')).toBe('hello');
	});

	test('Given a number should return number', () => {
		expect<string | number>(unionPredicate.parse(5)).toBe(5);
	});

	test('Given a boolean should throw a ConstraintError', () => {
		expect(() => unionPredicate.parse(true)).toThrow(
			new CombinedError([
				new ValidationError('s.string', 'Expected a string primitive', true),
				new ValidationError('s.number', 'Expected a number primitive', true)
			])
		);
	});
});
