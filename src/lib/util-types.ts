import type { BaseValidator } from '../validators/BaseValidator';

export type Constructor<T> = (new (...args: readonly any[]) => T) | (abstract new (...args: readonly any[]) => T);

export type Type<V> = V extends BaseValidator<infer T> ? T : never;

type PickDefined<T> = { [K in keyof T as undefined extends T[K] ? never : K]: T[K] };

type PickUndefinedMakeOptional<T> = {
	[K in keyof T as undefined extends T[K] ? K : never]+?: Exclude<T[K], undefined>;
};

export type UndefinedToOptional<T> = PickDefined<T> & PickUndefinedMakeOptional<T>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type NonNullObject = {} & object;

export type MappedObjectValidator<T> = { [key in keyof T]: BaseValidator<T[key]> };
