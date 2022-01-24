import { s, ValidationError } from '../../src';

describe('MapValidator', () => {
	const value = new Map();
	value.set('a', 1);
	value.set('b', 2);
	const predicate = s.map(s.string, s.number);

	test('GIVEN a non-map THEN throws ValidationError', () => {
		expect(() => predicate.parse(false)).toThrow(new ValidationError('MapValidator', 'Expected a map', false));
	});

	test('GIVEN a matching map THEN returns a map', () => {
		expect(predicate.parse(value)).toStrictEqual(value);
	});

	test('GIVEN a non-matching map THEN throws AggregateError', () => {
		const map = new Map();
		map.set('a', 1);
		map.set('foo', 'bar');
		map.set(2, 'fizz');
		map.set(3, 'buzz');
		expect(() => predicate.parse(map)).toThrow(
			new AggregateError(
				[
					new ValidationError('NumberValidator', 'Expected a number primitive', 'bar'),
					new ValidationError('StringValidator', 'Expected a string primitive', 1),
					new ValidationError('StringValidator', 'Expected a string primitive', 3),
					new ValidationError('NumberValidator', 'Expected a number primitive', 'buzz')
				],
				'Failed to validate at least one entry'
			)
		);
	});
});
