import { ConstraintError } from '../lib/errors/ConstraintError';
import { Result } from '../lib/Result';
import type { IConstraint } from './base/IConstraint';
import { Comparator, eq, ge, gt, le, lt, ne } from './util/operators';

export type ArrayConstraintName = `s.array(T).length${'Lt' | 'Le' | 'Gt' | 'Ge' | 'Eq' | 'Ne'}`;

function arrayLengthComparator<T>(comparator: Comparator, name: ArrayConstraintName, expected: string, length: number): IConstraint<T[]> {
	return {
		run(input: T[]) {
			return comparator(input.length, length) //
				? Result.ok(input)
				: Result.err(new ConstraintError(name, 'Invalid Array length', input, expected));
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
