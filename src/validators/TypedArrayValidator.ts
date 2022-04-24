import {
	typedArrayByteLengthEq,
	typedArrayByteLengthGe,
	typedArrayByteLengthGt,
	typedArrayByteLengthLe,
	typedArrayByteLengthLt,
	typedArrayByteLengthNe,
	typedArrayByteLengthRange,
	typedArrayByteLengthRangeExclusive,
	typedArrayByteLengthRangeInclusive,
	typedArrayLengthEq,
	typedArrayLengthGe,
	typedArrayLengthGt,
	typedArrayLengthLe,
	typedArrayLengthLt,
	typedArrayLengthNe,
	typedArrayLengthRange,
	typedArrayLengthRangeExclusive,
	typedArrayLengthRangeInclusive
} from '../constraints/TypedArrayLengthConstraints';
import type { IConstraint } from '../constraints/base/IConstraint';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './imports';
import { TypedArray, TypedArrayName, TypedArrays } from '../constraints/util/typedArray';

export class TypedArrayValidator<T extends TypedArray> extends BaseValidator<T> {
	private readonly type: TypedArrayName;

	public constructor(type: TypedArrayName, constraints: readonly IConstraint<T>[] = []) {
		super(constraints);
		this.type = type;
	}

	public byteLengthLt(length: number) {
		return this.addConstraint(typedArrayByteLengthLt(length));
	}

	public byteLengthLe(length: number) {
		return this.addConstraint(typedArrayByteLengthLe(length));
	}

	public byteLengthGt(length: number) {
		return this.addConstraint(typedArrayByteLengthGt(length));
	}

	public byteLengthGe(length: number) {
		return this.addConstraint(typedArrayByteLengthGe(length));
	}

	public byteLengthEq(length: number) {
		return this.addConstraint(typedArrayByteLengthEq(length));
	}

	public byteLengthNe(length: number) {
		return this.addConstraint(typedArrayByteLengthNe(length));
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

	public lengthLt(length: number) {
		return this.addConstraint(typedArrayLengthLt(length));
	}

	public lengthLe(length: number) {
		return this.addConstraint(typedArrayLengthLe(length));
	}

	public lengthGt(length: number) {
		return this.addConstraint(typedArrayLengthGt(length));
	}

	public lengthGe(length: number) {
		return this.addConstraint(typedArrayLengthGe(length));
	}

	public lengthEq(length: number) {
		return this.addConstraint(typedArrayLengthEq(length));
	}

	public lengthNe(length: number) {
		return this.addConstraint(typedArrayLengthNe(length));
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
			: Result.err(
					new ValidationError('s.typedArray', `Expected a ${this.type === 'TypedArray' ? 'TypedArray' : `${this.type} array`}`, value)
			  );
	}
}
