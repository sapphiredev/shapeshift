import { CombinedError, s, ValidationError } from '../../src';

describe('RecordValidator', () => {
	const value = { foo: 'bar', fizz: 'buzz' };
	const predicate = s.record(s.string);

	test('GIVEN a non-record THEN throws ValidationError', () => {
		expect(() => predicate.parse(false)).toThrow(new ValidationError('RecordValidator', 'Expected an object', false));
	});

	test('GIVEN null THEN throws ValidationError', () => {
		expect(() => predicate.parse(null)).toThrow(new ValidationError('RecordValidator', 'Expected the value to not be null', null));
	});

	test('GIVEN a matching record THEN returns a record', () => {
		expect(predicate.parse(value)).toStrictEqual(value);
	});

	test('GIVEN a non-matching record THEN throws CombinedError', () => {
		expect(() => predicate.parse({ foo: 1, fizz: true })).toThrow(
			new CombinedError([
				new ValidationError('StringValidator', 'Expected a string primitive', 1),
				new ValidationError('StringValidator', 'Expected a string primitive', true)
			])
		);
	});

	test('GIVEN clone THEN returns similar instance', () => {
		// @ts-expect-error Test clone
		const clonePredicate = predicate.clone();

		expect(clonePredicate.parse(value)).toStrictEqual(value);
	});
});
