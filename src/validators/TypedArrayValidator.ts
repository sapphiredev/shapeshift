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
import type { ValidatorOptions } from '../lib/util-types';
import { BaseValidator } from './imports';

export class TypedArrayValidator<T extends TypedArray> extends BaseValidator<T> {
	private readonly type: TypedArrayName;

	public constructor(type: TypedArrayName, validatorOptions: ValidatorOptions = {}, constraints: readonly IConstraint<T>[] = []) {
		super(validatorOptions, constraints);
		this.type = type;
	}

	public byteLengthLessThan(length: number, options: ValidatorOptions = this.validatorOptions) {
		return this.addConstraint(typedArrayByteLengthLessThan(length, options));
	}

	public byteLengthLessThanOrEqual(length: number, options: ValidatorOptions = this.validatorOptions) {
		return this.addConstraint(typedArrayByteLengthLessThanOrEqual(length, options));
	}

	public byteLengthGreaterThan(length: number, options: ValidatorOptions = this.validatorOptions) {
		return this.addConstraint(typedArrayByteLengthGreaterThan(length, options));
	}

	public byteLengthGreaterThanOrEqual(length: number, options: ValidatorOptions = this.validatorOptions) {
		return this.addConstraint(typedArrayByteLengthGreaterThanOrEqual(length, options));
	}

	public byteLengthEqual(length: number, options: ValidatorOptions = this.validatorOptions) {
		return this.addConstraint(typedArrayByteLengthEqual(length, options));
	}

	public byteLengthNotEqual(length: number, options: ValidatorOptions = this.validatorOptions) {
		return this.addConstraint(typedArrayByteLengthNotEqual(length, options));
	}

	public byteLengthRange(start: number, endBefore: number, options: ValidatorOptions = this.validatorOptions) {
		return this.addConstraint(typedArrayByteLengthRange(start, endBefore, options));
	}

	public byteLengthRangeInclusive(startAt: number, endAt: number, options: ValidatorOptions = this.validatorOptions) {
		return this.addConstraint(typedArrayByteLengthRangeInclusive(startAt, endAt, options) as IConstraint<T>);
	}

	public byteLengthRangeExclusive(startAfter: number, endBefore: number, options: ValidatorOptions = this.validatorOptions) {
		return this.addConstraint(typedArrayByteLengthRangeExclusive(startAfter, endBefore, options));
	}

	public lengthLessThan(length: number, options: ValidatorOptions = this.validatorOptions) {
		return this.addConstraint(typedArrayLengthLessThan(length, options));
	}

	public lengthLessThanOrEqual(length: number, options: ValidatorOptions = this.validatorOptions) {
		return this.addConstraint(typedArrayLengthLessThanOrEqual(length, options));
	}

	public lengthGreaterThan(length: number, options: ValidatorOptions = this.validatorOptions) {
		return this.addConstraint(typedArrayLengthGreaterThan(length, options));
	}

	public lengthGreaterThanOrEqual(length: number, options: ValidatorOptions = this.validatorOptions) {
		return this.addConstraint(typedArrayLengthGreaterThanOrEqual(length, options));
	}

	public lengthEqual(length: number, options: ValidatorOptions = this.validatorOptions) {
		return this.addConstraint(typedArrayLengthEqual(length, options));
	}

	public lengthNotEqual(length: number, options: ValidatorOptions = this.validatorOptions) {
		return this.addConstraint(typedArrayLengthNotEqual(length, options));
	}

	public lengthRange(start: number, endBefore: number, options: ValidatorOptions = this.validatorOptions) {
		return this.addConstraint(typedArrayLengthRange(start, endBefore, options));
	}

	public lengthRangeInclusive(startAt: number, endAt: number, options: ValidatorOptions = this.validatorOptions) {
		return this.addConstraint(typedArrayLengthRangeInclusive(startAt, endAt, options));
	}

	public lengthRangeExclusive(startAfter: number, endBefore: number, options: ValidatorOptions = this.validatorOptions) {
		return this.addConstraint(typedArrayLengthRangeExclusive(startAfter, endBefore, options));
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.type, this.validatorOptions, this.constraints]);
	}

	protected handle(value: unknown): Result<T, ValidationError> {
		return TypedArrays[this.type](value)
			? Result.ok(value as T)
			: Result.err(new ValidationError('s.typedArray()', this.validatorOptions.message ?? `Expected ${aOrAn(this.type)}`, value));
	}
}
