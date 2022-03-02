import { arrayLengthEq, arrayLengthGe, arrayLengthGt, arrayLengthLe, arrayLengthLt, arrayLengthNe } from '../constraints/ArrayLengthConstraints';
import type { IConstraint } from '../constraints/base/IConstraint';
import type { BaseError } from '../lib/errors/BaseError';
import { CombinedPropertyError } from '../lib/errors/CombinedPropertyError';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './imports';

export class ArrayValidator<T> extends BaseValidator<T[]> {
	private readonly validator: BaseValidator<T>;

	public constructor(validator: BaseValidator<T>, constraints: readonly IConstraint<T[]>[] = []) {
		super(constraints);
		this.validator = validator;
	}

	public lengthLt<N extends number>(length: N): BaseValidator<ExpandSmallerTuples<UnshiftTuple<[...Tuple<T, N>]>>> {
		return this.addConstraint(arrayLengthLt(length) as IConstraint<T[]>) as any;
	}

	public lengthLe<N extends number>(length: N): BaseValidator<ExpandSmallerTuples<[...Tuple<T, N>]>> {
		return this.addConstraint(arrayLengthLe(length) as IConstraint<T[]>) as any;
	}

	public lengthGt<N extends number>(length: N): BaseValidator<[...Tuple<T, N>, T, ...T[]]> {
		return this.addConstraint(arrayLengthGt(length) as IConstraint<T[]>) as any;
	}

	public lengthGe<N extends number>(length: N): BaseValidator<[...Tuple<T, N>, ...T[]]> {
		return this.addConstraint(arrayLengthGe(length) as IConstraint<T[]>) as any;
	}

	public lengthEq<N extends number>(length: N): BaseValidator<[...Tuple<T, N>]> {
		return this.addConstraint(arrayLengthEq(length) as IConstraint<T[]>) as any;
	}

	public lengthNe(length: number): BaseValidator<[...T[]]> {
		return this.addConstraint(arrayLengthNe(length) as IConstraint<T[]>);
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.validator, this.constraints]);
	}

	protected handle(values: unknown): Result<T[], ValidationError | CombinedPropertyError> {
		if (!Array.isArray(values)) {
			return Result.err(new ValidationError('s.array(T)', 'Expected an array', values));
		}

		const errors: [number, BaseError][] = [];
		const transformed: T[] = [];

		for (let i = 0; i < values.length; i++) {
			const result = this.validator.run(values[i]);
			if (result.isOk()) transformed.push(result.value);
			else errors.push([i, result.error!]);
		}

		return errors.length === 0 //
			? Result.ok(transformed)
			: Result.err(new CombinedPropertyError(errors));
	}
}

type UnshiftTuple<T extends [...any[]]> = T extends [T[0], ...infer Tail] ? Tail : never;
type ExpandSmallerTuples<T extends [...any[]]> = T extends [T[0], ...infer Tail] ? T | ExpandSmallerTuples<Tail> : [];

// https://github.com/microsoft/TypeScript/issues/26223#issuecomment-755067958
type Shift<A extends Array<any>> = ((...args: A) => void) extends (...args: [A[0], ...infer R]) => void ? R : never;

type GrowExpRev<A extends Array<any>, N extends number, P extends Array<Array<any>>> = A['length'] extends N
	? A
	: GrowExpRev<[...A, ...P[0]][N] extends undefined ? [...A, ...P[0]] : A, N, Shift<P>>;

type GrowExp<A extends Array<any>, N extends number, P extends Array<Array<any>>> = [...A, ...A][N] extends undefined
	? GrowExp<[...A, ...A], N, [A, ...P]>
	: GrowExpRev<A, N, P>;

type Tuple<T, N extends number> = number extends N ? Array<T> : N extends 0 ? [] : N extends 1 ? [T] : GrowExp<[T], N, [[]]>;
