import { s, ValidationError } from '../../src';

describe('NullishValidator', () => {
	const predicate = s.nullish;

	test.each([null, undefined])('GIVEN a value THEN returns the given value', (input) => {
		expect(predicate.parse(input)).toBe(input);
	});

	test.each([123, 'hello'])('GIVEN a value THEN throws ValidationError', (input) => {
		expect(() => predicate.parse(input)).toThrow(new ValidationError('NullishValidator', 'Expected undefined or null', input));
	});
});
