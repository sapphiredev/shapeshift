import { CombinedPropertyError, ExpectedConstraintError, ValidationError, s, type ArrayValidator } from '../../src';
import { expectClonedValidator, expectError } from '../common/macros/comparators';

describe.each(['custom message', undefined])('ArrayValidator (%s)', (message) => {
	const predicate = s.string({ message }).array({ message });

	test('GIVEN an array THEN returns an array', () => {
		expect<string[]>(predicate.parse(['Hello', 'there'])).toEqual(['Hello', 'there']);
	});

	test('GIVEN a non-array THEN throws ValidationError', () => {
		const errorMessage = message ?? 'Expected an array';
		expectError(() => predicate.parse('Hello there'), new ValidationError('s.array(T)', errorMessage, 'Hello there'));
	});

	test.each([123, true, {}, [], null])('GIVEN an array with value %j other than string THEN throws CombinedPropertyError', (input) => {
		const errorMessage = message ?? 'Expected a string primitive';
		expectError(
			() => predicate.parse([input]),
			new CombinedPropertyError(
				[
					//
					[0, new ValidationError('s.string()', errorMessage, input)]
				],
				{
					message: message ?? 'Received one or more errors'
				}
			)
		);
	});

	describe('Comparators', () => {
		describe('lengthLessThan', () => {
			const lengthLessThanPredicate = s.string().array({ message }).lengthLessThan(2);

			test.each([[['Hello']]])('GIVEN %j THEN returns given value', (value) => {
				expect<[string] | []>(lengthLessThanPredicate.parse(value)).toEqual(value);
			});

			test.each([[['Hello', 'there']], [['foo', 'bar', 'baaz']]])('GIVEN %j THEN throws ConstraintError', (value) => {
				const errorMessage = message ?? 'Invalid Array length';
				expectError(
					() => lengthLessThanPredicate.parse(value),
					new ExpectedConstraintError('s.array(T).lengthLessThan()', errorMessage, value, 'expected.length < 2')
				);
			});
		});

		describe('lengthLessThanOrEqual', () => {
			const lengthLePredicate = s.string().array({ message }).lengthLessThanOrEqual(2);

			test.each([[['Hello']], [['Hello', 'there']]])('GIVEN %j THEN returns given value', (value) => {
				expect<[string, string] | [string] | []>(lengthLePredicate.parse(value)).toEqual(value);
			});

			test.each([[['foo', 'bar', 'baaz']]])('GIVEN %j THEN throws ConstraintError', (value) => {
				const errorMessage = message ?? 'Invalid Array length';
				expectError(
					() => lengthLePredicate.parse(value),
					new ExpectedConstraintError('s.array(T).lengthLessThanOrEqual()', errorMessage, value, 'expected.length <= 2')
				);
			});
		});

		describe('lengthGreaterThan', () => {
			const lengthGtPredicate = s.string().array({ message }).lengthGreaterThan(2);

			test.each([[['foo', 'bar', 'baaz']]])('GIVEN %j THEN returns given value', (value) => {
				expect<[string, string, string, ...string[]]>(lengthGtPredicate.parse(value)).toEqual(value);
			});

			test.each([[['Hello']], [[]]])('GIVEN %j THEN throws ConstraintError', (value) => {
				const errorMessage = message ?? 'Invalid Array length';
				expectError(
					() => lengthGtPredicate.parse(value),
					new ExpectedConstraintError('s.array(T).lengthGreaterThan()', errorMessage, value, 'expected.length > 2')
				);
			});
		});

		describe('lengthGreaterThanOrEqual', () => {
			const lengthGePredicate = s.string().array({ message }).lengthGreaterThanOrEqual(2);

			test.each([[['Hello', 'there']], [['foo', 'bar', 'baaz']]])('GIVEN %j THEN returns given value', (value) => {
				expect<[string, string, ...string[]]>(lengthGePredicate.parse(value)).toEqual(value);
			});

			test.each([[[]], [['foo']]])('GIVEN %j THEN throws ConstraintError', (value) => {
				const errorMessage = message ?? 'Invalid Array length';
				expectError(
					() => lengthGePredicate.parse(value),
					new ExpectedConstraintError('s.array(T).lengthGreaterThanOrEqual()', errorMessage, value, 'expected.length >= 2')
				);
			});
		});

		describe('lengthEqual', () => {
			const lengthPredicate = s.string().array({ message }).lengthEqual(2);

			test.each([[['Hello', 'there']]])('GIVEN %j THEN returns given value', (value) => {
				expect<[string, string]>(lengthPredicate.parse(value)).toEqual(value);
			});

			test.each([[[]], [['Hello']]])('GIVEN %j THEN throws ConstraintError', (value) => {
				const errorMessage = message ?? 'Invalid Array length';
				expectError(
					() => lengthPredicate.parse(value),
					new ExpectedConstraintError('s.array(T).lengthEqual()', errorMessage, value, 'expected.length === 2')
				);
			});
		});

		describe('lengthNotEqual', () => {
			const lengthNotEqPredicate = s.string().array({ message }).lengthNotEqual(2);

			test.each([[['foo', 'bar', 'baaz']], [['foo']]])('GIVEN %j THEN returns given value', (value) => {
				expect<string[]>(lengthNotEqPredicate.parse(value)).toEqual(value);
			});

			test.each([[['Hello', 'there']], [['foo', 'bar']]])('GIVEN %j THEN throws ConstraintError', (value) => {
				const errorMessage = message ?? 'Invalid Array length';
				expectError(
					() => lengthNotEqPredicate.parse(value),
					new ExpectedConstraintError('s.array(T).lengthNotEqual()', errorMessage, value, 'expected.length !== 2')
				);
			});
		});

		describe('lengthRange', () => {
			const lengthRangePredicate = s.string().array({ message }).lengthRange(0, 2);

			test.each([[[] as string[]], [['foo']]])('GIVEN %j THEN returns given value', (value) => {
				expect<[] | [string]>(lengthRangePredicate.parse(value)).toEqual(value);
			});

			test.each([[['hewwo', 'there']]])('GIVEN %j THEN throws ConstraintError', (value) => {
				const errorMessage = message ?? 'Invalid Array length';
				expectError(
					() => lengthRangePredicate.parse(value),
					new ExpectedConstraintError('s.array(T).lengthRange()', errorMessage, value, 'expected.length >= 0 && expected.length < 2')
				);
			});
		});

		describe('lengthRangeInclusive', () => {
			const lengthRangeInclusivePredicate = s.string().array({ message }).lengthRangeInclusive(0, 2);

			test.each([[[] as string[]], [['foo']], [['hewwo', 'there']]])('GIVEN %j THEN returns given value', (value) => {
				expect<[] | [string] | [string, string]>(lengthRangeInclusivePredicate.parse(value)).toEqual(value);
			});

			test.each([[['hewwo', 'there', 'buddy']]])('GIVEN %j THEN throws ConstraintError', (value) => {
				const errorMessage = message ?? 'Invalid Array length';
				expectError(
					() => lengthRangeInclusivePredicate.parse(value),
					new ExpectedConstraintError(
						's.array(T).lengthRangeInclusive()',
						errorMessage,
						value,
						'expected.length >= 0 && expected.length <= 2'
					)
				);
			});

			describe('lengthRangeExclusive', () => {
				const lengthRangeExclusivePredicate = s.string().array({ message }).lengthRangeExclusive(0, 2);

				test.each([[['foo']]])('GIVEN %j THEN returns given value', (value) => {
					expect<[string]>(lengthRangeExclusivePredicate.parse(value)).toEqual(value);
				});

				test.each([[[] as string[]], [['hewwo', 'there']], [['hewwo', 'there', 'buddy']]])(
					'GIVEN %j THEN throws ConstraintError',
					(value) => {
						const errorMessage = message ?? 'Invalid Array length';
						expectError(
							() => lengthRangeExclusivePredicate.parse(value),
							new ExpectedConstraintError(
								's.array(T).lengthRangeExclusive()',
								errorMessage,
								value,
								'expected.length > 0 && expected.length < 2'
							)
						);
					}
				);
			});
		});

		describe('chainedLengthCheck', () => {
			const lengthRangePredicate = s.string().array({ message }).lengthGreaterThan(0).lengthLessThan(2);

			test.each([[['foo']]])('GIVEN %j THEN returns given value', (value) => {
				expect(lengthRangePredicate.parse(value)).toEqual(value);
			});

			test.each([[['hewwo', 'there']]])('GIVEN %j THEN throws ConstraintError', (value) => {
				const errorMessage = message ?? 'Invalid Array length';
				expectError(
					() => lengthRangePredicate.parse(value),
					new ExpectedConstraintError('s.array(T).lengthLessThan()', errorMessage, value, 'expected.length < 2')
				);
			});
		});
	});

	describe('Unique', () => {
		const validInputPredicate: [unknown, ArrayValidator<unknown[]>][] = [
			[['Hello'], s.string().array({ message }).unique()],
			[['Hello', 'There'], s.string().array({ message }).unique()],
			[[{ name: 'Hello' }, { name: 'Hi' }], s.object({ name: s.string() }).array({ message }).unique()],
			[[['Hello'], ['Hi']], s.string().array({ message }).array({ message }).unique()],
			[[[{ name: 'Hello' }], [{ name: 'Hi' }]], s.object({ name: s.string() }).array({ message }).array({ message }).unique()]
		];

		const invalidInputPredicate: [unknown, ArrayValidator<unknown[]>][] = [
			[['Hello', 'Hello'], s.string().array({ message }).unique()],
			[[1, 2, 4, 2, 1], s.number().array({ message }).unique()],
			[[{ name: 'Hello' }, { name: 'Hello' }], s.object({ name: s.string() }).array({ message }).unique()],
			[[['Hello'], ['Hello']], s.string().array({ message }).array({ message }).unique()],
			[[[{ name: 'Hello' }], [{ name: 'Hello' }]], s.object({ name: s.string() }).array({ message }).array({ message }).unique()]
		];

		test.each(validInputPredicate)('GIVEN %j THEN return the given value', (value, p) => {
			expect(p.parse(value)).toEqual(value);
		});

		test.each(invalidInputPredicate)('GIVEN %j THEN throws ExpectedConstraintError', (value, p) => {
			const errorMessage = message ?? 'Array values are not unique';
			expectError(
				() => p.parse(value),
				new ExpectedConstraintError('s.array(T).unique()', errorMessage, value, 'Expected all values to be unique')
			);
		});
	});

	test('GIVEN clone THEN returns similar instance', () => {
		const arrayPredicate = s.string().array({ message });

		expectClonedValidator(arrayPredicate, arrayPredicate['clone']());
	});
});
