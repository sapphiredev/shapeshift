import { ExpectedValidationError, s } from '../../src';
import { expectError } from '../common/macros/comparators';

describe.each(['custom message', undefined])('UndefinedValidator (%s)', (message) => {
	const predicate = s.undefined({ message });

	test('GIVEN undefined THEN returns undefined', () => {
		expect(predicate.parse(undefined)).toBe(undefined);
	});

	test.each([null, 123, 'Hello'])('GIVEN %j THEN throws ExpectedValidationError', (input) => {
		expectError(
			() => predicate.parse(input),
			new ExpectedValidationError('s.literal(V)', message ?? 'Expected values to be equals', input, undefined)
		);
	});
});
