import { s, ValidationError } from '../../src';
import { expectError } from '../common/macros/comparators';

describe('LazyValidator', () => {
	const predicate = s.lazy((value) => {
		if (typeof value === 'boolean') return s.boolean.true;
		return s.string;
	});

	test.each([true, 'hello'])('GIVEN %j THEN returns the given value', (input) => {
		expect<true | string>(predicate.parse(input)).toBe(input);
	});

	test('GIVEN an invalid value THEN throw ValidationError', () => {
		expectError((): void => predicate.parse(123), new ValidationError('s.string', 'Expected a string primitive', 123));
	});
});
