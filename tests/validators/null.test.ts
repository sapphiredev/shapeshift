import { ExpectedValidationError, s } from '../../src';
import { expectError } from '../common/macros/comparators';

describe('NullValidator', () => {
	const predicate = s.null();

	test('GIVEN null THEN returns null', () => {
		expect(predicate.parse(null)).toBe(null);
	});

	test.each([undefined, 123, 'Hello', {}])('GIVEN %j THEN throws ExpectedValidationError', (input) => {
		expectError(() => predicate.parse(input), new ExpectedValidationError('s.literal(V)', 'Expected values to be equals', input, null));
	});
});
