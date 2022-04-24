export type TypedArray =
	| Int8Array
	| Uint8Array
	| Uint8ClampedArray
	| Int16Array
	| Uint16Array
	| Int32Array
	| Uint32Array
	| Float32Array
	| Float64Array
	| BigInt64Array
	| BigUint64Array;

export const TypedArrays = {
	i8: (x: unknown): x is Int8Array => x instanceof Int8Array,
	u8: (x: unknown): x is Uint8Array => x instanceof Uint8Array,
	u8clamped: (x: unknown): x is Uint8ClampedArray => x instanceof Uint8ClampedArray,
	i16: (x: unknown): x is Int16Array => x instanceof Int16Array,
	u16: (x: unknown): x is Uint16Array => x instanceof Uint16Array,
	i32: (x: unknown): x is Int32Array => x instanceof Int32Array,
	u32: (x: unknown): x is Uint32Array => x instanceof Uint32Array,
	f32: (x: unknown): x is Float32Array => x instanceof Float32Array,
	f64: (x: unknown): x is Float64Array => x instanceof Float64Array,
	bi64: (x: unknown): x is BigInt64Array => x instanceof BigInt64Array,
	bu64: (x: unknown): x is BigUint64Array => x instanceof BigUint64Array,
	TypedArray: (x: unknown): x is TypedArray => ArrayBuffer.isView(x) && !(x instanceof DataView)
} as const;

export type TypedArrayName = keyof typeof TypedArrays;
