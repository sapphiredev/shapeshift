import type { BaseValidator } from '../validators/BaseValidator';

/**
 * @internal
 * This type is only used inside of the library and is not exported on the root level
 */
export type Constructor<T> = (new (...args: readonly any[]) => T) | (abstract new (...args: readonly any[]) => T);

/**
 * @internal
 * This type is only used inside of the library and is not exported on the root level
 */
export type Type<V> = V extends BaseValidator<infer T> ? T : never;

/**
 * @internal
 * This type is only used inside of the library and is not exported on the root level
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type NonNullObject = {} & object;

/**
 * @internal
 * This type is only used inside of the library and is not exported on the root level
 */
export type MappedObjectValidator<T> = { [key in keyof T]: BaseValidator<T[key]> };
