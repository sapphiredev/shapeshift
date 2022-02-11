import { ConstraintError, s, ValidationError } from '../../src';

const smallInteger = 42n;
const largeInteger = 242043489611808769n;

describe('BigIntValidator', () => {
	const predicate = s.bigint;

	test('GIVEN a bigint THEN returns a bigint', () => {
		expect(predicate.parse(42n)).toBe(42n);
	});

	test('GIVEN a non-bigint THEN throws ValidationError', () => {
		expect(() => predicate.parse('Hello there')).toThrow(new ValidationError('BigIntValidator', 'Expected a bigint primitive', 'Hello there'));
	});

	describe('Comparators', () => {
		describe('lt', () => {
			const ltPredicate = s.bigint.lt(42n);

			test.each([10n])('GIVEN %d THEN returns given value', (value) => {
				expect(ltPredicate.parse(value)).toBe(value);
			});

			test.each([42n, 100n])('GIVEN %d THEN throws ConstraintError', (value) => {
				expect(() => ltPredicate.parse(value)).toThrow(new ConstraintError('s.bigint.lt', 'Invalid bigint value', value, 'expected < 42n'));
			});
		});

		describe('le', () => {
			const lePredicate = s.bigint.le(42n);

			test.each([10n, 42n])('GIVEN %d THEN returns given value', (input) => {
				expect(lePredicate.parse(input)).toBe(input);
			});

			test.each([100n])('GIVEN %d THEN throws ConstraintError', (input) => {
				expect(() => lePredicate.parse(input)).toThrow(new ConstraintError('s.bigint.le', 'Invalid bigint value', input, 'expected <= 42n'));
			});
		});

		describe('gt', () => {
			const gtPredicate = s.bigint.gt(42n);

			test.each([100n])('GIVEN %d THEN returns given value', (value) => {
				expect(gtPredicate.parse(value)).toBe(value);
			});

			test.each([10n, 42n])('GIVEN %d THEN throws ConstraintError', (value) => {
				expect(() => gtPredicate.parse(value)).toThrow(new ConstraintError('s.bigint.gt', 'Invalid bigint value', value, 'expected > 42n'));
			});
		});

		describe('ge', () => {
			const gePredicate = s.bigint.ge(42n);

			test.each([42n, 100n])('GIVEN %d THEN returns given value', (value) => {
				expect(gePredicate.parse(value)).toBe(value);
			});

			test.each([10n])('GIVEN %d THEN throws ConstraintError', (value) => {
				expect(() => gePredicate.parse(value)).toThrow(new ConstraintError('s.bigint.ge', 'Invalid bigint value', value, 'expected >= 42n'));
			});
		});

		describe('eq', () => {
			const eqPredicate = s.bigint.eq(42n);

			test.each([42n])('GIVEN %d THEN returns given value', (value) => {
				expect(eqPredicate.parse(value)).toBe(value);
			});

			test.each([10n, 100n])('GIVEN %d THEN throws ConstraintError', (value) => {
				expect(() => eqPredicate.parse(value)).toThrow(new ConstraintError('s.bigint.eq', 'Invalid bigint value', value, 'expected === 42n'));
			});
		});

		describe('ne', () => {
			const nePredicate = s.bigint.ne(42n);

			test.each([10n, 100n])('GIVEN %d THEN returns given value', (value) => {
				expect(nePredicate.parse(value)).toBe(value);
			});

			test.each([42n])('GIVEN %d THEN throws ConstraintError', (value) => {
				expect(() => nePredicate.parse(value)).toThrow(new ConstraintError('s.bigint.ne', 'Invalid bigint value', value, 'expected !== 42n'));
			});
		});
	});

	describe('Constraints', () => {
		describe('Positive', () => {
			const positivePredicate = s.bigint.positive;

			test.each([smallInteger, largeInteger])('GIVEN %d THEN returns given value', (input) => {
				expect(positivePredicate.parse(input)).toBe(input);
			});

			test.each([-smallInteger, -largeInteger])('GIVEN %d THEN throws a ConstraintError', (input) => {
				expect(() => positivePredicate.parse(input)).toThrow(
					new ConstraintError('s.bigint.ge', 'Invalid bigint value', input, 'expected >= 0n')
				);
			});
		});

		describe('Negative', () => {
			const positivePredicate = s.bigint.negative;

			test.each([-smallInteger, -largeInteger])('GIVEN %d THEN returns given value', (input) => {
				expect(positivePredicate.parse(input)).toBe(input);
			});

			test.each([smallInteger, largeInteger])('GIVEN %d THEN throws a ConstraintError', (input) => {
				expect(() => positivePredicate.parse(input)).toThrow(
					new ConstraintError('s.bigint.lt', 'Invalid bigint value', input, 'expected < 0n')
				);
			});
		});

		describe('DivisibleBy', () => {
			const divisibleByPredicate = s.bigint.divisibleBy(5n);

			test.each([5n, 10n, 20n, 500n])('GIVEN %d THEN returns given value', (input) => {
				expect(divisibleByPredicate.parse(input)).toBe(input);
			});

			test.each([smallInteger, largeInteger, 6n])('GIVEN %d THEN throws a ConstraintError', (input) => {
				expect(() => divisibleByPredicate.parse(input)).toThrow(
					new ConstraintError('s.bigint.divisibleBy', 'BigInt is not divisible', input, 'expected % 5n === 0n')
				);
			});
		});
	});

	describe('Transformers', () => {
		describe('abs', () => {
			const absPredicate = s.bigint.abs;

			test.each([smallInteger, largeInteger, -smallInteger, -largeInteger])('GIVEN %d THEN returns transformed the result', (input) => {
				expect(absPredicate.parse(input)).toBe(input < 0 ? -input : input);
			});
		});

		describe('intN', () => {
			const absPredicate = s.bigint.intN(5);

			test.each([smallInteger, largeInteger])('GIVEN %d THEN returns transformed the result from BigInt.asIntN', (input) => {
				expect(absPredicate.parse(input)).toBe(BigInt.asIntN(5, input));
			});
		});

		describe('uintN', () => {
			const absPredicate = s.bigint.uintN(5);

			test.each([smallInteger, largeInteger])('GIVEN %d THEN returns transformed the result from BigInt.asUintN', (input) => {
				expect(absPredicate.parse(input)).toBe(BigInt.asUintN(5, input));
			});
		});

		describe('default', () => {
			const defaultPredicate = s.bigint.default(5n);
			const defaultFunctionPredicate = s.bigint.default(() => 5n);

			test.each([smallInteger, largeInteger])('GIVEN %d THEN returns the input', (input) => {
				expect(defaultPredicate.parse(input)).toBe(input);
			});

			test('GIVEN undefined THEN returns the default', () => {
				expect(defaultPredicate.parse(undefined)).toBe(5n);
			});

			test('GIVEN undefined THEN returns the output of default function', () => {
				expect(defaultFunctionPredicate.parse(undefined)).toBe(5n);
			});
		});
	});
});
