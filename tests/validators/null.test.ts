import { ExpectedValidationError, s } from '../../src';
import { expectError } from '../common/macros/comparators';

describe.each(['custom message', undefined])('NullValidator (%s)', (message) => {
	const predicate = s.null({ message });

	test('GIVEN null THEN returns null', () => {
		expect(predicate.parse(null)).toBe(null);
	});

	test.each([undefined, 123, 'Hello', {}])('GIVEN %j THEN throws ExpectedValidationError', (input) => {
		expectError(
			() => predicate.parse(input),
			new ExpectedValidationError('s.literal(V)', message ?? 'Expected values to be equals', input, null)
		);
	});
});
