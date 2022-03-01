import { ConstraintError, s, ValidationError } from '../../src';
import { expectError } from '../common/macros/comparators';

describe('BooleanValidator', () => {
	const predicate = s.boolean;

	test('GIVEN a boolean THEN returns the given value', () => {
		expect(predicate.parse(true)).toBe(true);
	});

	test('GIVEN a non-boolean THEN throws ValidationError', () => {
		expectError(() => predicate.parse('Hello there'), new ValidationError('s.boolean', 'Expected a boolean primitive', 'Hello there'));
	});

	describe('Comparators', () => {
		// eq, ne
		describe('eq', () => {
			const eqPredicate = s.boolean.eq(true);

			test('GIVEN true THEN returns given value', () => {
				expect(eqPredicate.parse(true)).toBe(true);
			});

			test('GIVEN false THEN throws ConstraintError', () => {
				expectError(() => eqPredicate.parse(false), new ConstraintError('s.boolean.true', 'Invalid boolean value', false, 'true'));
			});
		});

		describe('ne', () => {
			const nePredicate = s.boolean.ne(true);

			test('GIVEN false THEN returns given value', () => {
				expect(nePredicate.parse(false)).toBe(false);
			});

			test('GIVEN true THEN throws ConstraintError', () => {
				expectError(() => nePredicate.parse(true), new ConstraintError('s.boolean.false', 'Invalid boolean value', true, 'false'));
			});
		});
	});

	describe('Constraints', () => {
		describe('true', () => {
			const truePredicate = s.boolean.true;

			test('GIVEN true THEN returns given value', () => {
				expect(truePredicate.parse(true)).toBe(true);
			});

			test('GIVEN false THEN throws ConstraintError', () => {
				expectError(() => truePredicate.parse(false), new ConstraintError('s.boolean.true', 'Invalid boolean value', false, 'true'));
			});
		});

		describe('false', () => {
			const falsePredicate = s.boolean.false;

			test('GIVEN false THEN returns given value', () => {
				expect(falsePredicate.parse(false)).toBe(false);
			});

			test('GIVEN true THEN throws ConstraintError', () => {
				expectError(() => falsePredicate.parse(true), new ConstraintError('s.boolean.false', 'Invalid boolean value', true, 'false'));
			});
		});
	});
});
