import { ExpectedConstraintError } from '../lib/errors/ExpectedConstraintError';
import { Result } from '../lib/Result';
import type { IConstraint } from './base/IConstraint';
import { Comparator, equal, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual, notEqual } from './util/operators';

export type BigIntConstraintName = `s.bigint.${
	| 'lessThan'
	| 'lessThanOrEqual'
	| 'greaterThan'
	| 'greaterThanOrEqual'
	| 'equal'
	| 'notEqual'
	| 'divisibleBy'}`;

function bigintComparator(comparator: Comparator, name: BigIntConstraintName, expected: string, number: bigint): IConstraint<bigint> {
	return {
		run(input: bigint) {
			return comparator(input, number) //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError(name, 'Invalid bigint value', input, expected));
		}
	};
}

export function bigintLessThan(value: bigint): IConstraint<bigint> {
	const expected = `expected < ${value}n`;
	return bigintComparator(lessThan, 's.bigint.lessThan', expected, value);
}

export function bigintLessThanOrEqual(value: bigint): IConstraint<bigint> {
	const expected = `expected <= ${value}n`;
	return bigintComparator(lessThanOrEqual, 's.bigint.lessThanOrEqual', expected, value);
}

export function bigintGreaterThan(value: bigint): IConstraint<bigint> {
	const expected = `expected > ${value}n`;
	return bigintComparator(greaterThan, 's.bigint.greaterThan', expected, value);
}

export function bigintGreaterThanOrEqual(value: bigint): IConstraint<bigint> {
	const expected = `expected >= ${value}n`;
	return bigintComparator(greaterThanOrEqual, 's.bigint.greaterThanOrEqual', expected, value);
}

export function bigintEqual(value: bigint): IConstraint<bigint> {
	const expected = `expected === ${value}n`;
	return bigintComparator(equal, 's.bigint.equal', expected, value);
}

export function bigintNotEqual(value: bigint): IConstraint<bigint> {
	const expected = `expected !== ${value}n`;
	return bigintComparator(notEqual, 's.bigint.notEqual', expected, value);
}

export function bigintDivisibleBy(divider: bigint): IConstraint<bigint> {
	const expected = `expected % ${divider}n === 0n`;
	return {
		run(input: bigint) {
			return input % divider === 0n //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError('s.bigint.divisibleBy', 'BigInt is not divisible', input, expected));
		}
	};
}
