import { ExpectedValidationError, s } from '../../src';

describe('UndefinedValidator', () => {
	const predicate = s.undefined;

	test('GIVEN undefined THEN returns undefined', () => {
		expect(predicate.parse(undefined)).toBe(undefined);
	});

	test.each([null, 123, 'Hello'])('GIVEN non-undefined %s THEN throws ExpectedValidationError', (input) => {
		expect(() => predicate.parse(input)).toThrow(
			new ExpectedValidationError('LiteralValidator', 'Expected values to be equals', input, undefined)
		);
	});
});
