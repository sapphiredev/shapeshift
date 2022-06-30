import type { TypedArray, TypedArrayName } from '../constraints/util/typedArray';
import type { Unwrap, UnwrapTuple } from '../lib/util-types';
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
	PassthroughValidator,
	RecordValidator,
	SetValidator,
	StringValidator,
	TupleValidator,
	UnionValidator
} from '../validators/imports';
import { NativeEnumLike, NativeEnumValidator } from '../validators/NativeEnumValidator';
import { TypedArrayValidator } from '../validators/TypedArrayValidator';
import type { Constructor, MappedObjectValidator } from './util-types';

export class Shapes {
	public get string() {
		return new StringValidator();
	}

	public get number() {
		return new NumberValidator();
	}

	public get bigint() {
		return new BigIntValidator();
	}

	public get boolean() {
		return new BooleanValidator();
	}

	public get date() {
		return new DateValidator();
	}

	public object<T>(shape: MappedObjectValidator<T>) {
		return new ObjectValidator(shape);
	}

	public get undefined() {
		return this.literal(undefined);
	}

	public get null() {
		return this.literal(null);
	}

	public get nullish() {
		return new NullishValidator();
	}

	public get any() {
		return new PassthroughValidator<any>();
	}

	public get unknown() {
		return new PassthroughValidator<unknown>();
	}

	public get never() {
		return new NeverValidator();
	}

	public enum<T>(...values: readonly T[]) {
		return this.union(...values.map((value) => this.literal(value)));
	}

	public nativeEnum<T extends NativeEnumLike>(enumShape: T): NativeEnumValidator<T> {
		return new NativeEnumValidator(enumShape);
	}

	public literal<T>(value: T): BaseValidator<T> {
		if (value instanceof Date) return this.date.equal(value) as unknown as BaseValidator<T>;
		return new LiteralValidator(value);
	}

	public instance<T>(expected: Constructor<T>): InstanceValidator<T> {
		return new InstanceValidator(expected);
	}

	public union<T extends [...BaseValidator<any>[]]>(...validators: [...T]): UnionValidator<Unwrap<T[number]>> {
		return new UnionValidator(validators);
	}

	public array<T>(validator: BaseValidator<T>) {
		return new ArrayValidator(validator);
	}

	public typedArray<T extends TypedArray>(type: TypedArrayName = 'TypedArray') {
		return new TypedArrayValidator<T>(type);
	}

	public get int8Array() {
		return this.typedArray<Int8Array>('Int8Array');
	}

	public get uint8Array() {
		return this.typedArray<Uint8Array>('Uint8Array');
	}

	public get uint8ClampedArray() {
		return this.typedArray<Uint8ClampedArray>('Uint8ClampedArray');
	}

	public get int16Array() {
		return this.typedArray<Int16Array>('Int16Array');
	}

	public get uint16Array() {
		return this.typedArray<Uint16Array>('Uint16Array');
	}

	public get int32Array() {
		return this.typedArray<Int32Array>('Int32Array');
	}

	public get uint32Array() {
		return this.typedArray<Uint32Array>('Uint32Array');
	}

	public get float32Array() {
		return this.typedArray<Float32Array>('Float32Array');
	}

	public get float64Array() {
		return this.typedArray<Float64Array>('Float64Array');
	}

	public get bigInt64Array() {
		return this.typedArray<BigInt64Array>('BigInt64Array');
	}

	public get bigUint64Array() {
		return this.typedArray<BigUint64Array>('BigUint64Array');
	}

	public tuple<T extends [...BaseValidator<any>[]]>(validators: [...T]): TupleValidator<UnwrapTuple<T>> {
		return new TupleValidator(validators);
	}

	public set<T>(validator: BaseValidator<T>) {
		return new SetValidator(validator);
	}

	public record<T>(validator: BaseValidator<T>) {
		return new RecordValidator(validator);
	}

	public map<T, U>(keyValidator: BaseValidator<T>, valueValidator: BaseValidator<U>) {
		return new MapValidator(keyValidator, valueValidator);
	}
}
