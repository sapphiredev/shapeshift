import { CombinedError, ExpectedValidationError, s } from '../../src';

describe('EnumValidator', () => {
	const predicate = s.enum('a', 'b', 'c');

	test.each(['a', 'b', 'c'])('GIVEN a string %s THEN returns a string', (input) => {
		expect(predicate.parse(input)).toBe(input);
	});

	test.each(['d', 'e', 'f', 1, null, true])('GIVEN a invalid value %s THEN throws CombinedError', (input) => {
		expect(() => predicate.parse(input)).toThrow(
			new CombinedError([
				new ExpectedValidationError('LiteralValidator', 'Expected values to be equals', input, 'a'),
				new ExpectedValidationError('LiteralValidator', 'Expected values to be equals', input, 'b'),
				new ExpectedValidationError('LiteralValidator', 'Expected values to be equals', input, 'c')
			])
		);
	});
});
