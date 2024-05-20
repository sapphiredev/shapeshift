import { CombinedError, ExpectedValidationError, Result, s, ValidationError } from '../../src';
import { expectClonedValidator, expectError, expectModifiedClonedValidator } from '../common/macros/comparators';

describe.each(['custom message', undefined])('BaseValidator (%s)', (message) => {
	describe('description', () => {
		test('GIVEN a validator THEN returns the description', () => {
			const validator = s.string({ message }).describe('The name of the user');

			expect(validator.description).toBe('The name of the user');
		});
	});

	describe('is', () => {
		test("GIVEN any value THEN it's narrowed to schema type", () => {
			const predicate = s.string({ message });

			const value = 'Hello there' as string | null;
			const is = predicate.is(value);

			expect(is).toBe(true);
			if (is) {
				expect<string>(value);
			} else {
				expect<null>(value);
			}
		});
	});

	describe('optional', () => {
		const optionalPredicate = s.string({ message }).optional({ message });

		test.each([undefined, 'hello'])('GIVEN %j THEN returns given value', (input) => {
			expect<string | undefined>(optionalPredicate.parse(input)).toEqual(input);
		});

		test.each([null, 0, false, true])('GIVEN %o THEN throws CombinedError', (input) => {
			expectError(
				() => optionalPredicate.parse(input),
				new CombinedError(
					[
						new ExpectedValidationError('s.literal(V)', message ?? 'Expected values to be equals', input, undefined),
						new ValidationError('s.string()', message ?? 'Expected a string primitive', input)
					],
					{
						message: message ?? 'Received one or more errors'
					}
				)
			);
		});
	});

	describe('nullable', () => {
		const nullablePredicate = s.string({ message }).nullable({ message });

		test.each([null, 'Hello There'])('GIVEN %j THEN returns given value', (input) => {
			expect<string | null>(nullablePredicate.parse(input)).toBe(input);
		});

		test.each([0, false, true])('GIVEN %j THEN throws CombinedError', (input) => {
			expectError(
				() => nullablePredicate.parse(input),
				new CombinedError(
					[
						new ExpectedValidationError('s.literal(V)', message ?? 'Expected values to be equals', input, null),
						new ValidationError('s.string()', message ?? 'Expected a string primitive', input)
					],
					{
						message: message ?? 'Received one or more errors'
					}
				)
			);
		});
	});

	describe('nullish', () => {
		const nullishPredicate = s.string({ message }).nullish({ message });

		test.each(['Hello There', undefined, null])('GIVEN %j THEN returns the given value', (input) => {
			expect<string | undefined | null>(nullishPredicate.parse(input)).toBe(input);
		});

		test.each([0, false, true])('GIVEN %j THEN throws CombinedError', (input) => {
			expectError(
				() => nullishPredicate.parse(input),
				new CombinedError(
					[
						new ValidationError('s.nullish()', message ?? 'Expected undefined or null', input),
						new ValidationError('s.string()', message ?? 'Expected a string primitive', input)
					],
					{
						message: message ?? 'Received one or more errors'
					}
				)
			);
		});
	});

	describe('array', () => {
		const numberArrayPredicate = s.number({ message }).array({ message });
		const input = [1, 2, 3];

		test('GIVEN an array of number THEN returns the given value', () => {
			expect<number[]>(numberArrayPredicate.parse(input)).toStrictEqual(input);
		});

		test('GIVEN s.number().array() THEN returns s.array(s.number())', () => {
			const arrayNumberPredicate = s.array(s.number({ message }), { message });

			expect<number[]>(numberArrayPredicate.parse([1])).toStrictEqual([1]);
			expect<number[]>(arrayNumberPredicate.parse([1, 2, 3])).toStrictEqual([1, 2, 3]);
			expectClonedValidator(numberArrayPredicate, arrayNumberPredicate);
		});
	});

	describe('set', () => {
		const numberSetPredicate = s.number({ message }).set({ message });
		const input = new Set([1, 2, 3]);

		test('GIVEN a set of numbers THEN returns the given value', () => {
			expect<Set<number>>(numberSetPredicate.parse(input)).toStrictEqual(input);
		});

		test('GIVEN s.number().set() THEN returns s.set(s.number())', () => {
			const setNumberPredicate = s.set(s.number({ message }), { message });

			expectClonedValidator(numberSetPredicate, setNumberPredicate);
		});
	});

	describe('or', () => {
		const stringOrPredicate = s.string({ message }).or(s.number({ message }));

		test.each(['Hello There', 6])('GIVEN a string or number (%j) THEN returns a string or number', (input) => {
			expect<string | number>(stringOrPredicate.parse(input)).toBe(input);
		});

		test.each([false, true, null])('GIVEN %j THEN throws CombinedError', (input) => {
			expectError(
				() => stringOrPredicate.parse(input),
				new CombinedError(
					[
						new ValidationError('s.string()', message ?? 'Expected a string primitive', input),
						new ValidationError('s.number()', message ?? 'Expected a number primitive', input)
					],
					{
						message: message ?? 'Received one or more errors'
					}
				)
			);
		});

		test('GIVEN s.string().or(s.number()) THEN returns s.union(s.number())', () => {
			const unionPredicate = s.union([s.string({ message }), s.number({ message })], { message });

			expectClonedValidator(stringOrPredicate, unionPredicate);
		});
	});

	describe('transform', () => {
		const transformPredicate = s.string({ message }).transform((value) => value.toUpperCase());

		test('GIVEN a string THEN returns uppercase string', () => {
			expect<string>(transformPredicate.parse('Hello There')).toStrictEqual('HELLO THERE');
		});
	});

	describe('transform with union', () => {
		const unionTransformPredicate = s
			.string({ message })
			.transform((value) => value.toUpperCase())
			.or(s.number({ message }));

		test('GIVEN string THEN returns uppercase string', () => {
			expect<string | number>(unionTransformPredicate.parse('Hello There')).toStrictEqual('HELLO THERE');
		});
		test('GIVEN number THEN returns number', () => {
			expect<string | number>(unionTransformPredicate.parse(6)).toStrictEqual(6);
		});

		test.each([false, true, null, undefined])('GIVEN %j THEN throws CombinedError', (input) => {
			expectError(
				() => unionTransformPredicate.parse(input),
				new CombinedError(
					[
						new ValidationError('s.string()', message ?? 'Expected a string primitive', input),
						new ValidationError('s.number()', message ?? 'Expected a number primitive', input)
					],
					{
						message: message ?? 'Received one or more errors'
					}
				)
			);
		});
	});

	describe('Reshape', () => {
		const predicate = s.string({ message }).reshape(
			(value) => {
				return value.length > 5 ? Result.ok(value.length) : Result.err(new Error('Too short'));
			},
			{ message }
		);

		test('GIVEN a string with length > 5 THEN returns the given value', () => {
			expect<number>(predicate.parse('Sapphire')).toBe(8);
		});

		test('GIVEN a string with length < 5 THEN throws Error', () => {
			expectError(() => predicate.parse('Hello'), new Error('Too short'));
		});
	});

	describe('default', () => {
		describe('required', () => {
			const defaultPredicate = s.string({ message }).default('foo', { message });

			test('GIVEN a string THEN returns the given string', () => {
				expect<string>(defaultPredicate.parse('bar')).toBe('bar');
			});

			test('GIVEN undefined THEN returns the default string', () => {
				expect<string>(defaultPredicate.parse(undefined)).toBe('foo');
			});
		});

		describe('optional', () => {
			const defaultPredicate = s.string({ message }).optional({ message }).default('foo', { message });

			test('GIVEN a string THEN returns the given string', () => {
				expect<string>(defaultPredicate.parse('bar')).toBe('bar');
			});

			test('GIVEN undefined THEN returns the default string', () => {
				expect<string>(defaultPredicate.parse(undefined)).toBe('foo');
			});
		});

		describe('default', () => {
			const defaultPredicate = s.string({ message }).default('foo', { message }).default('bar', { message });

			test('GIVEN a double default THEN returns a clone with updated default', () => {
				expectClonedValidator(s.string({ message }).default('bar', { message }), defaultPredicate);
			});
		});
	});

	describe('clone', () => {
		test('GIVEN clone THEN returns similar instance', () => {
			const predicate = s.string({ message });

			expectClonedValidator(predicate, predicate['clone']());
		});

		test('GIVEN clone of default THEN returns similar instance', () => {
			const predicate = s.number({ message }).default(5);

			expectClonedValidator(predicate, predicate['clone']());
		});
	});

	describe('Methods and Getters returns a clone', () => {
		test('GIVEN string.length constraint THEN returns modified clone of the validator', () => {
			const stringPredicate = s.string({ message });

			expectModifiedClonedValidator(stringPredicate, stringPredicate.lengthEqual(1));
			expectModifiedClonedValidator(stringPredicate, stringPredicate.lengthGreaterThanOrEqual(1));
			expectModifiedClonedValidator(stringPredicate, stringPredicate.lengthGreaterThan(1));
			expectModifiedClonedValidator(stringPredicate, stringPredicate.lengthLessThanOrEqual(1));
			expectModifiedClonedValidator(stringPredicate, stringPredicate.lengthLessThan(1));
			expectModifiedClonedValidator(stringPredicate, stringPredicate.lengthNotEqual(1));
		});

		test('GIVEN number.comparator constraint THEN returns modified clone of the validator', () => {
			const numberPredicate = s.number({ message });

			expectModifiedClonedValidator(numberPredicate, numberPredicate.equal(1));
			expectModifiedClonedValidator(numberPredicate, numberPredicate.greaterThanOrEqual(1));
			expectModifiedClonedValidator(numberPredicate, numberPredicate.greaterThan(1));
			expectModifiedClonedValidator(numberPredicate, numberPredicate.lessThanOrEqual(1));
			expectModifiedClonedValidator(numberPredicate, numberPredicate.lessThan(1));
			expectModifiedClonedValidator(numberPredicate, numberPredicate.notEqual(1));
		});

		test('GIVEN bigint.comparator constraint THEN returns modified clone of the validator', () => {
			const bigintPredicate = s.bigint({ message });

			expectModifiedClonedValidator(bigintPredicate, bigintPredicate.equal(1n));
			expectModifiedClonedValidator(bigintPredicate, bigintPredicate.greaterThanOrEqual(1n));
			expectModifiedClonedValidator(bigintPredicate, bigintPredicate.greaterThan(1n));
			expectModifiedClonedValidator(bigintPredicate, bigintPredicate.lessThanOrEqual(1n));
			expectModifiedClonedValidator(bigintPredicate, bigintPredicate.lessThan(1n));
			expectModifiedClonedValidator(bigintPredicate, bigintPredicate.notEqual(1n));
		});
	});
});
