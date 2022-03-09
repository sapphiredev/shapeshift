import { ExpectedConstraintError } from '../lib/errors/ExpectedConstraintError';
import { Result } from '../lib/Result';
import type { IConstraint } from './base/IConstraint';
import { Comparator, eq, ge, gt, le, lt, ne } from './util/operators';

export type ArrayConstraintName = `s.array(T).length${'Lt' | 'Le' | 'Gt' | 'Ge' | 'Eq' | 'Ne' | 'Range' | 'RangeInclusive' | 'RangeExclusive'}`;

function arrayLengthComparator<T>(comparator: Comparator, name: ArrayConstraintName, expected: string, length: number): IConstraint<T[]> {
	return {
		run(input: T[]) {
			return comparator(input.length, length) //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError(name, 'Invalid Array length', input, expected));
		}
	};
}

export function arrayLengthLt<T>(value: number): IConstraint<T[]> {
	const expected = `expected.length < ${value}`;
	return arrayLengthComparator(lt, 's.array(T).lengthLt', expected, value);
}

export function arrayLengthLe<T>(value: number): IConstraint<T[]> {
	const expected = `expected.length <= ${value}`;
	return arrayLengthComparator(le, 's.array(T).lengthLe', expected, value);
}

export function arrayLengthGt<T>(value: number): IConstraint<T[]> {
	const expected = `expected.length > ${value}`;
	return arrayLengthComparator(gt, 's.array(T).lengthGt', expected, value);
}

export function arrayLengthGe<T>(value: number): IConstraint<T[]> {
	const expected = `expected.length >= ${value}`;
	return arrayLengthComparator(ge, 's.array(T).lengthGe', expected, value);
}

export function arrayLengthEq<T>(value: number): IConstraint<T[]> {
	const expected = `expected.length === ${value}`;
	return arrayLengthComparator(eq, 's.array(T).lengthEq', expected, value);
}

export function arrayLengthNe<T>(value: number): IConstraint<T[]> {
	const expected = `expected.length !== ${value}`;
	return arrayLengthComparator(ne, 's.array(T).lengthNe', expected, value);
}

export function arrayLengthRange<T>(start: number, endBefore: number): IConstraint<T[]> {
	const expected = `expected.length >= ${start} && expected.length < ${endBefore}`;
	return {
		run(input: T[]) {
			return input.length >= start && input.length < endBefore //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError('s.array(T).lengthRange', 'Invalid Array length', input, expected));
		}
	};
}

export function arrayLengthRangeInclusive<T>(start: number, end: number): IConstraint<T[]> {
	const expected = `expected.length >= ${start} && expected.length <= ${end}`;
	return {
		run(input: T[]) {
			return input.length >= start && input.length <= end //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError('s.array(T).lengthRangeInclusive', 'Invalid Array length', input, expected));
		}
	};
}

export function arrayLengthRangeExclusive<T>(startAfter: number, endBefore: number): IConstraint<T[]> {
	const expected = `expected.length > ${startAfter} && expected.length < ${endBefore}`;
	return {
		run(input: T[]) {
			return input.length > startAfter && input.length < endBefore //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError('s.array(T).lengthRangeExclusive', 'Invalid Array length', input, expected));
		}
	};
}
