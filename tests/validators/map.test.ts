import { CombinedPropertyError, s, ValidationError } from '../../src';
import { expectClonedValidator, expectError } from '../common/macros/comparators';

describe('MapValidator', () => {
	const value = new Map([
		['a', 1],
		['b', 2]
	]);
	const predicate = s.map(s.string(), s.number());

	test('GIVEN a non-map THEN throws ValidationError', () => {
		expectError(() => predicate.parse(false), new ValidationError('s.map(K, V)', 'Expected a map', false));
	});

	test('GIVEN a matching map THEN returns a map', () => {
		expect(predicate.parse(value)).toStrictEqual(value);
	});

	test('GIVEN a non-matching map THEN throws CombinedError', () => {
		const map = new Map<string | number, string | number>([
			['fizz', 1],
			[2, 3],
			['foo', 'bar'],
			[4, 'buzz']
		]);

		expectError(
			() => predicate.parse(map),
			new CombinedPropertyError([
				[2, new ValidationError('s.string()', 'Expected a string primitive', 2)],
				['foo', new ValidationError('s.number()', 'Expected a number primitive', 'bar')],
				[4, new ValidationError('s.string()', 'Expected a string primitive', 4)],
				[4, new ValidationError('s.number()', 'Expected a number primitive', 'buzz')]
			])
		);
	});

	test('GIVEN clone THEN returns similar instance', () => {
		expectClonedValidator(predicate, predicate['clone']());
	});
});
