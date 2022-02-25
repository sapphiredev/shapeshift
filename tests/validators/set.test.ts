import { CombinedError, s, ValidationError } from '../../src';

describe('SetValidator', () => {
	const predicate = s.set(s.string);

	test("GIVEN a value which isn't a set THEN throws ValidationError", () => {
		expect(() => predicate.parse(123)).toThrow(new ValidationError('SetValidator', 'Expected a set', 123));
	});

	test.each(['1', 'a', 'foo'])('GIVEN a set with string value %s THEN returns the given value', (input) => {
		expect(predicate.parse(new Set().add(input))).toStrictEqual(new Set().add(input));
	});

	test.each([123, [], {}])('Given a set with non-string value %s THEN throw CombinedError', (input) => {
		const set = new Set().add(input);

		expect(() => predicate.parse(set)).toThrow(new CombinedError([new ValidationError('StringValidator', 'Expected a string', input)]));
	});
});
