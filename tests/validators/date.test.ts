import { ConstraintError, s, ValidationError } from '../../src';

describe('DateValidator', () => {
	const predicate = s.date;

	test('GIVEN a date THEN returns the given value', () => {
		const date = new Date();
		expect(predicate.parse(date)).toBe(date);
	});

	test('GIVEN a non-date THEN throws ValidationError', () => {
		expect(() => predicate.parse('Hello there')).toThrow(new ValidationError('DateValidator', 'Expected a Date', 'Hello there'));
	});

	describe('lt', () => {
		const ltPredicate = s.date.lt(new Date('2022-02-01'));

		test.each([new Date('2022-01-01'), new Date('2020-01-01')])('GIVEN %s THEN returns given value', (value) => {
			expect(ltPredicate.parse(value)).toBe(value);
		});

		test.each([new Date('2022-03-01'), new Date('2023-01-02')])('GIVEN %s THEN throws ConstraintError', (value) => {
			expect(() => ltPredicate.parse(value)).toThrow(new ConstraintError('s.date.lt', 'Invalid Date value', value, 'expected < 2022-01-01'));
		});
	});

	describe('le', () => {
		const lePredicate = s.date.le(new Date('2022-01-01'));

		test.each([new Date('2022-01-01'), new Date('2020-01-01')])('GIVEN %s THEN returns given value', (value) => {
			expect(lePredicate.parse(value)).toBe(value);
		});

		test.each([new Date('2022-01-02'), new Date('2022-02-02')])('GIVEN %s THEN throws ConstraintError', (value) => {
			expect(() => lePredicate.parse(value)).toThrow(new ConstraintError('s.date.le', 'Invalid Date value', value, 'expected <= 2022-01-01'));
		});
	});

	describe('gt', () => {
		const gtPredicate = s.date.gt(new Date('2022-01-01'));

		test.each([new Date('2022-01-02'), new Date('2023-01-01')])('GIVEN %s THEN returns given value', (value) => {
			expect(gtPredicate.parse(value)).toBe(value);
		});

		test.each([new Date('2022-01-01'), new Date('2020-01-01')])('GIVEN %s THEN throws ConstraintError', (value) => {
			expect(() => gtPredicate.parse(value)).toThrow(new ConstraintError('s.date.gt', 'Invalid Date value', value, 'expected > 2022-01-01'));
		});
	});
});
