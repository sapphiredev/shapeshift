import { ExpectedConstraintError, s, ValidationError } from '../../src';
import { expectError } from '../common/macros/comparators';

describe('DateValidator', () => {
	const predicate = s.date;

	test('GIVEN a date THEN returns the given value', () => {
		const date = new Date();
		expect(predicate.parse(date)).toBe(date);
	});

	test.each(['abc', '', null, undefined])('GIVEN a non-date (%p) THEN throws ValidationError', (input) => {
		expectError(() => predicate.parse(input), new ValidationError('s.date', 'Expected a Date', input));
	});

	describe('Comparator', () => {
		const date = new Date('2022-02-01');
		const datesInFuture = [new Date('2022-03-01'), new Date('2023-01-01')];
		const datesInPast = [new Date('2022-01-01'), new Date('2020-01-01')];
		describe('lt', () => {
			const ltPredicate = s.date.lt(date);

			test.each(datesInPast)('GIVEN %s THEN returns given value', (value) => {
				expect(ltPredicate.parse(value)).toBe(value);
			});

			test.each(datesInFuture)('GIVEN %s THEN throws ConstraintError', (value) => {
				expectError(
					() => ltPredicate.parse(value),
					new ExpectedConstraintError('s.date.lt', 'Invalid Date value', value, 'expected < 2022-02-01T00:00:00.000Z')
				);
			});
		});

		describe('le', () => {
			const lePredicate = s.date.le(date);

			test.each([...datesInPast, date])('GIVEN %s THEN returns given value', (value) => {
				expect(lePredicate.parse(value)).toBe(value);
			});

			test.each(datesInFuture)('GIVEN %s THEN throws ConstraintError', (value) => {
				expectError(
					() => lePredicate.parse(value),
					new ExpectedConstraintError('s.date.le', 'Invalid Date value', value, 'expected <= 2022-02-01T00:00:00.000Z')
				);
			});
		});

		describe('gt', () => {
			const gtPredicate = s.date.gt(date);

			test.each(datesInFuture)('GIVEN %s THEN returns given value', (value) => {
				expect(gtPredicate.parse(value)).toBe(value);
			});

			test.each(datesInPast)('GIVEN %s THEN throws ConstraintError', (value) => {
				expectError(
					() => gtPredicate.parse(value),
					new ExpectedConstraintError('s.date.gt', 'Invalid Date value', value, 'expected > 2022-02-01T00:00:00.000Z')
				);
			});
		});

		describe('ge', () => {
			const gePredicate = s.date.ge(date);

			test.each([date, ...datesInFuture])('GIVEN %s THEN returns given value', (value) => {
				expect(gePredicate.parse(value)).toBe(value);
			});

			test.each(datesInPast)('GIVEN %s THEN throws ConstraintError', (value) => {
				expectError(
					() => gePredicate.parse(value),
					new ExpectedConstraintError('s.date.ge', 'Invalid Date value', value, 'expected >= 2022-02-01T00:00:00.000Z')
				);
			});
		});

		describe('eq', () => {
			const eqPredicate = s.date.eq(date);

			test('GIVEN date THEN returns given value', () => {
				expect(eqPredicate.parse(date)).toBe(date);
			});

			test.each([...datesInPast, ...datesInFuture])('GIVEN %s THEN throws ConstraintError', (value) => {
				expectError(
					() => eqPredicate.parse(value),
					new ExpectedConstraintError('s.date.eq', 'Invalid Date value', value, 'expected === 2022-02-01T00:00:00.000Z')
				);
			});
		});

		describe('ne', () => {
			const nePredicate = s.date.ne(date);

			test.each([...datesInPast, ...datesInFuture])('GIVEN %s THEN returns given value', (value) => {
				expect(nePredicate.parse(value)).toBe(value);
			});

			test('GIVEN date THEN throws ConstraintError', () => {
				expectError(
					() => nePredicate.parse(date),
					new ExpectedConstraintError('s.date.ne', 'Invalid Date value', date, 'expected !== 2022-02-01T00:00:00.000Z')
				);
			});
		});
	});

	describe('valid', () => {
		const validPredicate = s.date.valid;

		test.each(['2022-03-13T11:19:13.698Z', 1647170353698])('GIVEN a valid date (%p) THEN returns the given value', (value) => {
			const date = new Date(value);
			expect(validPredicate.parse(date)).toBe(date);
		});

		test.each([NaN, Infinity, -Infinity])('GIVEN an invalid date (%p) THEN throws ValidationError', (value) => {
			const date = new Date(value);
			expectError(
				() => validPredicate.parse(date),
				new ExpectedConstraintError('s.date.ne(NaN)', 'Invalid Date value', date, 'expected !== NaN')
			);
		});
	});

	describe('invalid', () => {
		const invalidPredicate = s.date.invalid;

		test.each([NaN, Infinity, -Infinity])('GIVEN an invalid date (%p) THEN returns the given value', (value) => {
			const date = new Date(value);
			expect(invalidPredicate.parse(date)).toBe(date);
		});

		test.each(['2022-03-13T11:19:13.698Z', 1647170353698])('GIVEN a valid date (%p) THEN throws ValidationError', (value) => {
			const date = new Date(value);
			expectError(
				() => invalidPredicate.parse(date),
				new ExpectedConstraintError('s.date.eq(NaN)', 'Invalid Date value', date, 'expected === NaN')
			);
		});
	});
});
