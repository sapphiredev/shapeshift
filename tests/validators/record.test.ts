import { CombinedPropertyError, s, ValidationError } from '../../src';
import { expectClonedValidator, expectError } from '../common/macros/comparators';

describe('RecordValidator', () => {
	const value = { foo: 'bar', fizz: 'buzz' };
	const predicate = s.record(s.string);

	test('GIVEN a non-record THEN throws ValidationError', () => {
		expectError(() => predicate.parse(false), new ValidationError('s.record(T)', 'Expected an object', false));
	});

	test('GIVEN null THEN throws ValidationError', () => {
		expectError(() => predicate.parse(null), new ValidationError('s.record(T)', 'Expected the value to not be null', null));
	});

	test('GIVEN a matching record THEN returns a record', () => {
		expect(predicate.parse(value)).toStrictEqual(value);
	});

	test('GIVEN a non-matching record THEN throws CombinedError', () => {
		expectError(
			() => predicate.parse({ foo: 1, fizz: true }),
			new CombinedPropertyError([
				['foo', new ValidationError('s.string', 'Expected a string primitive', 1)],
				['fizz', new ValidationError('s.string', 'Expected a string primitive', true)]
			])
		);
	});

	test('GIVEN clone THEN returns similar instance', () => {
		expectClonedValidator(predicate, predicate['clone']());
	});
});
