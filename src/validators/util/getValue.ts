// https://github.com/microsoft/TypeScript/issues/37663
type Fn = (...args: unknown[]) => unknown;

export function getValue<T, U = T extends Fn ? ReturnType<T> : T>(valueOrFn: T): U {
	return typeof valueOrFn === 'function' ? valueOrFn() : valueOrFn;
}
