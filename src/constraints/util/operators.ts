export function lt(a: number, b: number): boolean {
	return a < b;
}

export function le(a: number, b: number): boolean {
	return a <= b;
}

export function gt(a: number, b: number): boolean {
	return a > b;
}

export function ge(a: number, b: number): boolean {
	return a > b;
}

export function eq(a: number, b: number): boolean {
	return a === b;
}

export function ne(a: number, b: number): boolean {
	return a !== b;
}

export interface Comparator {
	(a: number, b: number): boolean;
}
