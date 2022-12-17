import { ExpectedConstraintError } from '../lib/errors/ExpectedConstraintError';
import { Result } from '../lib/Result';
import type { ValidatorOptions } from '../lib/util-types';
import type { IConstraint } from './base/IConstraint';
import { isUnique } from './util/isUnique';
import { equal, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual, notEqual, type Comparator } from './util/operators';

export type ArrayConstraintName = `s.array(T).${
	| 'unique'
	| `length${
			| 'LessThan'
			| 'LessThanOrEqual'
			| 'GreaterThan'
			| 'GreaterThanOrEqual'
			| 'Equal'
			| 'NotEqual'
			| 'Range'
			| 'RangeInclusive'
			| 'RangeExclusive'}`}()`;

function arrayLengthComparator<T>(
	comparator: Comparator,
	name: ArrayConstraintName,
	expected: string,
	length: number,
	options?: ValidatorOptions
): IConstraint<T[]> {
	return {
		run(input: T[]) {
			return comparator(input.length, length) //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError(name, options?.message ?? 'Invalid Array length', input, expected));
		}
	};
}

export function arrayLengthLessThan<T>(value: number, options?: ValidatorOptions): IConstraint<T[]> {
	const expected = `expected.length < ${value}`;
	return arrayLengthComparator(lessThan, 's.array(T).lengthLessThan()', expected, value, options);
}

export function arrayLengthLessThanOrEqual<T>(value: number, options?: ValidatorOptions): IConstraint<T[]> {
	const expected = `expected.length <= ${value}`;
	return arrayLengthComparator(lessThanOrEqual, 's.array(T).lengthLessThanOrEqual()', expected, value, options);
}

export function arrayLengthGreaterThan<T>(value: number, options?: ValidatorOptions): IConstraint<T[]> {
	const expected = `expected.length > ${value}`;
	return arrayLengthComparator(greaterThan, 's.array(T).lengthGreaterThan()', expected, value, options);
}

export function arrayLengthGreaterThanOrEqual<T>(value: number, options?: ValidatorOptions): IConstraint<T[]> {
	const expected = `expected.length >= ${value}`;
	return arrayLengthComparator(greaterThanOrEqual, 's.array(T).lengthGreaterThanOrEqual()', expected, value, options);
}

export function arrayLengthEqual<T>(value: number, options?: ValidatorOptions): IConstraint<T[]> {
	const expected = `expected.length === ${value}`;
	return arrayLengthComparator(equal, 's.array(T).lengthEqual()', expected, value, options);
}

export function arrayLengthNotEqual<T>(value: number, options?: ValidatorOptions): IConstraint<T[]> {
	const expected = `expected.length !== ${value}`;
	return arrayLengthComparator(notEqual, 's.array(T).lengthNotEqual()', expected, value, options);
}

export function arrayLengthRange<T>(start: number, endBefore: number, options?: ValidatorOptions): IConstraint<T[]> {
	const expected = `expected.length >= ${start} && expected.length < ${endBefore}`;
	return {
		run(input: T[]) {
			return input.length >= start && input.length < endBefore //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError('s.array(T).lengthRange()', options?.message ?? 'Invalid Array length', input, expected));
		}
	};
}

export function arrayLengthRangeInclusive<T>(start: number, end: number, options?: ValidatorOptions): IConstraint<T[]> {
	const expected = `expected.length >= ${start} && expected.length <= ${end}`;
	return {
		run(input: T[]) {
			return input.length >= start && input.length <= end //
				? Result.ok(input)
				: Result.err(
						new ExpectedConstraintError('s.array(T).lengthRangeInclusive()', options?.message ?? 'Invalid Array length', input, expected)
				  );
		}
	};
}

export function arrayLengthRangeExclusive<T>(startAfter: number, endBefore: number, options?: ValidatorOptions): IConstraint<T[]> {
	const expected = `expected.length > ${startAfter} && expected.length < ${endBefore}`;
	return {
		run(input: T[]) {
			return input.length > startAfter && input.length < endBefore //
				? Result.ok(input)
				: Result.err(
						new ExpectedConstraintError('s.array(T).lengthRangeExclusive()', options?.message ?? 'Invalid Array length', input, expected)
				  );
		}
	};
}

export function uniqueArray(options?: ValidatorOptions): IConstraint<unknown[]> {
	return {
		run(input: unknown[]) {
			return isUnique(input) //
				? Result.ok(input)
				: Result.err(
						new ExpectedConstraintError(
							's.array(T).unique()',
							options?.message ?? 'Array values are not unique',
							input,
							'Expected all values to be unique'
						)
				  );
		}
	};
}
