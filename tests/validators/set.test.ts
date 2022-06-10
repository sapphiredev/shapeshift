import { CombinedError, s, ValidationError } from '../../src';
import { expectClonedValidator, expectError } from '../common/macros/comparators';

describe('SetValidator', () => {
	const predicate = s.set(s.string);

	test.each([123, 'foo', [], {}, new Map()])("GIVEN a value which isn't a set (%j) THEN throws ValidationError", (input) => {
		expectError(() => predicate.parse(input), new ValidationError('s.set(T)', 'Expected a set', input));
	});

	test.each(['1', 'a', 'foo'])('GIVEN a set with string value (%j) THEN returns the given set', (input) => {
		const set = new Set([input]);

		expect(predicate.parse(set)).toStrictEqual(set);
	});

	test.each([123, [], {}])('GIVEN a set with non-string value (%j) THEN throw CombinedError', (input) => {
		const set = new Set([input]);

		expectError(() => predicate.parse(set), new CombinedError([new ValidationError('s.string', 'Expected a string primitive', input)]));
	});

	test('GIVEN clone THEN returns similar instance', () => {
		// eslint-disable-next-line @typescript-eslint/dot-notation
		expectClonedValidator(predicate, predicate['clone']());
	});
});
