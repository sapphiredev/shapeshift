import { ConstraintError } from '../lib/errors/ConstraintError';
import { Result } from '../lib/Result';
import type { IConstraint } from './base/IConstraint';
import { Comparator, eq, ge, gt, le, lt, ne } from './util/operators';

export type StringConstraintName = `s.string.length${'Lt' | 'Le' | 'Gt' | 'Ge' | 'Eq' | 'Ne'}`;

function stringLengthComparator(comparator: Comparator, name: StringConstraintName, expected: string, length: number): IConstraint<string> {
	return {
		run(input: string) {
			return comparator(input.length, length) //
				? Result.ok(input)
				: Result.err(new ConstraintError(name, 'Invalid string length', input, expected));
		}
	};
}

export function stringLengthLt(length: number): IConstraint<string> {
	const expected = `expected.length < ${length}`;
	return stringLengthComparator(lt, 's.string.lengthLt', expected, length);
}

export function stringLengthLe(length: number): IConstraint<string> {
	const expected = `expected.length <= ${length}`;
	return stringLengthComparator(le, 's.string.lengthLe', expected, length);
}

export function stringLengthGt(length: number): IConstraint<string> {
	const expected = `expected.length > ${length}`;
	return stringLengthComparator(gt, 's.string.lengthGt', expected, length);
}

export function stringLengthGe(length: number): IConstraint<string> {
	const expected = `expected.length >= ${length}`;
	return stringLengthComparator(ge, 's.string.lengthGe', expected, length);
}

export function stringLengthEq(length: number): IConstraint<string> {
	const expected = `expected.length === ${length}`;
	return stringLengthComparator(eq, 's.string.lengthEq', expected, length);
}

export function stringLengthNe(length: number): IConstraint<string> {
	const expected = `expected.length !== ${length}`;
	return stringLengthComparator(ne, 's.string.lengthNe', expected, length);
}
