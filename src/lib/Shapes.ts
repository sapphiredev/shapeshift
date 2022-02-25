import {
	ArrayValidator,
	BaseValidator,
	BigIntValidator,
	BooleanValidator,
	DateValidator,
	InstanceValidator,
	LiteralValidator,
	NeverValidator,
	NullishValidator,
	NumberValidator,
	ObjectValidator,
	PassthroughValidator,
	SetValidator,
	StringValidator,
	UnionValidator,
	RecordValidator,
	MapValidator
} from '../validators/imports';
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
		return this.union(values.map((value) => this.literal(value)));
	}

	public literal<T>(value: T): BaseValidator<T> {
		if (value instanceof Date) return this.date.eq(value) as unknown as BaseValidator<T>;
		return new LiteralValidator(value);
	}

	public instance<T>(expected: Constructor<T>): InstanceValidator<T> {
		return new InstanceValidator(expected);
	}

	public union<T extends BaseValidator<unknown>>(validators: readonly T[]) {
		return new UnionValidator(validators);
	}

	public array<T>(validator: BaseValidator<T>) {
		return new ArrayValidator(validator);
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
