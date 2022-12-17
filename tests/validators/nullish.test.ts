import { s, ValidationError } from '../../src';
import { expectError } from '../common/macros/comparators';

describe('NullishValidator', () => {
	const predicate = s.nullish();

	test.each([null, undefined])('GIVEN %j THEN returns the given value', (input) => {
		expect(predicate.parse(input)).toBe(input);
	});

	test.each([123, 'hello'])('GIVEN %j THEN throws ValidationError', (input) => {
		expectError(() => predicate.parse(input), new ValidationError('s.nullish()', 'Expected undefined or null', input));
	});
});
