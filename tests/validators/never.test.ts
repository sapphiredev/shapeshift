import { s, ValidationError } from '../../src';

describe('NeverValidator', () => {
	const predicate = s.never;

	test.each([123, 'hello'])('GIVEN a value THEN throws ConstraintError', (input) => {
		expect(() => predicate.parse(input)).toThrow(new ValidationError('NeverValidator', 'Expected a value to not be passed', input));
	});
});
