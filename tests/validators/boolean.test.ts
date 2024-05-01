import { ExpectedConstraintError, s, ValidationError } from '../../src';
import { expectError } from '../common/macros/comparators';

describe.each(['custom message', undefined])('BooleanValidator (%s)', (message) => {
	const predicate = s.boolean({ message });

	const invalidBooleanErrorMessage = message ?? 'Invalid boolean value';

	test('GIVEN a boolean THEN returns the given value', () => {
		expect(predicate.parse(true)).toBe(true);
	});

	test('GIVEN a non-boolean THEN throws ValidationError', () => {
		const errorMessage = message ?? 'Expected a boolean primitive';
		expectError(() => predicate.parse('Hello there'), new ValidationError('s.boolean()', errorMessage, 'Hello there'));
	});

	describe('Comparators', () => {
		// equal, notEqual
		describe('equal', () => {
			const eqPredicate = s.boolean().equal(true, { message });

			test('GIVEN true THEN returns given value', () => {
				expect(eqPredicate.parse(true)).toBe(true);
			});

			test('GIVEN false THEN throws ConstraintError', () => {
				expectError(
					() => eqPredicate.parse(false),
					new ExpectedConstraintError('s.boolean().true()', invalidBooleanErrorMessage, false, 'true')
				);
			});
		});

		describe('notEqual', () => {
			const nePredicate = s.boolean().notEqual(true, { message });

			test('GIVEN false THEN returns given value', () => {
				expect(nePredicate.parse(false)).toBe(false);
			});

			test('GIVEN true THEN throws ConstraintError', () => {
				expectError(
					() => nePredicate.parse(true),
					new ExpectedConstraintError('s.boolean().false()', invalidBooleanErrorMessage, true, 'false')
				);
			});
		});
	});

	describe('Constraints', () => {
		describe('true', () => {
			const truePredicate = s.boolean().true({ message });

			test('GIVEN true THEN returns given value', () => {
				expect(truePredicate.parse(true)).toBe(true);
			});

			test('GIVEN false THEN throws ConstraintError', () => {
				expectError(
					() => truePredicate.parse(false),
					new ExpectedConstraintError('s.boolean().true()', invalidBooleanErrorMessage, false, 'true')
				);
			});
		});

		describe('false', () => {
			const falsePredicate = s.boolean().false({ message });

			test('GIVEN false THEN returns given value', () => {
				expect(falsePredicate.parse(false)).toBe(false);
			});

			test('GIVEN true THEN throws ConstraintError', () => {
				expectError(
					() => falsePredicate.parse(true),
					new ExpectedConstraintError('s.boolean().false()', invalidBooleanErrorMessage, true, 'false')
				);
			});
		});
	});
});
