import { CombinedError, s, ValidationError } from '../../src';

describe('TupleValidator', () => {
	const predicate = s.tuple(s.string, s.number);

	test('GIVEN a non-tuple THEN throws ValidationError', () => {
		expect(() => predicate.parse(false)).toThrow(new ValidationError('TupleValidator', 'Expected a tuple', false));
	});

	test('GIVEN a matching tuple THEN returns a tuple', () => {
		expect(predicate.parse(['foo', 1])).toStrictEqual(['foo', 1]);
	});

	test('GIVEN a non-matching tuple THEN throws CombinedError', () => {
		expect(() => predicate.parse([1, 'foo'])).toThrow(
			new CombinedError([
				new ValidationError('StringValidator', 'Expected a string primitive', 1),
				new ValidationError('NumberValidator', 'Expected a number primitive', 'foo')
			])
		);
	});

	test('GIVEN a tuple with too many elements THEN throws ValidationError', () => {
		expect(() => predicate.parse(['foo', 1, 'bar'])).toThrow(
			new ValidationError('TupleValidator', 'Expected a tuple of length 2', ['foo', 1, 'bar'])
		);
	});
});
