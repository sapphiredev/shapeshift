/**
 * @internal
 * This type is only used inside of the library and is not exported on the root level
 */
export type Constructor<T> = (new (...args: readonly any[]) => T) | (abstract new (...args: readonly any[]) => T);
