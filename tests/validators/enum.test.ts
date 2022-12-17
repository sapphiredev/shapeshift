import { CombinedError, ExpectedValidationError, s } from '../../src';
import { expectError } from '../common/macros/comparators';

describe('EnumValidator', () => {
	const predicate = s.enum(['a', 'b', 'c']);

	test.each(['a', 'b', 'c'])('GIVEN a string (%j) THEN returns a string', (input) => {
		expect(predicate.parse(input)).toBe(input);
	});

	test.each(['d', 'e', 'f', 1, null, true])('GIVEN a invalid value (%j) THEN throws CombinedError', (input) => {
		expectError(
			() => predicate.parse(input),
			new CombinedError([
				new ExpectedValidationError('s.literal(V)', 'Expected values to be equals', input, 'a'),
				new ExpectedValidationError('s.literal(V)', 'Expected values to be equals', input, 'b'),
				new ExpectedValidationError('s.literal(V)', 'Expected values to be equals', input, 'c')
			])
		);
	});
});
