import {
	isBigInt64Array,
	isBigUint64Array,
	isFloat32Array,
	isFloat64Array,
	isInt16Array,
	isInt32Array,
	isInt8Array,
	isTypedArray,
	isUint16Array,
	isUint32Array,
	isUint8Array,
	isUint8ClampedArray
} from 'node:util/types';

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
	Int8Array: isInt8Array,
	Uint8Array: isUint8Array,
	Uint8ClampedArray: isUint8ClampedArray,
	Int16Array: isInt16Array,
	Uint16Array: isUint16Array,
	Int32Array: isInt32Array,
	Uint32Array: isUint32Array,
	Float32Array: isFloat32Array,
	Float64Array: isFloat64Array,
	BigInt64Array: isBigInt64Array,
	BigUint64Array: isBigUint64Array,
	TypedArray: isTypedArray
} as const;

export type TypedArrayName = keyof typeof TypedArrays;
