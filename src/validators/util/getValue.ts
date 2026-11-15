export function getValue<T>(valueOrFn: T | (() => T)): T {
	return typeof valueOrFn === 'function' ? (valueOrFn as () => T)() : valueOrFn;
}
