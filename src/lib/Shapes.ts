import type { TypedArray, TypedArrayName } from '../constraints/util/typedArray';
import type { Unwrap, UnwrapTuple, ValidatorOptions } from '../lib/util-types';
import {
	ArrayValidator,
	BaseValidator,
	BigIntValidator,
	BooleanValidator,
	DateValidator,
	InstanceValidator,
	LiteralValidator,
	MapValidator,
	NeverValidator,
	NullishValidator,
	NumberValidator,
	ObjectValidator,
	ObjectValidatorStrategy,
	PassthroughValidator,
	RecordValidator,
	SetValidator,
	StringValidator,
	TupleValidator,
	UnionValidator
} from '../validators/imports';
import { LazyValidator } from '../validators/LazyValidator';
import { NativeEnumValidator, type NativeEnumLike } from '../validators/NativeEnumValidator';
import { TypedArrayValidator } from '../validators/TypedArrayValidator';
import type { Constructor, MappedObjectValidator } from './util-types';

export class Shapes {
	public string(options?: ValidatorOptions) {
		return new StringValidator(options);
	}

	public number(options?: ValidatorOptions) {
		return new NumberValidator(options);
	}

	public bigint(options?: ValidatorOptions) {
		return new BigIntValidator(options);
	}

	public boolean(options?: ValidatorOptions) {
		return new BooleanValidator(options);
	}

	public date(options?: ValidatorOptions) {
		return new DateValidator(options);
	}

	public object<T extends object>(shape: MappedObjectValidator<T>, options?: ValidatorOptions) {
		return new ObjectValidator<T>(shape, ObjectValidatorStrategy.Ignore, options);
	}

	public undefined(options?: ValidatorOptions) {
		return this.literal(undefined, { equalsOptions: options });
	}

	public null(options?: ValidatorOptions) {
		return this.literal(null, { equalsOptions: options });
	}

	public nullish(options?: ValidatorOptions) {
		return new NullishValidator(options);
	}

	public any(options?: ValidatorOptions) {
		return new PassthroughValidator<any>(options);
	}

	public unknown(options?: ValidatorOptions) {
		return new PassthroughValidator<unknown>(options);
	}

	public never(options?: ValidatorOptions) {
		return new NeverValidator(options);
	}

	public enum<T>(values: readonly T[], options?: ValidatorOptions) {
		return this.union(
			values.map((value) => this.literal(value, { equalsOptions: options })),
			options
		);
	}

	public nativeEnum<T extends NativeEnumLike>(enumShape: T, options?: ValidatorOptions): NativeEnumValidator<T> {
		return new NativeEnumValidator(enumShape, options);
	}

	public literal<T>(value: T, options?: { dateOptions?: ValidatorOptions; equalsOptions?: ValidatorOptions }): BaseValidator<T> {
		if (value instanceof Date) {
			return this.date(options?.dateOptions).equal(value, options?.equalsOptions) as unknown as BaseValidator<T>;
		}

		return new LiteralValidator(value, options?.equalsOptions);
	}

	public instance<T>(expected: Constructor<T>, options?: ValidatorOptions): InstanceValidator<T> {
		return new InstanceValidator(expected, options);
	}

	public union<T extends BaseValidator<any>[]>(validators: T, options?: ValidatorOptions): UnionValidator<Unwrap<T[number]>> {
		return new UnionValidator(validators, options);
	}

	public array<T>(validator: BaseValidator<T[][number]>, options?: ValidatorOptions): ArrayValidator<T[], T[][number]>;
	public array<T extends unknown[]>(validator: BaseValidator<T[number]>, options?: ValidatorOptions): ArrayValidator<T, T[number]>;
	public array<T extends unknown[]>(validator: BaseValidator<T[number]>, options?: ValidatorOptions) {
		return new ArrayValidator(validator, options);
	}

	public typedArray<T extends TypedArray>(type: TypedArrayName = 'TypedArray', options?: ValidatorOptions) {
		return new TypedArrayValidator<T>(type, options);
	}

	public int8Array(options?: ValidatorOptions) {
		return this.typedArray<Int8Array>('Int8Array', options);
	}

	public uint8Array(options?: ValidatorOptions) {
		return this.typedArray<Uint8Array>('Uint8Array', options);
	}

	public uint8ClampedArray(options?: ValidatorOptions) {
		return this.typedArray<Uint8ClampedArray>('Uint8ClampedArray', options);
	}

	public int16Array(options?: ValidatorOptions) {
		return this.typedArray<Int16Array>('Int16Array', options);
	}

	public uint16Array(options?: ValidatorOptions) {
		return this.typedArray<Uint16Array>('Uint16Array', options);
	}

	public int32Array(options?: ValidatorOptions) {
		return this.typedArray<Int32Array>('Int32Array', options);
	}

	public uint32Array(options?: ValidatorOptions) {
		return this.typedArray<Uint32Array>('Uint32Array', options);
	}

	public float32Array(options?: ValidatorOptions) {
		return this.typedArray<Float32Array>('Float32Array', options);
	}

	public float64Array(options?: ValidatorOptions) {
		return this.typedArray<Float64Array>('Float64Array', options);
	}

	public bigInt64Array(options?: ValidatorOptions) {
		return this.typedArray<BigInt64Array>('BigInt64Array', options);
	}

	public bigUint64Array(options?: ValidatorOptions) {
		return this.typedArray<BigUint64Array>('BigUint64Array', options);
	}

	public tuple<T extends [...BaseValidator<any>[]]>(validators: [...T], options?: ValidatorOptions): TupleValidator<UnwrapTuple<T>> {
		return new TupleValidator(validators, options);
	}

	public set<T>(validator: BaseValidator<T>, options?: ValidatorOptions) {
		return new SetValidator(validator, options);
	}

	public record<T>(validator: BaseValidator<T>, options?: ValidatorOptions) {
		return new RecordValidator(validator, options);
	}

	public map<T, U>(keyValidator: BaseValidator<T>, valueValidator: BaseValidator<U>, options?: ValidatorOptions) {
		return new MapValidator(keyValidator, valueValidator, options);
	}

	public lazy<T extends BaseValidator<unknown>>(validator: (value: unknown) => T, options?: ValidatorOptions) {
		return new LazyValidator(validator, options);
	}
}
