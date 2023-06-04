import { CombinedPropertyError, ExpectedConstraintError, ValidationError, s, type ArrayValidator } from '../../src';
import { expectClonedValidator, expectError } from '../common/macros/comparators';

describe('ArrayValidator', () => {
	const predicate = s.string.array;

	test('GIVEN an array THEN returns an array', () => {
		expect<string[]>(predicate.parse(['Hello', 'there'])).toEqual(['Hello', 'there']);
	});

	test('GIVEN a non-array THEN throws ValidationError', () => {
		expectError(() => predicate.parse('Hello there'), new ValidationError('s.array(T)', 'Expected an array', 'Hello there'));
	});

	test.each([123, true, {}, [], null])('GIVEN an array with value %j other than string THEN throws CombinedPropertyError', (input) => {
		expectError(
			() => predicate.parse([input]),
			new CombinedPropertyError([
				//
				[0, new ValidationError('s.string', 'Expected a string primitive', input)]
			])
		);
	});

	describe('Comparators', () => {
		describe('lengthLessThan', () => {
			const lengthLessThanPredicate = s.string.array.lengthLessThan(2);

			test.each([[['Hello']]])('GIVEN %j THEN returns given value', (value) => {
				expect<[string] | []>(lengthLessThanPredicate.parse(value)).toEqual(value);
			});

			test.each([[['Hello', 'there']], [['foo', 'bar', 'baaz']]])('GIVEN %j THEN throws ConstraintError', (value) => {
				expectError(
					() => lengthLessThanPredicate.parse(value),
					new ExpectedConstraintError('s.array(T).lengthLessThan', 'Invalid Array length', value, 'expected.length < 2')
				);
			});
		});

		describe('lengthLessThanOrEqual', () => {
			const lengthLePredicate = s.string.array.lengthLessThanOrEqual(2);

			test.each([[['Hello']], [['Hello', 'there']]])('GIVEN %j THEN returns given value', (value) => {
				expect<[string, string] | [string] | []>(lengthLePredicate.parse(value)).toEqual(value);
			});

			test.each([[['foo', 'bar', 'baaz']]])('GIVEN %j THEN throws ConstraintError', (value) => {
				expectError(
					() => lengthLePredicate.parse(value),
					new ExpectedConstraintError('s.array(T).lengthLessThanOrEqual', 'Invalid Array length', value, 'expected.length <= 2')
				);
			});
		});

		describe('lengthGreaterThan', () => {
			const lengthGtPredicate = s.string.array.lengthGreaterThan(2);

			test.each([[['foo', 'bar', 'baaz']]])('GIVEN %j THEN returns given value', (value) => {
				expect<[string, string, string, ...string[]]>(lengthGtPredicate.parse(value)).toEqual(value);
			});

			test.each([[['Hello']], [[]]])('GIVEN %j THEN throws ConstraintError', (value) => {
				expectError(
					() => lengthGtPredicate.parse(value),
					new ExpectedConstraintError('s.array(T).lengthGreaterThan', 'Invalid Array length', value, 'expected.length > 2')
				);
			});
		});

		describe('lengthGreaterThanOrEqual', () => {
			const lengthGePredicate = s.string.array.lengthGreaterThanOrEqual(2);

			test.each([[['Hello', 'there']], [['foo', 'bar', 'baaz']]])('GIVEN %j THEN returns given value', (value) => {
				expect<[string, string, ...string[]]>(lengthGePredicate.parse(value)).toEqual(value);
			});

			test.each([[[]], [['foo']]])('GIVEN %j THEN throws ConstraintError', (value) => {
				expectError(
					() => lengthGePredicate.parse(value),
					new ExpectedConstraintError('s.array(T).lengthGreaterThanOrEqual', 'Invalid Array length', value, 'expected.length >= 2')
				);
			});
		});

		describe('lengthEqual', () => {
			const lengthPredicate = s.string.array.lengthEqual(2);

			test.each([[['Hello', 'there']]])('GIVEN %j THEN returns given value', (value) => {
				expect<[string, string]>(lengthPredicate.parse(value)).toEqual(value);
			});

			test.each([[[]], [['Hello']]])('GIVEN %j THEN throws ConstraintError', (value) => {
				expectError(
					() => lengthPredicate.parse(value),
					new ExpectedConstraintError('s.array(T).lengthEqual', 'Invalid Array length', value, 'expected.length === 2')
				);
			});
		});

		describe('lengthNotEqual', () => {
			const lengthNotEqPredicate = s.string.array.lengthNotEqual(2);

			test.each([[['foo', 'bar', 'baaz']], [['foo']]])('GIVEN %j THEN returns given value', (value) => {
				expect<string[]>(lengthNotEqPredicate.parse(value)).toEqual(value);
			});

			test.each([[['Hello', 'there']], [['foo', 'bar']]])('GIVEN %j THEN throws ConstraintError', (value) => {
				expectError(
					() => lengthNotEqPredicate.parse(value),
					new ExpectedConstraintError('s.array(T).lengthNotEqual', 'Invalid Array length', value, 'expected.length !== 2')
				);
			});
		});

		describe('lengthRange', () => {
			const lengthRangePredicate = s.string.array.lengthRange(0, 2);

			test.each([[[] as string[]], [['foo']]])('GIVEN %j THEN returns given value', (value) => {
				expect<[] | [string]>(lengthRangePredicate.parse(value)).toEqual(value);
			});

			test.each([[['hewwo', 'there']]])('GIVEN %j THEN throws ConstraintError', (value) => {
				expectError(
					() => lengthRangePredicate.parse(value),
					new ExpectedConstraintError(
						's.array(T).lengthRange',
						'Invalid Array length',
						value,
						'expected.length >= 0 && expected.length < 2'
					)
				);
			});
		});

		describe('lengthRangeInclusive', () => {
			const lengthRangeInclusivePredicate = s.string.array.lengthRangeInclusive(0, 2);

			test.each([[[] as string[]], [['foo']], [['hewwo', 'there']]])('GIVEN %j THEN returns given value', (value) => {
				expect<[] | [string] | [string, string]>(lengthRangeInclusivePredicate.parse(value)).toEqual(value);
			});

			test.each([[['hewwo', 'there', 'buddy']]])('GIVEN %j THEN throws ConstraintError', (value) => {
				expectError(
					() => lengthRangeInclusivePredicate.parse(value),
					new ExpectedConstraintError(
						's.array(T).lengthRangeInclusive',
						'Invalid Array length',
						value,
						'expected.length >= 0 && expected.length <= 2'
					)
				);
			});

			describe('lengthRangeExclusive', () => {
				const lengthRangeExclusivePredicate = s.string.array.lengthRangeExclusive(0, 2);

				test.each([[['foo']]])('GIVEN %j THEN returns given value', (value) => {
					expect<[string]>(lengthRangeExclusivePredicate.parse(value)).toEqual(value);
				});

				test.each([[[] as string[]], [['hewwo', 'there']], [['hewwo', 'there', 'buddy']]])(
					'GIVEN %j THEN throws ConstraintError',
					(value) => {
						expectError(
							() => lengthRangeExclusivePredicate.parse(value),
							new ExpectedConstraintError(
								's.array(T).lengthRangeExclusive',
								'Invalid Array length',
								value,
								'expected.length > 0 && expected.length < 2'
							)
						);
					}
				);
			});
		});

		describe('chainedLengthCheck', () => {
			const lengthRangePredicate = s.string.array.lengthGreaterThan(0).lengthLessThan(2);

			test.each([[['foo']]])('GIVEN %j THEN returns given value', (value) => {
				expect(lengthRangePredicate.parse(value)).toEqual(value);
			});

			test.each([[['hewwo', 'there']]])('GIVEN %j THEN throws ConstraintError', (value) => {
				expectError(
					() => lengthRangePredicate.parse(value),
					new ExpectedConstraintError('s.array(T).lengthLessThan', 'Invalid Array length', value, 'expected.length < 2')
				);
			});
		});
	});

	describe('Unique', () => {
		const validInputPredicate: [unknown, ArrayValidator<unknown[]>][] = [
			[['Hello'], s.string.array.unique],
			[['Hello', 'There'], s.string.array.unique],
			[[{ name: 'Hello' }, { name: 'Hi' }], s.object({ name: s.string }).array.unique],
			[[['Hello'], ['Hi']], s.string.array.array.unique],
			[[[{ name: 'Hello' }], [{ name: 'Hi' }]], s.object({ name: s.string }).array.array.unique]
		];

		const invalidInputPredicate: [unknown, ArrayValidator<unknown[]>][] = [
			[['Hello', 'Hello'], s.string.array.unique],
			[[1, 2, 4, 2, 1], s.number.array.unique],
			[[{ name: 'Hello' }, { name: 'Hello' }], s.object({ name: s.string }).array.unique],
			[[['Hello'], ['Hello']], s.string.array.array.unique],
			[[[{ name: 'Hello' }], [{ name: 'Hello' }]], s.object({ name: s.string }).array.array.unique]
		];

		test.each(validInputPredicate)('GIVEN %j THEN return the given value', (value, p) => {
			expect(p.parse(value)).toEqual(value);
		});

		test.each(invalidInputPredicate)('GIVEN %j THEN throws ExpectedConstraintError', (value, p) => {
			expectError(
				() => p.parse(value),
				new ExpectedConstraintError('s.array(T).unique', 'Array values are not unique', value, 'Expected all values to be unique')
			);
		});
	});

	test('GIVEN clone THEN returns similar instance', () => {
		const arrayPredicate = s.string.array;

		expectClonedValidator(arrayPredicate, arrayPredicate['clone']());
	});
});
