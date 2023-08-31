import { ExpectedValidationError, s } from '../../src';
import { expectClonedValidator, expectError } from '../common/macros/comparators';

describe('LiteralValidator', () => {
	const predicate = s.literal('sapphire');

	test('GIVEN a literal THEN returns the given value', () => {
		expect(predicate.parse('sapphire')).toBe('sapphire');
	});

	test('GIVEN anything which is not the literal THEN throws ExpectedValidationError', () => {
		expectError(() => predicate.parse('hello'), new ExpectedValidationError('s.literal(V)', 'Expected values to be equals', 'hello', 'sapphire'));
	});

	test('GIVEN date literal THEN returns s.date().equal(V)', () => {
		const date = new Date('2022-01-01');
		expectClonedValidator(s.literal(date), s.date().equal(date));
	});

	test('GIVEN clone THEN returns similar instance', () => {
		expectClonedValidator(predicate, predicate['clone']());
	});
});
