import {
	CombinedError,
	CombinedPropertyError,
	ExpectedConstraintError,
	ExpectedValidationError,
	MissingPropertyError,
	s,
	UnknownPropertyError,
	ValidationError
} from '../../src';
import { expectError } from '../common/macros/comparators';

describe.each(['custom message', undefined])('ObjectValidator (%s)', (message) => {
	const unexpectedPropertyErrorMessage = message ?? 'Received unexpected property';
	const oneOrMoreErrorsErrorMessage = message ?? 'Received one or more errors';
	const requiredPropertyMissingErrorMessage = message ?? 'A required property is missing';
	const expectedStringPrimitedErrorMessage = message ?? 'Expected a string primitive';

	const predicate = s.object(
		{
			username: s.string({ message }),
			password: s.string({ message })
		},
		{ message }
	);

	test('GIVEN a non-object value THEN throws ValidationError', () => {
		expectError(
			() => predicate.parse('hello'),
			new ValidationError('s.object(T)', message ?? 'Expected the value to be an object, but received string instead', 'hello')
		);
	});

	test('GIVEN a null object value THEN throws ValidationError', () => {
		expectError(() => predicate.parse(null), new ValidationError('s.object(T)', message ?? 'Expected the value to not be null', null));
	});

	test('GIVEN an array value THEN throws ValidationError', () => {
		expectError(() => predicate.parse([]), new ValidationError('s.object(T)', message ?? 'Expected the value to not be an array', []));
	});

	test('GIVEN a valid object THEN returns processed object', () => {
		expect(predicate.parse({ username: 'Sapphire', password: 'helloworld' })).toStrictEqual({ username: 'Sapphire', password: 'helloworld' });
	});

	test('GIVEN mismatching in one property THEN throws CombinedError with one error', () => {
		expectError(
			() => predicate.parse({ username: 42, password: 'helloworld' }),
			new CombinedPropertyError(
				[
					//
					['username', new ValidationError('s.string()', message ?? 'Expected a string primitive', 42)]
				],
				{
					message: message ?? 'Received one or more errors'
				}
			)
		);
	});

	test('GIVEN mismatching in two properties THEN throws CombinedError with two errors', () => {
		expectError(
			() => predicate.parse({ username: 42, password: true }),
			new CombinedPropertyError(
				[
					['username', new ValidationError('s.string()', message ?? 'Expected a string primitive', 42)],
					['password', new ValidationError('s.string()', message ?? 'Expected a string primitive', true)]
				],
				{
					message: message ?? 'Received one or more errors'
				}
			)
		);
	});

	test('GIVEN LiteralValidator with undefined THEN it should be counted as a possibly undefined key', () => {
		const predicate = s.object(
			{
				owo: s.undefined({ message })
			},
			{ message }
		);

		expect(predicate['possiblyUndefinedKeys'].size).toEqual(1);
	});

	test('GIVEN LiteralValidator with null THEN it should be counted as a required key', () => {
		const predicate = s.object(
			{
				owo: s.null({ message })
			},
			{ message }
		);

		expect(predicate['requiredKeys'].size).toEqual(1);
	});

	test('GIVEN NullishValidator then it should count as a possibly undefined key', () => {
		const predicate = s.object(
			{
				owo: s.nullish({ message })
			},
			{ message }
		);

		expect(predicate['possiblyUndefinedKeys'].size).toEqual(1);
	});

	test('GIVEN UnionValidator with NullishValidator inside THEN it should be counted as a possibly undefined key', () => {
		const predicate = s.object(
			{
				owo: s.string({ message }).nullish({ message })
			},
			{ message }
		);

		expect(predicate['possiblyUndefinedKeys'].size).toEqual(1);
	});

	test('GIVEN a validator with a default value THEN it should be counted as a possibly undefined key with defaults', () => {
		const predicate = s.object(
			{
				owo: s.string({ message }).default('hello')
			},
			{ message }
		);

		expect(predicate['possiblyUndefinedKeysWithDefaults'].size).toEqual(1);

		expect(predicate.parse({})).toStrictEqual({ owo: 'hello' });
	});

	test("GIVEN UnionValidator with LiteralValidator with 'owo' THEN it should be counted as a required key", () => {
		const predicate = s.object(
			{
				owo: s.union(
					[
						s.literal('owo', {
							dateOptions: {
								message
							},
							equalsOptions: { message }
						}),
						s.number({ message })
					],
					{ message }
				)
			},
			{ message }
		);

		expect(predicate['requiredKeys'].size).toEqual(1);
	});

	test('GIVEN UnionValidator with LiteralValidator with null THEN it should be counted as a required key', () => {
		const predicate = s.object({
			owo: s.union([s.string({ message }), s.literal(null, { dateOptions: { message }, equalsOptions: { message } })], { message })
		});

		expect(predicate['requiredKeys'].size).toEqual(1);
	});

	// Unit test for lines 167-190 of ObjectValidator.ts
	test('GIVEN a big schema THEN it should validate using the shortest possible solution', () => {
		const predicate = s.object(
			{
				a: s.string({ message }),
				b: s.string({ message }),
				c: s.string({ message }).optional({ message }),
				d: s.string({ message }).optional({ message }),
				e: s.string({ message }).optional({ message })
			},
			{ message }
		);

		expect(predicate.parse({ a: 'a', b: 'b', c: 'c', d: 'd' })).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd' });
		expect(predicate.parse({ a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f', g: 'g' })).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd', e: 'e' });
	});

	describe('Strict', () => {
		const strictPredicate = predicate.strict({ message });

		test('GIVEN matching keys and values THEN returns no errors', () => {
			expect(strictPredicate.parse({ username: 'Sapphire', password: 'helloworld' })).toStrictEqual({
				username: 'Sapphire',
				password: 'helloworld'
			});
		});

		test('GIVEN mismatching in one property THEN throws CombinedError with one error', () => {
			expectError(
				() => strictPredicate.parse({ username: 42, password: 'helloworld' }),
				new CombinedPropertyError(
					[
						//
						['username', new ValidationError('s.string()', expectedStringPrimitedErrorMessage, 42)]
					],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);
		});

		test('GIVEN mismatching in one property and one unknown key THEN throws CombinedError with two errors', () => {
			expectError(
				() => strictPredicate.parse({ username: 42, password: 'helloworld', foo: 'bar' }),
				new CombinedPropertyError(
					[
						['username', new ValidationError('s.string()', expectedStringPrimitedErrorMessage, 42)],
						['foo', new UnknownPropertyError('foo', 'bar', { message: unexpectedPropertyErrorMessage })]
					],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);
		});

		test('GIVEN mismatching in one property and one missing key THEN throws CombinedError with two errors', () => {
			expectError(
				() => strictPredicate.parse({ username: 42, foo: 'owo' }),
				new CombinedPropertyError(
					[
						['username', new ValidationError('s.string()', expectedStringPrimitedErrorMessage, 42)],
						['password', new MissingPropertyError('password', { message: requiredPropertyMissingErrorMessage })],
						['foo', new UnknownPropertyError('foo', 'owo', { message: unexpectedPropertyErrorMessage })]
					],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);
		});

		const optionalStrict = strictPredicate.extend(
			{
				optionalKey: s.string({ message }).optional({ message })
			},
			{ message }
		);

		test('GIVEN matching keys and values without optional keys THEN returns no errors', () => {
			expect(optionalStrict.parse({ username: 'Sapphire', password: 'helloworld' })).toStrictEqual({
				username: 'Sapphire',
				password: 'helloworld'
			});

			expect(optionalStrict.parse({ username: 'Sapphire', password: 'helloworld', optionalKey: 'pog' })).toStrictEqual({
				username: 'Sapphire',
				password: 'helloworld',
				optionalKey: 'pog'
			});
		});
	});

	describe('Ignore', () => {
		const ignorePredicate = predicate.ignore({ message });

		test('GIVEN matching keys and values THEN returns no errors', () => {
			expect(ignorePredicate.parse({ username: 'Sapphire', password: 'helloworld', email: 'foo@bar.com' })).toStrictEqual({
				username: 'Sapphire',
				password: 'helloworld'
			});
		});

		test('GIVEN missing keys THEN throws CombinedPropertyError with MissingPropertyError', () => {
			expectError(
				() => ignorePredicate.parse({ username: 'Sapphire' }),
				new CombinedPropertyError([['password', new MissingPropertyError('password', { message: requiredPropertyMissingErrorMessage })]], {
					message: oneOrMoreErrorsErrorMessage
				})
			);
		});

		test('GIVEN matching keys with an optional key that fails validation, THEN throws CombinedPropertyError with ValidationError', () => {
			const predicate = ignorePredicate.extend(
				{
					owo: s.boolean().optional()
				},
				{ message }
			);

			expectError(
				() => predicate.parse({ username: 'Sapphire', password: 'helloworld', owo: 'owo' }),
				new CombinedPropertyError(
					[
						[
							'owo',
							new CombinedError([
								new ExpectedValidationError('s.literal(V)', 'Expected values to be equals', 'owo', undefined),
								new ValidationError('s.boolean()', 'Expected a boolean primitive', 'owo')
							])
						]
					],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);
		});
	});

	describe('Passthrough', () => {
		const passthroughPredicate = predicate.passthrough({ message });

		test('GIVEN matching keys and values THEN returns no errors', () => {
			expect(passthroughPredicate.parse({ username: 'Sapphire', password: 'helloworld', email: 'foo@bar.com' })).toStrictEqual({
				email: 'foo@bar.com',
				username: 'Sapphire',
				password: 'helloworld'
			});
		});

		test('GIVEN missing keys THEN throws CombinedPropertyError with MissingPropertyError', () => {
			expectError(
				() => passthroughPredicate.parse({ username: 'Sapphire' }),
				new CombinedPropertyError([['password', new MissingPropertyError('password', { message: requiredPropertyMissingErrorMessage })]], {
					message: oneOrMoreErrorsErrorMessage
				})
			);
		});
	});

	describe('Partial', () => {
		const partialPredicate = predicate.partial({ message });

		test('GIVEN empty object THEN returns an empty object', () => {
			expect(partialPredicate.parse({})).toStrictEqual({});
		});
	});

	describe('Required', () => {
		const partialPredicate = predicate.partial({ message }).required({ message });

		test('GIVEN empty object THEN returns an empty object', () => {
			expect(
				partialPredicate.parse({
					username: 'Sapphire',
					password: 'helloworld'
				})
			).toStrictEqual({
				username: 'Sapphire',
				password: 'helloworld'
			});
		});

		test('GIVEN empty object THEN returns an empty object', () => {
			expectError(
				() => partialPredicate.parse({}),
				new CombinedPropertyError(
					[
						['username', new MissingPropertyError('username', { message: requiredPropertyMissingErrorMessage })],
						['password', new MissingPropertyError('password', { message: requiredPropertyMissingErrorMessage })]
					],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);
		});
	});

	describe('Extend', () => {
		test('GIVEN a plain object THEN returns a predicate validator with merged shapes', () => {
			const extendPredicate = predicate.extend({ foo: s.number() }, { message });

			expect(Object.keys(extendPredicate.shape)).toStrictEqual(['username', 'password', 'foo']);
			expect(extendPredicate.parse({ username: 'Sapphire', password: 'helloworld', foo: 42 })).toStrictEqual({
				username: 'Sapphire',
				password: 'helloworld',
				foo: 42
			});
		});

		test('GIVEN an object predicate THEN returns a predicate validator with merged shapes', () => {
			const extendPredicate = predicate.extend(s.object({ foo: s.number() }), { message });

			expect(Object.keys(extendPredicate.shape)).toStrictEqual(['username', 'password', 'foo']);
			expect(extendPredicate.parse({ username: 'Sapphire', password: 'helloworld', foo: 42 })).toStrictEqual({
				username: 'Sapphire',
				password: 'helloworld',
				foo: 42
			});
		});
	});

	describe('Pick', () => {
		test('GIVEN no keys THEN returns an empty predicate validator', () => {
			const pickPredicate = predicate.pick([], { message });

			expect(Object.keys(pickPredicate.shape)).toStrictEqual([]);
			expect(pickPredicate.parse({ username: 'Sapphire', password: 'helloworld' })).toStrictEqual({});
		});

		test('GIVEN one key THEN returns a subset of the object predicate', () => {
			const pickPredicate = predicate.pick(['password'], { message });

			expect(Object.keys(pickPredicate.shape)).toStrictEqual(['password']);
			expect(pickPredicate.parse({ username: 'Sapphire', password: 'helloworld' })).toStrictEqual({ password: 'helloworld' });
		});

		test('GIVEN an unknown key THEN is ignored from the new object predicate', () => {
			const pickPredicate = predicate.pick(['password', 'foo' as any], { message });

			expect(Object.keys(pickPredicate.shape)).toStrictEqual(['password']);
			expect(pickPredicate.parse({ username: 'Sapphire', password: 'helloworld' })).toStrictEqual({ password: 'helloworld' });
		});
	});

	describe('Omit', () => {
		test('GIVEN no keys THEN returns a clone of the predicate validator', () => {
			const pickPredicate = predicate.omit([], { message });

			expect(Object.keys(pickPredicate.shape)).toStrictEqual(['username', 'password']);
			expect(pickPredicate.parse({ username: 'Sapphire', password: 'helloworld' })).toStrictEqual({
				username: 'Sapphire',
				password: 'helloworld'
			});
		});

		test('GIVEN one key THEN returns a subset of the object predicate', () => {
			const pickPredicate = predicate.omit(['password'], { message });

			expect(Object.keys(pickPredicate.shape)).toStrictEqual(['username']);
			expect(pickPredicate.parse({ username: 'Sapphire', password: 'helloworld' })).toStrictEqual({ username: 'Sapphire' });
		});

		test('GIVEN an unknown key THEN is ignored from the new object predicate', () => {
			const pickPredicate = predicate.omit(['password', 'foo' as any], { message });

			expect(Object.keys(pickPredicate.shape)).toStrictEqual(['username']);
			expect(pickPredicate.parse({ username: 'Sapphire', password: 'helloworld' })).toStrictEqual({ username: 'Sapphire' });
		});
	});

	describe('When', () => {
		test('Given a key WITH is function THEN return value based on the value at key position', () => {
			const whenPredicate = s.object(
				{
					booleanLike: s.boolean(),
					numberLike: s.number().when('booleanLike', {
						is: (value) => value === true,
						then: (schema) => schema.greaterThanOrEqual(5),
						otherwise: (schema) => schema.lessThanOrEqual(5)
					})
				},
				{
					message
				}
			);

			expect(whenPredicate.parse({ booleanLike: true, numberLike: 6 })).toStrictEqual({ booleanLike: true, numberLike: 6 });
			expectError(
				() => whenPredicate.parse({ booleanLike: true, numberLike: 4 }),
				new CombinedPropertyError(
					[['numberLike', new ExpectedConstraintError('s.number().greaterThanOrEqual()', 'Invalid number value', 4, 'expected >= 5')]],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);

			expect(whenPredicate.parse({ booleanLike: false, numberLike: 4 })).toStrictEqual({ booleanLike: false, numberLike: 4 });

			expectError(
				() => whenPredicate.parse({ booleanLike: false, numberLike: 6 }),
				new CombinedPropertyError(
					[['numberLike', new ExpectedConstraintError('s.number().lessThanOrEqual()', 'Invalid number value', 6, 'expected <= 5')]],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);
		});

		test('Given a key WITH is primitive literal THEN return value based on the value strictly equal to the primitive literal', () => {
			const whenPredicate = s.object(
				{
					booleanLike: s.boolean(),
					numberLike: s.number().when('booleanLike', {
						is: true,
						then: (schema) => schema.greaterThanOrEqual(5),
						otherwise: (schema) => schema.lessThanOrEqual(5)
					})
				},
				{
					message
				}
			);

			expect(whenPredicate.parse({ booleanLike: true, numberLike: 6 })).toStrictEqual({ booleanLike: true, numberLike: 6 });
			expectError(
				() => whenPredicate.parse({ booleanLike: true, numberLike: 4 }),
				new CombinedPropertyError(
					[['numberLike', new ExpectedConstraintError('s.number().greaterThanOrEqual()', 'Invalid number value', 4, 'expected >= 5')]],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);

			expect(whenPredicate.parse({ booleanLike: false, numberLike: 4 })).toStrictEqual({ booleanLike: false, numberLike: 4 });

			expectError(
				() => whenPredicate.parse({ booleanLike: false, numberLike: 6 }),
				new CombinedPropertyError(
					[['numberLike', new ExpectedConstraintError('s.number().lessThanOrEqual()', 'Invalid number value', 6, 'expected <= 5')]],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);
		});

		test('Given a key WITHOUT is THEN return value based on the value at key position', () => {
			const whenPredicate = s.object(
				{
					booleanLike: s.boolean(),
					numberLike: s.number().when('booleanLike', {
						then: (schema) => schema.greaterThanOrEqual(5),
						otherwise: (schema) => schema.lessThanOrEqual(5)
					})
				},
				{
					message
				}
			);

			expect(whenPredicate.parse({ booleanLike: true, numberLike: 6 })).toStrictEqual({ booleanLike: true, numberLike: 6 });
			expectError(
				() => whenPredicate.parse({ booleanLike: true, numberLike: 4 }),
				new CombinedPropertyError(
					[['numberLike', new ExpectedConstraintError('s.number().greaterThanOrEqual()', 'Invalid number value', 4, 'expected >= 5')]],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);

			expect(whenPredicate.parse({ booleanLike: false, numberLike: 4 })).toStrictEqual({ booleanLike: false, numberLike: 4 });

			expectError(
				() => whenPredicate.parse({ booleanLike: false, numberLike: 6 }),
				new CombinedPropertyError(
					[['numberLike', new ExpectedConstraintError('s.number().lessThanOrEqual()', 'Invalid number value', 6, 'expected <= 5')]],
					{ message: oneOrMoreErrorsErrorMessage }
				)
			);
		});

		test('Given an array of keys WITHOUT is THEN check truly of each values', () => {
			const whenPredicate = s.object(
				{
					booleanLike: s.boolean(),
					stringLike: s.string(),
					numberLike: s.number().when(['booleanLike', 'stringLike'], {
						then: (schema) => schema.greaterThanOrEqual(5),
						otherwise: (schema) => schema.lessThanOrEqual(5)
					})
				},
				{ message }
			);

			expect(whenPredicate.parse({ booleanLike: true, stringLike: 'foo', numberLike: 6 })).toStrictEqual({
				booleanLike: true,
				stringLike: 'foo',
				numberLike: 6
			});
			expectError(
				() => whenPredicate.parse({ booleanLike: true, stringLike: 'foo', numberLike: 4 }),
				new CombinedPropertyError(
					[['numberLike', new ExpectedConstraintError('s.number().greaterThanOrEqual()', 'Invalid number value', 4, 'expected >= 5')]],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);

			expect(whenPredicate.parse({ booleanLike: false, stringLike: 'foo', numberLike: 4 })).toStrictEqual({
				booleanLike: false,
				stringLike: 'foo',
				numberLike: 4
			});

			expect(whenPredicate.parse({ booleanLike: true, stringLike: '', numberLike: 4 })).toStrictEqual({
				booleanLike: true,
				stringLike: '',
				numberLike: 4
			});

			expectError(
				() => whenPredicate.parse({ booleanLike: false, stringLike: 'foo', numberLike: 6 }),
				new CombinedPropertyError(
					[['numberLike', new ExpectedConstraintError('s.number().lessThanOrEqual()', 'Invalid number value', 6, 'expected <= 5')]],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);

			expectError(
				() => whenPredicate.parse({ booleanLike: true, stringLike: '', numberLike: 6 }),
				new CombinedPropertyError(
					[['numberLike', new ExpectedConstraintError('s.number().lessThanOrEqual()', 'Invalid number value', 6, 'expected <= 5')]],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);
		});

		test('Given a number key THEN return return value based on the key', () => {
			const whenPredicate = s.object(
				{
					1: s.boolean(),
					numberLike: s.number().when(1, {
						is: (value) => value === true,
						then: (schema) => schema.greaterThanOrEqual(5),
						otherwise: (schema) => schema.lessThanOrEqual(5)
					})
				},
				{
					message
				}
			);

			expect(whenPredicate.parse({ 1: true, numberLike: 6 })).toStrictEqual({ 1: true, numberLike: 6 });
			expectError(
				() => whenPredicate.parse({ 1: true, numberLike: 4 }),
				new CombinedPropertyError(
					[['numberLike', new ExpectedConstraintError('s.number().greaterThanOrEqual()', 'Invalid number value', 4, 'expected >= 5')]],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);

			expect(whenPredicate.parse({ 1: false, numberLike: 4 })).toStrictEqual({ 1: false, numberLike: 4 });

			expectError(
				() => whenPredicate.parse({ 1: false, numberLike: 6 }),
				new CombinedPropertyError(
					[['numberLike', new ExpectedConstraintError('s.number().lessThanOrEqual()', 'Invalid number value', 6, 'expected <= 5')]],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);
		});

		test('Given multiple keys THEN return return value based on the keys', () => {
			const whenPredicate = s.object(
				{
					booleanLike: s.boolean(),
					stringLike: s.string(),
					numberLike: s.number().when(['booleanLike', 'stringLike'], {
						is: ([booleanLikeValue, stringLikeValue]) => booleanLikeValue === true && stringLikeValue === 'foo',
						then: (schema) => schema.greaterThanOrEqual(5),
						otherwise: (schema) => schema.lessThanOrEqual(5)
					})
				},
				{
					message
				}
			);

			expect(whenPredicate.parse({ booleanLike: true, stringLike: 'foo', numberLike: 6 })).toStrictEqual({
				booleanLike: true,
				numberLike: 6,
				stringLike: 'foo'
			});
			expect(whenPredicate.parse({ booleanLike: true, stringLike: 'bar', numberLike: 4 })).toStrictEqual({
				booleanLike: true,
				numberLike: 4,
				stringLike: 'bar'
			});
			expect(whenPredicate.parse({ booleanLike: false, stringLike: 'foo', numberLike: 4 })).toStrictEqual({
				booleanLike: false,
				numberLike: 4,
				stringLike: 'foo'
			});

			expectError(
				() => whenPredicate.parse({ booleanLike: false, stringLike: 'foo', numberLike: 6 }),
				new CombinedPropertyError(
					[['numberLike', new ExpectedConstraintError('s.number().lessThanOrEqual()', 'Invalid number value', 6, 'expected <= 5')]],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);
			expectError(
				() => expect(whenPredicate.parse({ booleanLike: true, stringLike: 'bar', numberLike: 6 })),
				new CombinedPropertyError(
					[['numberLike', new ExpectedConstraintError('s.number().lessThanOrEqual()', 'Invalid number value', 6, 'expected <= 5')]],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);
		});

		test('Given a key without `otherwise` THEN return the same value for false condition', () => {
			const whenPredicate = s.object(
				{
					booleanLike: s.boolean(),
					numberLike: s.number().when('booleanLike', {
						is: (value) => value === true,
						then: (schema) => schema.greaterThanOrEqual(5)
					})
				},
				{
					message
				}
			);

			expect(whenPredicate.parse({ booleanLike: true, numberLike: 6 })).toStrictEqual({ booleanLike: true, numberLike: 6 });
			expectError(
				() => whenPredicate.parse({ booleanLike: true, numberLike: 4 }),
				new CombinedPropertyError(
					[['numberLike', new ExpectedConstraintError('s.number().greaterThanOrEqual()', 'Invalid number value', 4, 'expected >= 5')]],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);

			expect(whenPredicate.parse({ booleanLike: false, numberLike: 4 })).toStrictEqual({ booleanLike: false, numberLike: 4 });
			expect(whenPredicate.parse({ booleanLike: false, numberLike: 6 })).toStrictEqual({ booleanLike: false, numberLike: 6 });
		});

		test('Given a predicate with no parent THEN throw ExpectedConstraintError', () => {
			const whenPredicate = s.number().when('booleanLike', {
				is: (value) => value === true,
				then: (schema) => schema.greaterThanOrEqual(5),
				otherwise: (schema) => schema.lessThanOrEqual(5)
				// TODO: check if message should be added here
			});

			expectError(
				() => whenPredicate.parse(5),
				new ExpectedConstraintError('s.object(T.when)', 'Validator has no parent', undefined, 'Validator to have a parent')
			);
		});

		test('Given a nested object and a key with dot THEN return return value based on the key', () => {
			const whenPredicate = s.object(
				{
					objectLike: s.object({
						booleanLike: s.boolean(),
						numberLike: s.number().when('objectLike.booleanLike', {
							is: (value) => value === true,
							then: (schema) => schema.greaterThanOrEqual(5),
							otherwise: (schema) => schema.lessThanOrEqual(5)
						})
					})
				},
				{
					message
				}
			);

			expect(whenPredicate.parse({ objectLike: { booleanLike: true, numberLike: 6 } })).toStrictEqual({
				objectLike: { booleanLike: true, numberLike: 6 }
			});
			expectError(
				() => whenPredicate.parse({ objectLike: { booleanLike: true, numberLike: 4 } }),
				new CombinedPropertyError(
					[
						[
							'objectLike',
							new CombinedPropertyError([
								[
									'numberLike',
									new ExpectedConstraintError('s.number().greaterThanOrEqual()', 'Invalid number value', 4, 'expected >= 5')
								]
							])
						]
					],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);

			expect(whenPredicate.parse({ objectLike: { booleanLike: false, numberLike: 4 } })).toStrictEqual({
				objectLike: { booleanLike: false, numberLike: 4 }
			});

			expectError(
				() => whenPredicate.parse({ objectLike: { booleanLike: false, numberLike: 6 } }),
				new CombinedPropertyError(
					[
						[
							'objectLike',
							new CombinedPropertyError([
								[
									'numberLike',
									new ExpectedConstraintError('s.number().lessThanOrEqual()', 'Invalid number value', 6, 'expected <= 5')
								]
							])
						]
					],
					{
						message: oneOrMoreErrorsErrorMessage
					}
				)
			);
		});
	});

	test('GIVEN clone THEN returns similar instance', () => {
		// @ts-expect-error Test clone
		const clonePredicate = predicate.clone();

		expect(clonePredicate).toBeInstanceOf(predicate.constructor);
		expect(clonePredicate.parse({ username: 'Sapphire', password: 'helloworld' })).toStrictEqual(
			predicate.parse({ username: 'Sapphire', password: 'helloworld' })
		);
	});
});
