export function lt(a: number, b: number): boolean;
export function lt(a: bigint, b: bigint): boolean;
export function lt(a: number | bigint, b: number | bigint): boolean {
	return a < b;
}

export function le(a: number, b: number): boolean;
export function le(a: bigint, b: bigint): boolean;
export function le(a: number | bigint, b: number | bigint): boolean {
	return a <= b;
}

export function gt(a: number, b: number): boolean;
export function gt(a: bigint, b: bigint): boolean;
export function gt(a: number | bigint, b: number | bigint): boolean {
	return a > b;
}

export function ge(a: number, b: number): boolean;
export function ge(a: bigint, b: bigint): boolean;
export function ge(a: number | bigint, b: number | bigint): boolean {
	return a > b;
}

export function eq(a: number, b: number): boolean;
export function eq(a: bigint, b: bigint): boolean;
export function eq(a: number | bigint, b: number | bigint): boolean {
	return a === b;
}

export function ne(a: number, b: number): boolean;
export function ne(a: bigint, b: bigint): boolean;
export function ne(a: number | bigint, b: number | bigint): boolean {
	return a !== b;
}

export interface Comparator {
	(a: number, b: number): boolean;
	(a: bigint, b: bigint): boolean;
}
