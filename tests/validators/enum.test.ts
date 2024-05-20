import { CombinedError, ExpectedValidationError, s } from '../../src';
import { expectError } from '../common/macros/comparators';

describe.each(['custom message', undefined])('EnumValidator', (message) => {
	const predicate = s.enum(['a', 'b', 'c'], { message });

	test.each(['a', 'b', 'c'])('GIVEN a string (%j) THEN returns a string', (input) => {
		expect(predicate.parse(input)).toBe(input);
	});

	test.each(['d', 'e', 'f', 1, null, true])('GIVEN a invalid value (%j) THEN throws CombinedError', (input) => {
		const errorMessage = message ?? 'Expected values to be equals';
		expectError(
			() => predicate.parse(input),
			new CombinedError(
				[
					new ExpectedValidationError('s.literal(V)', errorMessage, input, 'a'),
					new ExpectedValidationError('s.literal(V)', errorMessage, input, 'b'),
					new ExpectedValidationError('s.literal(V)', errorMessage, input, 'c')
				],
				{
					message: message ?? 'Received one or more errors'
				}
			)
		);
	});
});
