import { ExpectedValidationError, s } from '../../../src';
import { expectClonedValidator, expectError } from '../common/macros/comparators';

describe.each(['custom message', undefined])('LiteralValidator (%s)', (message) => {
	const predicate = s.literal('sapphire', {
		dateOptions: {
			message
		},
		equalsOptions: {
			message
		}
	});

	test('GIVEN a literal THEN returns the given value', () => {
		expect(predicate.parse('sapphire')).toBe('sapphire');
	});

	test('GIVEN anything which is not the literal THEN throws ExpectedValidationError', () => {
		const errorMessage = message ?? 'Expected values to be equals';
		expectError(() => predicate.parse('hello'), new ExpectedValidationError('s.literal(V)', errorMessage, 'hello', 'sapphire'));
	});

	test('GIVEN date literal THEN returns s.date().equal(V)', () => {
		const date = new Date('2022-01-01');
		expectClonedValidator(s.literal(date), s.date().equal(date));
	});

	test('GIVEN clone THEN returns similar instance', () => {
		expectClonedValidator(predicate, predicate['clone']());
	});
});
