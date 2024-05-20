import { CombinedError, ExpectedValidationError, s, ValidationError } from '../../src';
import { expectClonedValidator, expectError } from '../common/macros/comparators';

describe.each(['custom message', undefined])('UnionValidator (%s)', (message) => {
	const stringPredicate = s.string({ message });
	const numberPredicate = s.number({ message });

	const predicate = s.union([stringPredicate, numberPredicate], { message });

	const oneOrMoreErrorsErrorMessage = message ?? 'Received one or more errors';

	test('GIVEN a string THEN returns string', () => {
		expect<string | number>(predicate.parse('hello')).toBe('hello');
	});

	test('GIVEN a number THEN returns number', () => {
		expect<string | number>(predicate.parse(5)).toBe(5);
	});

	test('GIVEN a boolean THEN throw a ConstraintError', () => {
		expectError(
			() => predicate.parse(true),
			new CombinedError(
				[
					new ValidationError('s.string()', message ?? 'Expected a string primitive', true),
					new ValidationError('s.number()', message ?? 'Expected a number primitive', true)
				],
				{
					message: oneOrMoreErrorsErrorMessage
				}
			)
		);
	});

	describe('or', () => {
		const orPredicate = predicate.or(s.string({ message }).array({ message }));

		test.each([5, 'foo', ['bar']])('GIVEN %j THEN returns the input', (value) => {
			expect<string | number | string[]>(orPredicate.parse(value)).toStrictEqual(value);
		});

		test.each([null, undefined, true])('GIVEN %j THEN throws CombinedError', (value) => {
			expectError(
				() => orPredicate.parse(value),
				new CombinedError(
					[
						new ValidationError('s.string()', message ?? 'Expected a string primitive', value),
						new ValidationError('s.number()', message ?? 'Expected a number primitive', value),
						new ValidationError('s.array(T)', message ?? 'Expected an array', value)
					],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);
		});

		test('GIVEN s.union(s.string(), s.number()).or(s.string().array()) THEN returns s.union(s.string(), s.number(), s.string().array())', () => {
			expectClonedValidator(orPredicate, s.union([s.string(), s.number(), s.string().array()]));
		});
	});

	describe('optional', () => {
		const optionalPredicate = predicate.optional();

		test('GIVEN no validators inside the union THEN returns a LiteralValidator(undefined)', () => {
			const emptyPredicate = s.union([], { message }).optional();
			expect(emptyPredicate.parse(undefined)).toBe(undefined);
		});

		test.each([undefined, 'hello', 5])('GIVEN %j THEN returns %j', (value) => {
			expect<string | number | undefined>(optionalPredicate.parse(value)).toBe(value);
		});

		test.each([null, true, {}])('GIVEN %j THEN throws CombinedError', (value) => {
			expectError(
				() => optionalPredicate.parse(value),
				new CombinedError(
					[
						new ExpectedValidationError('s.literal(V)', message ?? 'Expected values to be equals', value, undefined),
						new ValidationError('s.string()', message ?? 'Expected a string primitive', value),
						new ValidationError('s.number()', message ?? 'Expected a number primitive', value)
					],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);
		});

		test('GIVEN s.union(s.string(), s.number()).optional() THEN returns s.union(s.undefined(), s.string(), s.number())', () => {
			expectClonedValidator(optionalPredicate, s.union([s.undefined(), s.string(), s.number()]));
		});

		describe('optional', () => {
			const doubleOptionalPredicate = optionalPredicate.optional({ message });

			test('GIVEN s.union(s.string(), s.number()).optional().optional() THEN returns s.union(s.undefined(), s.string(), s.number())', () => {
				expectClonedValidator(s.union([s.undefined(), s.string(), s.number()]), doubleOptionalPredicate);
			});
		});

		describe('nullable', () => {
			const nullableOptionalPredicate = optionalPredicate.nullable({ message });

			test('GIVEN s.union(s.string(), s.number()).optional().nullable() THEN returns s.union(s.nullish(), s.string(), s.number())', () => {
				expectClonedValidator(nullableOptionalPredicate, s.union([s.nullish(), s.string(), s.number()]));
			});
		});

		describe('nullish', () => {
			const nullishOptionalPredicate = optionalPredicate.nullish({ message });

			test('GIVEN s.union(s.string(), s.number()).nullable().nullish() THEN returns s.union(s.nullish(), s.string(), s.number())', () => {
				expectClonedValidator(nullishOptionalPredicate, s.union([s.nullish(), s.string(), s.number()]));
			});
		});
	});

	describe('required', () => {
		const requiredPredicate = predicate.required({ message });

		test('GIVEN no validators inside the union THEN clones the validator as a RequiredValidator', () => {
			const emptyPredicate = s.union([], { message }).required({ message });
			expectError(
				() => emptyPredicate.parse(undefined),
				new CombinedError([], {
					message: oneOrMoreErrorsErrorMessage
				})
			);
		});

		test.each(['hello', 5])('GIVEN %j THEN returns %j', (value) => {
			expect<string | number>(requiredPredicate.parse(value)).toBe(value);
		});

		test.each([null, true, {}, undefined])('GIVEN %j THEN throws CombinedError', (value) => {
			expectError(
				() => requiredPredicate.parse(value),
				new CombinedError(
					[
						new ValidationError('s.string()', message ?? 'Expected a string primitive', value),
						new ValidationError('s.number()', message ?? 'Expected a number primitive', value)
					],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);
		});

		describe('nullish', () => {
			const nullishRequiredPredicate = requiredPredicate.nullish({ message }).required({ message });

			test('GIVEN s.union(s.string(), s.number()).nullish().required() THEN returns s.union(s.literal(null), s.string(), s.number())', () => {
				expectClonedValidator(
					nullishRequiredPredicate,
					s.union([s.literal(null), s.string({ message }), s.number({ message })], { message })
				);
			});
		});
	});

	describe('nullable', () => {
		const nullablePredicate = predicate.nullable({ message });

		test('GIVEN no validators inside the union THEN returns a LiteralValidator(null)', () => {
			const emptyPredicate = s.union([], { message }).nullable();
			expect(emptyPredicate.parse(null)).toBe(null);
		});

		test.each([null, 'hello', 5])('GIVEN %j THEN returns %j', (value) => {
			expect<string | number | null>(nullablePredicate.parse(value)).toBe(value);
		});

		test.each([undefined, true, {}])('GIVEN %j THEN throws CombinedError', (value) => {
			expectError(
				() => nullablePredicate.parse(value),
				new CombinedError(
					[
						new ExpectedValidationError('s.literal(V)', message ?? 'Expected values to be equals', value, null),
						new ValidationError('s.string()', message ?? 'Expected a string primitive', value),
						new ValidationError('s.number()', message ?? 'Expected a number primitive', value)
					],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);
		});

		test('GIVEN s.union(s.string(), s.number()).nullable THEN returns s.union(s.null(), s.string(), s.number())', () => {
			expectClonedValidator(nullablePredicate, s.union([s.null({ message }), s.string({ message }), s.number({ message })], { message }));
		});

		describe('optional', () => {
			const optionalNullablePredicate = nullablePredicate.optional({ message });

			test('GIVEN s.union(s.string(), s.number()).nullable.optional THEN returns s.union(s.nullish(), s.string(), s.number())', () => {
				expectClonedValidator(
					optionalNullablePredicate,
					s.union([s.nullish({ message }), s.string({ message }), s.number({ message })], { message })
				);
			});
		});

		describe('nullable', () => {
			const doubleNullablePredicate = nullablePredicate.nullable({ message });

			test('GIVEN s.union(s.string(), s.number()).nullable.nullable THEN returns s.union(s.null(), s.string(), s.number())', () => {
				expectClonedValidator(
					doubleNullablePredicate,
					s.union([s.null({ message }), s.string({ message }), s.number({ message })], { message })
				);
			});
		});

		describe('nullish', () => {
			const nullishNullablePredicate = nullablePredicate.nullish({ message });

			test('GIVEN s.union(s.string(), s.number()).nullable().nullish() THEN returns s.union(s.nullish(), s.string(), s.number())', () => {
				expectClonedValidator(
					nullishNullablePredicate,
					s.union([s.nullish({ message }), s.string({ message }), s.number({ message })], { message })
				);
			});
		});
	});

	describe('nullish', () => {
		const nullishPredicate = predicate.nullish({ message });

		test('GIVEN no validators inside the union THEN returns a NullishValidator()', () => {
			const emptyPredicate = s.union([], { message }).nullish();
			expect(emptyPredicate.parse(undefined)).toBe(undefined);
		});

		test.each([null, undefined, 'hello', 5])('GIVEN %j THEN returns %j', (value) => {
			expect<string | number | undefined | null>(nullishPredicate.parse(value)).toBe(value);
		});

		test.each([true, {}])('GIVEN %j THEN throws CombinedError', (value) => {
			expectError(
				() => nullishPredicate.parse(value),
				new CombinedError(
					[
						new ValidationError('s.nullish()', message ?? 'Expected undefined or null', value),
						new ValidationError('s.string()', message ?? 'Expected a string primitive', value),
						new ValidationError('s.number()', message ?? 'Expected a number primitive', value)
					],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);
		});

		test('GIVEN s.union(s.string(), s.number()).nullable THEN returns s.union(s.null(), s.string(), s.number())', () => {
			expectClonedValidator(nullishPredicate, s.union([s.null({ message }), s.string({ message }), s.number({ message })], { message }));
		});

		describe('optional', () => {
			const optionalNullishPredicate = nullishPredicate.optional({ message });

			test('GIVEN s.union(s.string(), s.number()).nullish().optional() THEN returns s.union(s.nullish(), s.string(), s.number())', () => {
				expectClonedValidator(
					optionalNullishPredicate,
					s.union([s.nullish({ message }), s.string({ message }), s.number({ message })], { message })
				);
			});
		});

		describe('nullable', () => {
			const nullableNullishPredicate = nullishPredicate.nullable({ message });

			test('GIVEN s.union(s.string(), s.number()).nullish.nullable THEN returns s.union(s.nullish(), s.string(), s.number())', () => {
				expectClonedValidator(
					nullableNullishPredicate,
					s.union([s.nullish({ message }), s.string({ message }), s.number({ message })], { message })
				);
			});
		});

		describe('nullish', () => {
			const doubleNullishPredicate = nullishPredicate.nullish({ message });

			test('GIVEN s.union(s.string(), s.number()).nullish.nullish THEN returns s.union(s.nullish(), s.string(), s.number())', () => {
				expectClonedValidator(
					doubleNullishPredicate,
					s.union([s.nullish({ message }), s.string({ message }), s.number({ message })], { message })
				);
			});
		});
	});

	test('GIVEN clone THEN returns similar instance', () => {
		expectClonedValidator(predicate, predicate['clone']());
	});
});
