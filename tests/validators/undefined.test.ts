import { ExpectedValidationError, s } from '../../src';
import { expectError } from '../common/macros/comparators';

describe('UndefinedValidator', () => {
	const predicate = s.undefined();

	test('GIVEN undefined THEN returns undefined', () => {
		expect(predicate.parse(undefined)).toBe(undefined);
	});

	test.each([null, 123, 'Hello'])('GIVEN %j THEN throws ExpectedValidationError', (input) => {
		expectError(() => predicate.parse(input), new ExpectedValidationError('s.literal(V)', 'Expected values to be equals', input, undefined));
	});
});
