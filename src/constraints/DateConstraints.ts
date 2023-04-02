import { ExpectedConstraintError } from '../lib/errors/ExpectedConstraintError';
import { Result } from '../lib/Result';
import type { IConstraint } from './base/IConstraint';
import { equal, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual, notEqual, type Comparator } from './util/operators';

export type DateConstraintName = `s.date.${
	| 'lessThan'
	| 'lessThanOrEqual'
	| 'greaterThan'
	| 'greaterThanOrEqual'
	| 'equal'
	| 'notEqual'
	| 'valid'
	| 'invalid'}`;

function dateComparator(comparator: Comparator, name: DateConstraintName, expected: string, number: number): IConstraint<Date> {
	return {
		run(input: Date) {
			return comparator(input.getTime(), number) //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError(name, 'Invalid Date value', input, expected));
		}
	};
}

export function dateLessThan(value: Date): IConstraint<Date> {
	const expected = `expected < ${value.toISOString()}`;
	return dateComparator(lessThan, 's.date.lessThan', expected, value.getTime());
}

export function dateLessThanOrEqual(value: Date): IConstraint<Date> {
	const expected = `expected <= ${value.toISOString()}`;
	return dateComparator(lessThanOrEqual, 's.date.lessThanOrEqual', expected, value.getTime());
}

export function dateGreaterThan(value: Date): IConstraint<Date> {
	const expected = `expected > ${value.toISOString()}`;
	return dateComparator(greaterThan, 's.date.greaterThan', expected, value.getTime());
}

export function dateGreaterThanOrEqual(value: Date): IConstraint<Date> {
	const expected = `expected >= ${value.toISOString()}`;
	return dateComparator(greaterThanOrEqual, 's.date.greaterThanOrEqual', expected, value.getTime());
}

export function dateEqual(value: Date): IConstraint<Date> {
	const expected = `expected === ${value.toISOString()}`;
	return dateComparator(equal, 's.date.equal', expected, value.getTime());
}

export function dateNotEqual(value: Date): IConstraint<Date> {
	const expected = `expected !== ${value.toISOString()}`;
	return dateComparator(notEqual, 's.date.notEqual', expected, value.getTime());
}

export const dateInvalid: IConstraint<Date> = {
	run(input: Date) {
		return Number.isNaN(input.getTime()) //
			? Result.ok(input)
			: Result.err(new ExpectedConstraintError('s.date.invalid', 'Invalid Date value', input, 'expected === NaN'));
	}
};

export const dateValid: IConstraint<Date> = {
	run(input: Date) {
		return Number.isNaN(input.getTime()) //
			? Result.err(new ExpectedConstraintError('s.date.valid', 'Invalid Date value', input, 'expected !== NaN'))
			: Result.ok(input);
	}
};
