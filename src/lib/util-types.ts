import type { BaseValidator } from '../validators/BaseValidator';
import type { ObjectValidator } from '../validators/ObjectValidator';
import type { Result } from './Result';

export type Constructor<T> = (new (...args: readonly any[]) => T) | (abstract new (...args: readonly any[]) => T);

export type Type<V> = V extends BaseValidator<infer T> ? T : never;

// eslint-disable-next-line @typescript-eslint/ban-types
export type NonNullObject = {} & object;

export type PickDefined<T> = { [K in keyof T as undefined extends T[K] ? never : K]: T[K] };

export type PickUndefinedMakeOptional<T> = {
	[K in keyof T as undefined extends T[K] ? K : never]+?: Exclude<T[K], undefined>;
};

export type UndefinedToOptional<T> = PickDefined<T> & PickUndefinedMakeOptional<T>;

export type MappedObjectValidator<T> = { [key in keyof T]: BaseValidator<T[key]> };

/**
 * An alias of {@link ObjectValidator} with a name more common among object validation libraries.
 * This is the type of a schema after using `s.object({ ... })`
 * @example
 * ```typescript
 * import { s, SchemaOf } from '@sapphire/shapeshift';
 *
 * interface IIngredient {
 * 	ingredientId: string | undefined;
 * 	name: string | undefined;
 * }
 *
 * interface IInstruction {
 * 	instructionId: string | undefined;
 * 	message: string | undefined;
 * }
 *
 * interface IRecipe {
 * 	recipeId: string | undefined;
 * 	title: string;
 * 	description: string;
 * 	instructions: IInstruction[];
 * 	ingredients: IIngredient[];
 * }
 *
 * type InstructionSchemaType = SchemaOf<IInstruction>;
 * // Expected Type: ObjectValidator<IInstruction>
 *
 * type IngredientSchemaType = SchemaOf<IIngredient>;
 * // Expected Type: ObjectValidator<IIngredient>
 *
 * type RecipeSchemaType = SchemaOf<IRecipe>;
 * // Expected Type: ObjectValidator<IRecipe>
 *
 * const instructionSchema: InstructionSchemaType = s.object({
 * 	instructionId: s.string.optional,
 * 	message: s.string
 * });
 *
 * const ingredientSchema: IngredientSchemaType = s.object({
 * 	ingredientId: s.string.optional,
 * 	name: s.string
 * });
 *
 * const recipeSchema: RecipeSchemaType = s.object({
 * 	recipeId: s.string.optional,
 * 	title: s.string,
 * 	description: s.string,
 * 	instructions: s.array(instructionSchema),
 * 	ingredients: s.array(ingredientSchema)
 * });
 * ```
 */
export type SchemaOf<T> = ObjectValidator<T>;

/**
 * Infers the type of a schema object given `typeof schema`.
 * The schema has to extend {@link ObjectValidator}.
 * @example
 * ```typescript
 * import { InferType, s } from '@sapphire/shapeshift';
 *
 * const schema = s.object({
 * 	foo: s.string,
 * 	bar: s.number,
 * 	baz: s.boolean,
 * 	qux: s.bigint,
 * 	quux: s.date
 * });
 *
 * type Inferredtype = InferType<typeof schema>;
 * // Expected type:
 * // type Inferredtype = {
 * // 	foo: string;
 * // 	bar: number;
 * // 	baz: boolean;
 * // 	qux: bigint;
 * // 	quux: Date;
 * // };
 * ```
 */
export type InferType<T extends ObjectValidator<any>> = T extends ObjectValidator<any, infer U> ? U : never;

export type InferResultType<T extends Result<any>> = T extends Result<infer U> ? U : never;

export type UnwrapTuple<T extends [...any[]]> = T extends [infer Head, ...infer Tail] ? [Unwrap<Head>, ...UnwrapTuple<Tail>] : [];
export type Unwrap<T> = T extends BaseValidator<infer V> ? V : never;

export type UnshiftTuple<T extends [...any[]]> = T extends [T[0], ...infer Tail] ? Tail : never;
export type ExpandSmallerTuples<T extends [...any[]]> = T extends [T[0], ...infer Tail] ? T | ExpandSmallerTuples<Tail> : [];

// https://github.com/microsoft/TypeScript/issues/26223#issuecomment-755067958
export type Shift<A extends Array<any>> = ((...args: A) => void) extends (...args: [A[0], ...infer R]) => void ? R : never;

export type GrowExpRev<A extends Array<any>, N extends number, P extends Array<Array<any>>> = A['length'] extends N
	? A
	: GrowExpRev<[...A, ...P[0]][N] extends undefined ? [...A, ...P[0]] : A, N, Shift<P>>;

export type GrowExp<A extends Array<any>, N extends number, P extends Array<Array<any>>> = [...A, ...A][N] extends undefined
	? GrowExp<[...A, ...A], N, [A, ...P]>
	: GrowExpRev<A, N, P>;

export type Tuple<T, N extends number> = number extends N ? Array<T> : N extends 0 ? [] : N extends 1 ? [T] : GrowExp<[T], N, [[]]>;
