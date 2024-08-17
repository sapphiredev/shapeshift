import { CombinedError, s, ValidationError } from '../../../src';
import { expectClonedValidator, expectError } from '../common/macros/comparators';

describe.each(['custom message', undefined])('SetValidator (%s)', (message) => {
	const predicate = s.set(s.string({ message }), { message });

	test.each([123, 'foo', [], {}, new Map()])("GIVEN a value which isn't a set (%j) THEN throws ValidationError", (input) => {
		expectError(() => predicate.parse(input), new ValidationError('s.set(T)', message ?? 'Expected a set', input));
	});

	test.each(['1', 'a', 'foo'])('GIVEN a set with string value (%j) THEN returns the given set', (input) => {
		const set = new Set([input]);

		expect(predicate.parse(set)).toStrictEqual(set);
	});

	test.each([123, [], {}])('GIVEN a set with non-string value (%j) THEN throw CombinedError', (input) => {
		const set = new Set([input]);

		expectError(
			() => predicate.parse(set),
			new CombinedError([new ValidationError('s.string()', message ?? 'Expected a string primitive', input)], {
				message: message ?? 'Received one or more errors'
			})
		);
	});

	test('GIVEN clone THEN returns similar instance', () => {
		expectClonedValidator(predicate, predicate['clone']());
	});
});
