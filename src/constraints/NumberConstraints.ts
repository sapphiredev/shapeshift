import { ConstraintError } from '../lib/errors/ConstraintError';
import { Result } from '../lib/Result';
import type { IConstraint } from './base/IConstraint';
import { Comparator, eq, ge, gt, le, lt, ne } from './util/operators';

function numberComparator(comparator: Comparator, name: string, expected: string, number: number): IConstraint<number> {
	return {
		run(input: number) {
			return comparator(input, number) //
				? Result.ok(input)
				: Result.err(new ConstraintError(name, 'Invalid number value', input, expected));
		}
	};
}

export function numberLt(value: number): IConstraint<number> {
	const expected = `expected < ${value}`;
	return numberComparator(lt, 's.number.lt', expected, value);
}

export function numberLe(value: number): IConstraint<number> {
	const expected = `expected <= ${value}`;
	return numberComparator(le, 's.number.le', expected, value);
}

export function numberGt(value: number): IConstraint<number> {
	const expected = `expected > ${value}`;
	return numberComparator(gt, 's.number.gt', expected, value);
}

export function numberGe(value: number): IConstraint<number> {
	const expected = `expected >= ${value}`;
	return numberComparator(ge, 's.number.ge', expected, value);
}

export function numberEq(value: number): IConstraint<number> {
	const expected = `expected === ${value}`;
	return numberComparator(eq, 's.number.eq', expected, value);
}

export function numberNe(value: number): IConstraint<number> {
	const expected = `expected !== ${value}`;
	return numberComparator(ne, 's.number.ne', expected, value);
}

export const numberInt: IConstraint<number> = {
	run(input: number) {
		return Number.isInteger(input) //
			? Result.ok(input)
			: Result.err(new ConstraintError('s.number.int', 'Given value is not an integer', input, 'Number.isInteger(expected)'));
	}
};

export const numberSafeInt: IConstraint<number> = {
	run(input: number) {
		return Number.isSafeInteger(input) //
			? Result.ok(input)
			: Result.err(new ConstraintError('s.number.safeInt', 'Given value is not a safe integer', input, 'Number.isSafeInteger(expected)'));
	}
};

export const numberFinite: IConstraint<number> = {
	run(input: number) {
		return Number.isFinite(input) //
			? Result.ok(input)
			: Result.err(new ConstraintError('s.number.finite', 'Given value is not finite', input, 'Number.isFinite(expected)'));
	}
};

export const numberNaN: IConstraint<number> = {
	run(input: number) {
		return Number.isNaN(input) //
			? Result.ok(input)
			: Result.err(new ConstraintError('s.number.eq(NaN)', 'Invalid number value', input, 'expected === NaN'));
	}
};

export const numberNeNaN: IConstraint<number> = {
	run(input: number) {
		return Number.isNaN(input) //
			? Result.err(new ConstraintError('s.number.ne(NaN)', 'Invalid number value', input, 'expected !== NaN'))
			: Result.ok(input);
	}
};

export function numberDivisibleBy(divider: number): IConstraint<number> {
	const expected = `expected % ${divider} === 0`;
	return {
		run(input: number) {
			return input % divider === 0 //
				? Result.ok(input)
				: Result.err(new ConstraintError('s.number.divisibleBy', 'Number is not divisible', input, expected));
		}
	};
}
