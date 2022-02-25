import { CombinedError, s, ValidationError } from '../../src';

describe('SetValidator', () => {
	const predicate = s.set(s.string);

	test('GIVEN a set with string value THEN returns the given value', () => {
		expect(predicate.parse(new Set().add('b'))).toStrictEqual(new Set().add('b'));
	});

	test("GIVEN a value which isn't a set THEN throws ValidationError", () => {
		expect(() => predicate.parse(123)).toThrow(new ValidationError('SetValidator', 'Expected a set', 123));
	});

	test('Given a set with non-string value THEN throw CombinedError', () => {
		const set = new Set().add(123);

		expect(() => predicate.parse(set)).toThrow(new CombinedError([new ValidationError('StringValidator', 'Expected a string', 123)]));
	});
});
