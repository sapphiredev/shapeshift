import { ConstraintError } from '../lib/errors/ConstraintError';
import { Result } from '../lib/Result';
import type { IConstraint } from './base/IConstraint';
import { Comparator, eq, ge, gt, le, lt, ne } from './util/operators';

export type BigIntComparatorConstraintName = `s.bigint.${'lt' | 'le' | 'gt' | 'ge' | 'eq' | 'ne'}`;
export type BigIntConstraintName = BigIntComparatorConstraintName;

function bigintComparator(comparator: Comparator, name: BigIntComparatorConstraintName, expected: string, number: bigint): IConstraint<bigint> {
	return {
		run(input: bigint) {
			return comparator(input, number) //
				? Result.ok(input)
				: Result.err(new ConstraintError(name, 'Invalid bigint value', input, expected));
		}
	};
}

export function bigintLt(value: bigint): IConstraint<bigint> {
	const expected = `expected < ${value}n`;
	return bigintComparator(lt, 's.bigint.lt', expected, value);
}

export function bigintLe(value: bigint): IConstraint<bigint> {
	const expected = `expected <= ${value}n`;
	return bigintComparator(le, 's.bigint.le', expected, value);
}

export function bigintGt(value: bigint): IConstraint<bigint> {
	const expected = `expected > ${value}n`;
	return bigintComparator(gt, 's.bigint.gt', expected, value);
}

export function bigintGe(value: bigint): IConstraint<bigint> {
	const expected = `expected >= ${value}n`;
	return bigintComparator(ge, 's.bigint.ge', expected, value);
}

export function bigintEq(value: bigint): IConstraint<bigint> {
	const expected = `expected === ${value}n`;
	return bigintComparator(eq, 's.bigint.eq', expected, value);
}

export function bigintNe(value: bigint): IConstraint<bigint> {
	const expected = `expected !== ${value}n`;
	return bigintComparator(ne, 's.bigint.ne', expected, value);
}
