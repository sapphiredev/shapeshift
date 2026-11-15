import { ExpectedValidationError, s } from '../../../src';
import { expectError } from '../common/macros/comparators';

describe.each(['custom message', undefined])('UndefinedValidator (%s)', (message) => {
	const predicate = s.undefined({ message });

	test('GIVEN undefined THEN returns undefined', () => {
		// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -- Undefined is the validated value, not a void side effect.
		expect(predicate.parse(undefined)).toBe(undefined);
	});

	test.each([null, 123, 'Hello'])('GIVEN %j THEN throws ExpectedValidationError', (input) => {
		expectError(
			() => predicate.parse(input),
			new ExpectedValidationError('s.literal(V)', message ?? 'Expected values to be equals', input, undefined)
		);
	});
});
