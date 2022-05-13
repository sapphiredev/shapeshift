export function lessThan(a: number, b: number): boolean;
export function lessThan(a: bigint, b: bigint): boolean;
export function lessThan(a: number | bigint, b: number | bigint): boolean {
	return a < b;
}

export function lessThanOrEqual(a: number, b: number): boolean;
export function lessThanOrEqual(a: bigint, b: bigint): boolean;
export function lessThanOrEqual(a: number | bigint, b: number | bigint): boolean {
	return a <= b;
}

export function greaterThan(a: number, b: number): boolean;
export function greaterThan(a: bigint, b: bigint): boolean;
export function greaterThan(a: number | bigint, b: number | bigint): boolean {
	return a > b;
}

export function greaterThanOrEqual(a: number, b: number): boolean;
export function greaterThanOrEqual(a: bigint, b: bigint): boolean;
export function greaterThanOrEqual(a: number | bigint, b: number | bigint): boolean {
	return a >= b;
}

export function equal(a: number, b: number): boolean;
export function equal(a: bigint, b: bigint): boolean;
export function equal(a: number | bigint, b: number | bigint): boolean {
	return a === b;
}

export function notEqual(a: number, b: number): boolean;
export function notEqual(a: bigint, b: bigint): boolean;
export function notEqual(a: number | bigint, b: number | bigint): boolean {
	return a !== b;
}

export interface Comparator {
	(a: number, b: number): boolean;
	(a: bigint, b: bigint): boolean;
}
