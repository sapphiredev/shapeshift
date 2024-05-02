import { CombinedPropertyError, s, ValidationError } from '../../src';
import { expectClonedValidator, expectError } from '../common/macros/comparators';

describe.each(['custom message', undefined])('TupleValidator', (message) => {
	const predicate = s.tuple([s.string({ message }), s.number({ message })], { message });

	test('GIVEN a matching tuple THEN returns a tuple', () => {
		expect<[string, number]>(predicate.parse(['foo', 1])).toStrictEqual(['foo', 1]);
	});

	test.each([false, 1, 'Hello', null, undefined])('GIVEN %j THEN throws ValidationError', (input) => {
		expectError(() => predicate.parse(input), new ValidationError('s.tuple(T)', message ?? 'Expected an array', input));
	});

	test.each([
		[1, 'foo'],
		[null, 'bar'],
		[undefined, {}],
		[{}, null]
	])('GIVEN [%j, %j] tuple THEN throws CombinedError', (a, b) => {
		expectError(
			() => predicate.parse([a, b]),
			new CombinedPropertyError(
				[
					[0, new ValidationError('s.string()', message ?? 'Expected a string primitive', a)],
					[1, new ValidationError('s.number()', message ?? 'Expected a number primitive', b)]
				],
				{ message }
			)
		);
	});

	test('GIVEN a tuple with too few elements THEN throws ValidationError', () => {
		expectError(() => predicate.parse(['foo']), new ValidationError('s.tuple(T)', message ?? 'Expected an array of length 2', ['foo']));
	});

	test('GIVEN a tuple with too many elements THEN throws ValidationError', () => {
		expectError(
			() => predicate.parse(['foo', 1, 'bar']),
			new ValidationError('s.tuple(T)', message ?? 'Expected an array of length 2', ['foo', 1, 'bar'])
		);
	});

	test('GIVEN clone THEN returns similar instance', () => {
		expectClonedValidator(predicate, predicate['clone']());
	});
});
