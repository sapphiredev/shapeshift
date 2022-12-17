import { ExpectedConstraintError, s, ValidationError } from '../../src';
import { expectClonedValidator, expectError } from '../common/macros/comparators';

describe('DateValidator', () => {
	const predicate = s.date();

	test('GIVEN a date THEN returns the given value', () => {
		const date = new Date();
		expect(predicate.parse(date)).toBe(date);
	});

	test.each(['abc', '', null, undefined])('GIVEN a non-date (%j) THEN throws ValidationError', (input) => {
		expectError(() => predicate.parse(input), new ValidationError('s.date()', 'Expected a Date', input));
	});

	describe('Comparator', () => {
		const date = new Date('2022-02-01');
		const datesInFuture = [new Date('2022-03-01'), new Date('2023-01-01')];
		const datesInPast = [new Date('2022-01-01'), new Date('2020-01-01')];

		describe('lessThan', () => {
			const ltPredicate = s.date().lessThan(date);

			test.each(datesInPast)('GIVEN %j THEN returns given value', (value) => {
				expect(ltPredicate.parse(value)).toBe(value);
			});

			test.each(datesInFuture)('GIVEN %j THEN throws ConstraintError', (value) => {
				expectError(
					() => ltPredicate.parse(value),
					new ExpectedConstraintError('s.date().lessThan()', 'Invalid Date value', value, 'expected < 2022-02-01T00:00:00.000Z')
				);
			});
		});

		describe('lessThanOrEqual', () => {
			const lePredicate = s.date().lessThanOrEqual(date);

			test.each([...datesInPast, date])('GIVEN %j THEN returns given value', (value) => {
				expect(lePredicate.parse(value)).toBe(value);
			});

			test.each(datesInFuture)('GIVEN %j THEN throws ConstraintError', (value) => {
				expectError(
					() => lePredicate.parse(value),
					new ExpectedConstraintError('s.date().lessThanOrEqual()', 'Invalid Date value', value, 'expected <= 2022-02-01T00:00:00.000Z')
				);
			});
		});

		describe('greaterThan', () => {
			const gtPredicate = s.date().greaterThan(date);

			test.each(datesInFuture)('GIVEN %j THEN returns given value', (value) => {
				expect(gtPredicate.parse(value)).toBe(value);
			});

			test.each(datesInPast)('GIVEN %j THEN throws ConstraintError', (value) => {
				expectError(
					() => gtPredicate.parse(value),
					new ExpectedConstraintError('s.date().greaterThan()', 'Invalid Date value', value, 'expected > 2022-02-01T00:00:00.000Z')
				);
			});
		});

		describe('greaterThanOrEqual', () => {
			const gePredicate = s.date().greaterThanOrEqual(date);

			test.each([date, ...datesInFuture])('GIVEN %j THEN returns given value', (value) => {
				expect(gePredicate.parse(value)).toBe(value);
			});

			test.each(datesInPast)('GIVEN %j THEN throws ConstraintError', (value) => {
				expectError(
					() => gePredicate.parse(value),
					new ExpectedConstraintError('s.date().greaterThanOrEqual()', 'Invalid Date value', value, 'expected >= 2022-02-01T00:00:00.000Z')
				);
			});
		});

		describe('equal', () => {
			const eqPredicate = s.date().equal(date);

			test('GIVEN date THEN returns given value', () => {
				expect(eqPredicate.parse(date)).toBe(date);
			});

			test.each([...datesInPast, ...datesInFuture])('GIVEN %j THEN throws ConstraintError', (value) => {
				expectError(
					() => eqPredicate.parse(value),
					new ExpectedConstraintError('s.date().equal()', 'Invalid Date value', value, 'expected === 2022-02-01T00:00:00.000Z')
				);
			});

			describe('equal > NaN', () => {
				test.each(['not-a-date', NaN])('GIVEN %j THEN returns s.date().invalid', (value) => {
					expectClonedValidator(s.date().equal(value), s.date().invalid());
				});
			});
		});

		describe('notEqual', () => {
			const nePredicate = s.date().notEqual(date);

			test.each([...datesInPast, ...datesInFuture])('GIVEN %j THEN returns given value', (value) => {
				expect(nePredicate.parse(value)).toBe(value);
			});

			test('GIVEN date THEN throws ConstraintError', () => {
				expectError(
					() => nePredicate.parse(date),
					new ExpectedConstraintError('s.date().notEqual()', 'Invalid Date value', date, 'expected !== 2022-02-01T00:00:00.000Z')
				);
			});

			describe('notEqual > NaN', () => {
				test.each(['not-a-date', NaN])('GIVEN %j THEN returns s.date().invalid', (value) => {
					expectClonedValidator(s.date().notEqual(value), s.date().invalid());
				});
			});
		});
	});

	describe('valid', () => {
		const validPredicate = s.date().valid();

		test.each(['2022-03-13T11:19:13.698Z', 1647170353698])('GIVEN a valid date (%j) THEN returns the given value', (value) => {
			const date = new Date(value);
			expect(validPredicate.parse(date)).toBe(date);
		});

		test.each([NaN, Infinity, -Infinity])('GIVEN an invalid date (%j) THEN throws ValidationError', (value) => {
			const date = new Date(value);
			expectError(
				() => validPredicate.parse(date),
				new ExpectedConstraintError('s.date().valid()', 'Invalid Date value', date, 'expected !== NaN')
			);
		});
	});

	describe('invalid', () => {
		const invalidPredicate = s.date().invalid();

		test.each([NaN, Infinity, -Infinity])('GIVEN an invalid date (%j) THEN returns the given value', (value) => {
			const date = new Date(value);
			expect(invalidPredicate.parse(date)).toBe(date);
		});

		test.each(['2022-03-13T11:19:13.698Z', 1647170353698])('GIVEN a valid date (%j) THEN throws ValidationError', (value) => {
			const date = new Date(value);
			expectError(
				() => invalidPredicate.parse(date),
				new ExpectedConstraintError('s.date().invalid()', 'Invalid Date value', date, 'expected === NaN')
			);
		});
	});
});
