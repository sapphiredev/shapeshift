import { CombinedPropertyError, s, ValidationError } from '../../src';
import { expectClonedValidator, expectError } from '../common/macros/comparators';

describe.each(['custom message', undefined])('RecordValidator (%s)', (message) => {
	const value = { foo: 'bar', fizz: 'buzz' };
	const predicate = s.record(s.string({ message }), { message });

	test('GIVEN a non-record THEN throws ValidationError', () => {
		expectError(() => predicate.parse(false), new ValidationError('s.record(T)', message ?? 'Expected an object', false));
	});

	test('GIVEN null THEN throws ValidationError', () => {
		expectError(() => predicate.parse(null), new ValidationError('s.record(T)', message ?? 'Expected the value to not be null', null));
	});

	test('GIVEN a matching record THEN returns a record', () => {
		expect(predicate.parse(value)).toStrictEqual(value);
	});

	test('GIVEN a non-matching record THEN throws CombinedError', () => {
		expectError(
			() => predicate.parse({ foo: 1, fizz: true }),
			new CombinedPropertyError(
				[
					['foo', new ValidationError('s.string()', message ?? 'Expected a string primitive', 1)],
					['fizz', new ValidationError('s.string()', message ?? 'Expected a string primitive', true)]
				],
				{
					message: message ?? 'Received one or more errors'
				}
			)
		);
	});

	test('GIVEN clone THEN returns similar instance', () => {
		expectClonedValidator(predicate, predicate['clone']());
	});

	test('GIVEN an array THEN throws ValidationError', () => {
		expectError(
			() => predicate.parse([1, 2, 3]),
			new ValidationError('s.record(T)', message ?? 'Expected the value to not be an array', [1, 2, 3])
		);
	});
});
