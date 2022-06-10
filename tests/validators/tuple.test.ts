import { CombinedPropertyError, s, ValidationError } from '../../src';
import { expectClonedValidator, expectError } from '../common/macros/comparators';

describe('TupleValidator', () => {
	const predicate = s.tuple([s.string, s.number]);

	test('GIVEN a matching tuple THEN returns a tuple', () => {
		expect<[string, number]>(predicate.parse(['foo', 1])).toStrictEqual(['foo', 1]);
	});

	test.each([[false], [1], ['Hello'], [null], [undefined]])('GIVEN %j THEN throws ValidationError', (input) => {
		expectError(() => predicate.parse(input), new ValidationError('s.tuple(T)', 'Expected an array', input));
	});

	test.each([
		[1, 'foo'],
		[null, 'bar'],
		[undefined, {}],
		[{}, null]
	])('GIVEN [%j, %j] tuple THEN throws CombinedError', (a, b) => {
		expectError(
			() => predicate.parse([a, b]),
			new CombinedPropertyError([
				[0, new ValidationError('s.string', 'Expected a string primitive', a)],
				[1, new ValidationError('s.number', 'Expected a number primitive', b)]
			])
		);
	});

	test('GIVEN a tuple with too few elements THEN throws ValidationError', () => {
		expectError(() => predicate.parse(['foo']), new ValidationError('s.tuple(T)', 'Expected an array of length 2', ['foo']));
	});

	test('GIVEN a tuple with too many elements THEN throws ValidationError', () => {
		expectError(() => predicate.parse(['foo', 1, 'bar']), new ValidationError('s.tuple(T)', 'Expected an array of length 2', ['foo', 1, 'bar']));
	});

	test('GIVEN clone THEN returns similar instance', () => {
		// eslint-disable-next-line @typescript-eslint/dot-notation
		expectClonedValidator(predicate, predicate['clone']());
	});
});
