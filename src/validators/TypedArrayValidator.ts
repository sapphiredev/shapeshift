import type { IConstraint } from '../constraints/base/IConstraint';
import {
	typedArrayByteLengthEqual,
	typedArrayByteLengthGreaterThan,
	typedArrayByteLengthGreaterThanOrEqual,
	typedArrayByteLengthLessThan,
	typedArrayByteLengthLessThanOrEqual,
	typedArrayByteLengthNotEqual,
	typedArrayByteLengthRange,
	typedArrayByteLengthRangeExclusive,
	typedArrayByteLengthRangeInclusive,
	typedArrayLengthEqual,
	typedArrayLengthGreaterThan,
	typedArrayLengthGreaterThanOrEqual,
	typedArrayLengthLessThan,
	typedArrayLengthLessThanOrEqual,
	typedArrayLengthNotEqual,
	typedArrayLengthRange,
	typedArrayLengthRangeExclusive,
	typedArrayLengthRangeInclusive
} from '../constraints/TypedArrayLengthConstraints';
import { aOrAn } from '../constraints/util/common/vowels';
import { TypedArrays, type TypedArray, type TypedArrayName } from '../constraints/util/typedArray';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './imports';

export class TypedArrayValidator<T extends TypedArray> extends BaseValidator<T> {
	private readonly type: TypedArrayName;

	public constructor(type: TypedArrayName, constraints: readonly IConstraint<T>[] = []) {
		super(constraints);
		this.type = type;
	}

	public byteLengthLessThan(length: number) {
		return this.addConstraint(typedArrayByteLengthLessThan(length));
	}

	public byteLengthLessThanOrEqual(length: number) {
		return this.addConstraint(typedArrayByteLengthLessThanOrEqual(length));
	}

	public byteLengthGreaterThan(length: number) {
		return this.addConstraint(typedArrayByteLengthGreaterThan(length));
	}

	public byteLengthGreaterThanOrEqual(length: number) {
		return this.addConstraint(typedArrayByteLengthGreaterThanOrEqual(length));
	}

	public byteLengthEqual(length: number) {
		return this.addConstraint(typedArrayByteLengthEqual(length));
	}

	public byteLengthNotEqual(length: number) {
		return this.addConstraint(typedArrayByteLengthNotEqual(length));
	}

	public byteLengthRange(start: number, endBefore: number) {
		return this.addConstraint(typedArrayByteLengthRange(start, endBefore));
	}

	public byteLengthRangeInclusive(startAt: number, endAt: number) {
		return this.addConstraint(typedArrayByteLengthRangeInclusive(startAt, endAt) as IConstraint<T>);
	}

	public byteLengthRangeExclusive(startAfter: number, endBefore: number) {
		return this.addConstraint(typedArrayByteLengthRangeExclusive(startAfter, endBefore));
	}

	public lengthLessThan(length: number) {
		return this.addConstraint(typedArrayLengthLessThan(length));
	}

	public lengthLessThanOrEqual(length: number) {
		return this.addConstraint(typedArrayLengthLessThanOrEqual(length));
	}

	public lengthGreaterThan(length: number) {
		return this.addConstraint(typedArrayLengthGreaterThan(length));
	}

	public lengthGreaterThanOrEqual(length: number) {
		return this.addConstraint(typedArrayLengthGreaterThanOrEqual(length));
	}

	public lengthEqual(length: number) {
		return this.addConstraint(typedArrayLengthEqual(length));
	}

	public lengthNotEqual(length: number) {
		return this.addConstraint(typedArrayLengthNotEqual(length));
	}

	public lengthRange(start: number, endBefore: number) {
		return this.addConstraint(typedArrayLengthRange(start, endBefore));
	}

	public lengthRangeInclusive(startAt: number, endAt: number) {
		return this.addConstraint(typedArrayLengthRangeInclusive(startAt, endAt));
	}

	public lengthRangeExclusive(startAfter: number, endBefore: number) {
		return this.addConstraint(typedArrayLengthRangeExclusive(startAfter, endBefore));
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.type, this.constraints]);
	}

	protected handle(value: unknown): Result<T, ValidationError> {
		return TypedArrays[this.type](value)
			? Result.ok(value as T)
			: Result.err(new ValidationError('s.typedArray', `Expected ${aOrAn(this.type)}`, value));
	}
}
