import { CombinedError, s, ValidationError } from '../../src';

describe('SetValidator', () => {
	const predicate = s.set(s.string);

	test.each([123, 'foo', [], {}, new Map()])("GIVEN a value which isn't a set %s THEN throws ValidationError", (input) => {
		expect(() => predicate.parse(input)).toThrow(new ValidationError('SetValidator', 'Expected a set', input));
	});

	test.each(['1', 'a', 'foo'])('GIVEN a set with string value %s THEN returns the given set', (input) => {
		const set = new Set([input]);

		expect(predicate.parse(set)).toStrictEqual(set);
	});

	test.each([123, [], {}])('Given a set with non-string value %s THEN throw CombinedError', (input) => {
		const set = new Set([input]);

		expect(() => predicate.parse(set)).toThrow(new CombinedError([new ValidationError('StringValidator', 'Expected a string', input)]));
	});

	test('clone', () => {
		// @ts-ignore Test clone
		const clonePredicate = predicate.clone();

		expect(clonePredicate.parse(new Set(['foo']))).toStrictEqual(new Set(['foo']));
	});
});
