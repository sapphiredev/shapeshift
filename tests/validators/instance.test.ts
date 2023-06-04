import { ExpectedValidationError, s } from '../../src';
import { expectClonedValidator, expectError } from '../common/macros/comparators';

describe('InstanceValidator', () => {
	class User {
		public constructor(public name: string) {}
	}
	const predicate = s.instance(User);

	test('GIVEN an instance of User THEN returns the given value', () => {
		expect(predicate.parse(new User('Sapphire'))).toStrictEqual(new User('Sapphire'));
	});

	test('GIVEN anything which is not and instance of User THEN throws ValidationError', () => {
		expectError(() => predicate.parse(123), new ExpectedValidationError('s.instance(V)', 'Expected', 123, User));
	});

	test('GIVEN clone THEN returns similar instance', () => {
		expectClonedValidator(predicate, predicate['clone']());
	});
});
