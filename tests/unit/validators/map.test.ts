import { CombinedPropertyError, s, ValidationError } from '../../../src';
import { expectClonedValidator, expectError } from '../common/macros/comparators';

describe.each(['custom message', undefined])('MapValidator (%s)', (message) => {
	const value = new Map([
		['a', 1],
		['b', 2]
	]);
	const predicate = s.map(s.string({ message }), s.number({ message }), { message });

	test('GIVEN a non-map THEN throws ValidationError', () => {
		const errorMessage = message ?? 'Expected a map';
		expectError(() => predicate.parse(false), new ValidationError('s.map(K, V)', errorMessage, false));
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
			new CombinedPropertyError(
				[
					[2, new ValidationError('s.string()', message ?? 'Expected a string primitive', 2)],
					['foo', new ValidationError('s.number()', message ?? 'Expected a number primitive', 'bar')],
					[4, new ValidationError('s.string()', message ?? 'Expected a string primitive', 4)],
					[4, new ValidationError('s.number()', message ?? 'Expected a number primitive', 'buzz')]
				],
				{
					message: message ?? 'Received one or more errors'
				}
			)
		);
	});

	test('GIVEN clone THEN returns similar instance', () => {
		expectClonedValidator(predicate, predicate['clone']());
	});
});
