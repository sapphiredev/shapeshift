import { ExpectedValidationError, s } from '../../src';

describe('NullValidator', () => {
	const predicate = s.null;

	test('GIVEN null THEN returns null', () => {
		expect(predicate.parse(null)).toBe(null);
	});

	test.each([undefined, 123, 'Hello', {}])('GIVEN non-null %s THEN throws ExpectedValidationError', (input) => {
		expect(() => predicate.parse(input)).toThrow(new ExpectedValidationError('LiteralValidator', 'Expected values to be equals', input, null));
	});
});
