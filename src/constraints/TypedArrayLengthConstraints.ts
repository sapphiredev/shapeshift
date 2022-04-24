import { ExpectedConstraintError } from '../lib/errors/ExpectedConstraintError';
import { Result } from '../lib/Result';
import type { IConstraint } from './base/IConstraint';
import { Comparator, eq, ge, gt, le, lt, ne } from './util/operators';

export type TypedArrayConstraintName = `s.typedArray(T).${'byteLength' | 'length'}${
	| 'Lt'
	| 'Le'
	| 'Gt'
	| 'Ge'
	| 'Eq'
	| 'Ne'
	| 'Range'
	| 'RangeInclusive'
	| 'RangeExclusive'}`;

function typedArrayByteLengthComparator<T extends NodeJS.TypedArray>(
	comparator: Comparator,
	name: TypedArrayConstraintName,
	expected: string,
	length: number
): IConstraint<T> {
	return {
		run(input: T) {
			return comparator(input.byteLength, length) //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError(name, 'Invalid Typed Array byte length', input, expected));
		}
	};
}

export function typedArrayByteLengthLt<T extends NodeJS.TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.byteLength < ${value}`;
	return typedArrayByteLengthComparator(lt, 's.typedArray(T).byteLengthLt', expected, value);
}

export function typedArrayByteLengthLe<T extends NodeJS.TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.byteLength <= ${value}`;
	return typedArrayByteLengthComparator(le, 's.typedArray(T).byteLengthLe', expected, value);
}

export function typedArrayByteLengthGt<T extends NodeJS.TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.byteLength > ${value}`;
	return typedArrayByteLengthComparator(gt, 's.typedArray(T).byteLengthGt', expected, value);
}

export function typedArrayByteLengthGe<T extends NodeJS.TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.byteLength >= ${value}`;
	return typedArrayByteLengthComparator(ge, 's.typedArray(T).byteLengthGe', expected, value);
}

export function typedArrayByteLengthEq<T extends NodeJS.TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.byteLength === ${value}`;
	return typedArrayByteLengthComparator(eq, 's.typedArray(T).byteLengthEq', expected, value);
}

export function typedArrayByteLengthNe<T extends NodeJS.TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.byteLength !== ${value}`;
	return typedArrayByteLengthComparator(ne, 's.typedArray(T).byteLengthNe', expected, value);
}

export function typedArrayByteLengthRange<T extends NodeJS.TypedArray>(start: number, endBefore: number): IConstraint<T> {
	const expected = `expected.byteLength >= ${start} && expected.byteLength < ${endBefore}`;
	return {
		run(input: T) {
			return input.byteLength >= start && input.byteLength < endBefore //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError('s.typedArray(T).byteLengthRange', 'Invalid Typed Array byte length', input, expected));
		}
	};
}

export function typedArrayByteLengthRangeInclusive<T extends NodeJS.TypedArray>(start: number, end: number) {
	const expected = `expected.byteLength >= ${start} && expected.byteLength <= ${end}`;
	return {
		run(input: T) {
			return input.byteLength >= start && input.byteLength <= end //
				? Result.ok(input)
				: Result.err(
						new ExpectedConstraintError('s.typedArray(T).byteLengthRangeInclusive', 'Invalid Typed Array byte length', input, expected)
				  );
		}
	};
}

export function typedArrayByteLengthRangeExclusive<T extends NodeJS.TypedArray>(startAfter: number, endBefore: number): IConstraint<T> {
	const expected = `expected.byteLength > ${startAfter} && expected.byteLength < ${endBefore}`;
	return {
		run(input: T) {
			return input.byteLength > startAfter && input.byteLength < endBefore //
				? Result.ok(input)
				: Result.err(
						new ExpectedConstraintError('s.typedArray(T).byteLengthRangeExclusive', 'Invalid Typed Array byte length', input, expected)
				  );
		}
	};
}

function typedArrayLengthComparator<T extends NodeJS.TypedArray>(
	comparator: Comparator,
	name: TypedArrayConstraintName,
	expected: string,
	length: number
): IConstraint<T> {
	return {
		run(input: T) {
			return comparator(input.length, length) //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError(name, 'Invalid Typed Array length', input, expected));
		}
	};
}

export function typedArrayLengthLt<T extends NodeJS.TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.length < ${value}`;
	return typedArrayLengthComparator(lt, 's.typedArray(T).lengthLt', expected, value);
}

export function typedArrayLengthLe<T extends NodeJS.TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.length <= ${value}`;
	return typedArrayLengthComparator(le, 's.typedArray(T).lengthLe', expected, value);
}

export function typedArrayLengthGt<T extends NodeJS.TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.length > ${value}`;
	return typedArrayLengthComparator(gt, 's.typedArray(T).lengthGt', expected, value);
}

export function typedArrayLengthGe<T extends NodeJS.TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.length >= ${value}`;
	return typedArrayLengthComparator(ge, 's.typedArray(T).lengthGe', expected, value);
}

export function typedArrayLengthEq<T extends NodeJS.TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.length === ${value}`;
	return typedArrayLengthComparator(eq, 's.typedArray(T).lengthEq', expected, value);
}

export function typedArrayLengthNe<T extends NodeJS.TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.length !== ${value}`;
	return typedArrayLengthComparator(ne, 's.typedArray(T).lengthNe', expected, value);
}

export function typedArrayLengthRange<T extends NodeJS.TypedArray>(start: number, endBefore: number): IConstraint<T> {
	const expected = `expected.length >= ${start} && expected.length < ${endBefore}`;
	return {
		run(input: T) {
			return input.length >= start && input.length < endBefore //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError('s.typedArray(T).lengthRange', 'Invalid Typed Array length', input, expected));
		}
	};
}

export function typedArrayLengthRangeInclusive<T extends NodeJS.TypedArray>(start: number, end: number): IConstraint<T> {
	const expected = `expected.length >= ${start} && expected.length <= ${end}`;
	return {
		run(input: T) {
			return input.length >= start && input.length <= end //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError('s.typedArray(T).lengthRangeInclusive', 'Invalid Typed Array length', input, expected));
		}
	};
}

export function typedArrayLengthRangeExclusive<T extends NodeJS.TypedArray>(startAfter: number, endBefore: number): IConstraint<T> {
	const expected = `expected.length > ${startAfter} && expected.length < ${endBefore}`;
	return {
		run(input: T) {
			return input.length > startAfter && input.length < endBefore //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError('s.typedArray(T).lengthRangeExclusive', 'Invalid Typed Array length', input, expected));
		}
	};
}
