import {
	arrayLengthEqual,
	arrayLengthGreaterThan,
	arrayLengthGreaterThanOrEqual,
	arrayLengthLessThan,
	arrayLengthLessThanOrEqual,
	arrayLengthNotEqual,
	arrayLengthRange,
	arrayLengthRangeExclusive,
	arrayLengthRangeInclusive,
	uniqueArray
} from '../constraints/ArrayConstraints';
import type { IConstraint } from '../constraints/base/IConstraint';
import type { BaseError } from '../lib/errors/BaseError';
import { CombinedPropertyError } from '../lib/errors/CombinedPropertyError';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import type { ExpandSmallerTuples, Tuple, UnshiftTuple, ValidatorOptions } from '../lib/util-types';
import { BaseValidator } from './imports';

export class ArrayValidator<T extends unknown[], I = T[number]> extends BaseValidator<T> {
	private readonly validator: BaseValidator<I>;

	public constructor(validator: BaseValidator<I>, validatorOptions: ValidatorOptions = {}, constraints: readonly IConstraint<T>[] = []) {
		super(validatorOptions, constraints);
		this.validator = validator;
	}

	public lengthLessThan<N extends number>(
		length: N,
		options: ValidatorOptions = this.validatorOptions
	): ArrayValidator<ExpandSmallerTuples<UnshiftTuple<[...Tuple<I, N>]>>> {
		return this.addConstraint(arrayLengthLessThan(length, options) as IConstraint<T>) as any;
	}

	public lengthLessThanOrEqual<N extends number>(
		length: N,
		options: ValidatorOptions = this.validatorOptions
	): ArrayValidator<ExpandSmallerTuples<[...Tuple<I, N>]>> {
		return this.addConstraint(arrayLengthLessThanOrEqual(length, options) as IConstraint<T>) as any;
	}

	public lengthGreaterThan<N extends number>(
		length: N,
		options: ValidatorOptions = this.validatorOptions
	): ArrayValidator<[...Tuple<I, N>, I, ...T]> {
		return this.addConstraint(arrayLengthGreaterThan(length, options) as IConstraint<T>) as any;
	}

	public lengthGreaterThanOrEqual<N extends number>(
		length: N,
		options: ValidatorOptions = this.validatorOptions
	): ArrayValidator<[...Tuple<I, N>, ...T]> {
		return this.addConstraint(arrayLengthGreaterThanOrEqual(length, options) as IConstraint<T>) as any;
	}

	public lengthEqual<N extends number>(length: N, options: ValidatorOptions = this.validatorOptions): ArrayValidator<[...Tuple<I, N>]> {
		return this.addConstraint(arrayLengthEqual(length, options) as IConstraint<T>) as any;
	}

	public lengthNotEqual<N extends number>(length: N, options: ValidatorOptions = this.validatorOptions): ArrayValidator<[...Tuple<I, N>]> {
		return this.addConstraint(arrayLengthNotEqual(length, options) as IConstraint<T>) as any;
	}

	public lengthRange<S extends number, E extends number>(
		start: S,
		endBefore: E,
		options: ValidatorOptions = this.validatorOptions
	): ArrayValidator<Exclude<ExpandSmallerTuples<UnshiftTuple<[...Tuple<I, E>]>>, ExpandSmallerTuples<UnshiftTuple<[...Tuple<I, S>]>>>> {
		return this.addConstraint(arrayLengthRange(start, endBefore, options) as IConstraint<T>) as any;
	}

	public lengthRangeInclusive<S extends number, E extends number>(
		startAt: S,
		endAt: E,
		options: ValidatorOptions = this.validatorOptions
	): ArrayValidator<Exclude<ExpandSmallerTuples<[...Tuple<I, E>]>, ExpandSmallerTuples<UnshiftTuple<[...Tuple<I, S>]>>>> {
		return this.addConstraint(arrayLengthRangeInclusive(startAt, endAt, options) as IConstraint<T>) as any;
	}

	public lengthRangeExclusive<S extends number, E extends number>(
		startAfter: S,
		endBefore: E,
		options: ValidatorOptions = this.validatorOptions
	): ArrayValidator<Exclude<ExpandSmallerTuples<UnshiftTuple<[...Tuple<I, E>]>>, ExpandSmallerTuples<[...Tuple<T, S>]>>> {
		return this.addConstraint(arrayLengthRangeExclusive(startAfter, endBefore, options) as IConstraint<T>) as any;
	}

	public unique(options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(uniqueArray(options) as IConstraint<T>);
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.validator, this.validatorOptions, this.constraints]);
	}

	protected handle(values: unknown): Result<T, ValidationError | CombinedPropertyError> {
		if (!Array.isArray(values)) {
			return Result.err(new ValidationError('s.array(T)', this.validatorOptions.message ?? 'Expected an array', values));
		}

		if (!this.shouldRunConstraints) {
			return Result.ok(values as T);
		}

		const errors: [number, BaseError][] = [];
		const transformed: T = [] as unknown as T;

		for (let i = 0; i < values.length; i++) {
			const result = this.validator.run(values[i]);
			if (result.isOk()) transformed.push(result.value);
			else errors.push([i, result.error!]);
		}

		return errors.length === 0 //
			? Result.ok(transformed)
			: Result.err(new CombinedPropertyError(errors, this.validatorOptions));
	}
}
