import { CombinedPropertyError, s, ValidationError } from '../../src';
import { expectClonedValidator, expectError } from '../common/macros/comparators';

describe('TupleValidator', () => {
	const predicate = s.tuple([s.string, s.number]);

	test('GIVEN a matching tuple THEN returns a tuple', () => {
		expect(predicate.parse(['foo', 1])).toStrictEqual(['foo', 1]);
	});

	test.each([false, 1, 'Hello', null, undefined])('GIVEN a non-tuple THEN throws ValidationError', (input) => {
		expectError(() => predicate.parse(input), new ValidationError('s.tuple(T)', 'Expected an array', input));
	});

	test('GIVEN a non-matching tuple THEN throws CombinedError', () => {
		expectError(
			() => predicate.parse([1, 'foo']),
			new CombinedPropertyError([
				[0, new ValidationError('s.string', 'Expected a string primitive', 1)],
				[1, new ValidationError('s.number', 'Expected a number primitive', 'foo')]
			])
		);
	});

	test('GIVEN a tuple with too many elements THEN throws ValidationError', () => {
		expectError(() => predicate.parse(['foo', 1, 'bar']), new ValidationError('s.tuple(T)', 'Expected an array of length 2', ['foo', 1, 'bar']));
	});

	test('GIVEN clone THEN returns similar instance', () => {
		// eslint-disable-next-line @typescript-eslint/dot-notation
		expectClonedValidator(predicate, predicate['clone']());
	});
});
