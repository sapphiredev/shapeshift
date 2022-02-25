import { ExpectedValidationError, s } from '../../src';

describe('InstanceValidator', () => {
	class User {
		public constructor(public name: string) {}
	}
	const predicate = s.instance(User);

	test('GIVEN an instance of User THEN returns the given value', () => {
		expect(predicate.parse(new User('Sapphire'))).toStrictEqual(new User('Sapphire'));
	});

	test("GIVEN anything which isn't and instance of User THEN throws ValidationError", () => {
		expect(() => predicate.parse(123)).toThrow(new ExpectedValidationError('InstanceValidator', 'Expected', 123, Array));
	});
});
