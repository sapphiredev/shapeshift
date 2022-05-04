import type { ObjectValidator } from './validators/ObjectValidator';

/**
 * An alias of {@link ObjectValidator} with a name more common among object validation libraries.
 * This is the type of a schema after using `s.object({ ... })`
 * @example
 * ```ts
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
 * ```ts
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
export type InferType<T extends ObjectValidator<any>> = T extends ObjectValidator<infer U> ? U : never;
