import { CombinedError, s, ValidationError } from '../../src';

describe('MapValidator', () => {
	const value = new Map([
		['a', 1],
		['b', 2]
	]);
	const predicate = s.map(s.string, s.number);

	test('GIVEN a non-map THEN throws ValidationError', () => {
		expect(() => predicate.parse(false)).toThrow(new ValidationError('MapValidator', 'Expected a map', false));
	});

	test('GIVEN a matching map THEN returns a map', () => {
		expect(predicate.parse(value)).toStrictEqual(value);
	});

	test('GIVEN a non-matching map THEN throws CombinedError', () => {
		// @ts-ignore Purposefully invalid
		const map = new Map([
			['fizz', 1],
			[2, 3],
			['foo', 'bar'],
			[4, 'buzz']
		]);
		expect(() => predicate.parse(map)).toThrow(
			new CombinedError([
				new ValidationError('StringValidator', 'Expected a string primitive', 2),
				new ValidationError('NumberValidator', 'Expected a number primitive', 'bar'),
				new ValidationError('StringValidator', 'Expected a string primitive', 4),
				new ValidationError('NumberValidator', 'Expected a number primitive', 'buzz')
			])
		);
	});
});
