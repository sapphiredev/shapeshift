import { ExpectedConstraintError } from '../lib/errors/ExpectedConstraintError';
import { Result } from '../lib/Result';
import type { ValidatorOptions } from '../lib/util-types';
import type { IConstraint } from './base/IConstraint';
import { equal, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual, notEqual, type Comparator } from './util/operators';

export type DateConstraintName = `s.date().${
	| 'lessThan'
	| 'lessThanOrEqual'
	| 'greaterThan'
	| 'greaterThanOrEqual'
	| 'equal'
	| 'notEqual'
	| 'valid'
	| 'invalid'}()`;

function dateComparator(
	comparator: Comparator,
	name: DateConstraintName,
	expected: string,
	number: number,
	options?: ValidatorOptions
): IConstraint<Date> {
	return {
		run(input: Date) {
			return comparator(input.getTime(), number) //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError(name, options?.message ?? 'Invalid Date value', input, expected));
		}
	};
}

export function dateLessThan(value: Date, options?: ValidatorOptions): IConstraint<Date> {
	const expected = `expected < ${value.toISOString()}`;
	return dateComparator(lessThan, 's.date().lessThan()', expected, value.getTime(), options);
}

export function dateLessThanOrEqual(value: Date, options?: ValidatorOptions): IConstraint<Date> {
	const expected = `expected <= ${value.toISOString()}`;
	return dateComparator(lessThanOrEqual, 's.date().lessThanOrEqual()', expected, value.getTime(), options);
}

export function dateGreaterThan(value: Date, options?: ValidatorOptions): IConstraint<Date> {
	const expected = `expected > ${value.toISOString()}`;
	return dateComparator(greaterThan, 's.date().greaterThan()', expected, value.getTime(), options);
}

export function dateGreaterThanOrEqual(value: Date, options?: ValidatorOptions): IConstraint<Date> {
	const expected = `expected >= ${value.toISOString()}`;
	return dateComparator(greaterThanOrEqual, 's.date().greaterThanOrEqual()', expected, value.getTime(), options);
}

export function dateEqual(value: Date, options?: ValidatorOptions): IConstraint<Date> {
	const expected = `expected === ${value.toISOString()}`;
	return dateComparator(equal, 's.date().equal()', expected, value.getTime(), options);
}

export function dateNotEqual(value: Date, options?: ValidatorOptions): IConstraint<Date> {
	const expected = `expected !== ${value.toISOString()}`;
	return dateComparator(notEqual, 's.date().notEqual()', expected, value.getTime(), options);
}

export function dateInvalid(options?: ValidatorOptions): IConstraint<Date> {
	return {
		run(input: Date) {
			return Number.isNaN(input.getTime()) //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError('s.date().invalid()', options?.message ?? 'Invalid Date value', input, 'expected === NaN'));
		}
	};
}

export function dateValid(options?: ValidatorOptions): IConstraint<Date> {
	return {
		run(input: Date) {
			return Number.isNaN(input.getTime()) //
				? Result.err(new ExpectedConstraintError('s.date().valid()', options?.message ?? 'Invalid Date value', input, 'expected !== NaN'))
				: Result.ok(input);
		}
	};
}
