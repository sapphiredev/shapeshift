import { ExpectedConstraintError, s, ValidationError } from '../../src';
import { expectError } from '../common/macros/comparators';

const smallInteger = 42n;
const largeInteger = 242043489611808769n;

describe('BigIntValidator', () => {
	const predicate = s.bigint();

	test('GIVEN a bigint THEN returns a bigint', () => {
		expect(predicate.parse(42n)).toBe(42n);
	});

	test('GIVEN a non-bigint THEN throws ValidationError', () => {
		expectError(() => predicate.parse('Hello there'), new ValidationError('s.bigint()', 'Expected a bigint primitive', 'Hello there'));
	});

	describe('Comparators', () => {
		describe('lessThan', () => {
			const ltPredicate = s.bigint().lessThan(42n);

			test.each([10n])('GIVEN %d THEN returns given value', (value) => {
				expect(ltPredicate.parse(value)).toBe(value);
			});

			test.each([42n, 100n])('GIVEN %d THEN throws ConstraintError', (value) => {
				expectError(
					() => ltPredicate.parse(value),
					new ExpectedConstraintError('s.bigint().lessThan()', 'Invalid bigint value', value, 'expected < 42n')
				);
			});
		});

		describe('lessThanOrEqual', () => {
			const lePredicate = s.bigint().lessThanOrEqual(42n);

			test.each([10n, 42n])('GIVEN %d THEN returns given value', (input) => {
				expect(lePredicate.parse(input)).toBe(input);
			});

			test.each([100n])('GIVEN %d THEN throws ConstraintError', (input) => {
				expectError(
					() => lePredicate.parse(input),
					new ExpectedConstraintError('s.bigint().lessThanOrEqual()', 'Invalid bigint value', input, 'expected <= 42n')
				);
			});
		});

		describe('greaterThan', () => {
			const gtPredicate = s.bigint().greaterThan(42n);

			test.each([100n])('GIVEN %d THEN returns given value', (value) => {
				expect(gtPredicate.parse(value)).toBe(value);
			});

			test.each([10n, 42n])('GIVEN %d THEN throws ConstraintError', (value) => {
				expectError(
					() => gtPredicate.parse(value),
					new ExpectedConstraintError('s.bigint().greaterThan()', 'Invalid bigint value', value, 'expected > 42n')
				);
			});
		});

		describe('greaterThanOrEqual', () => {
			const gePredicate = s.bigint().greaterThanOrEqual(42n);

			test.each([42n, 100n])('GIVEN %d THEN returns given value', (value) => {
				expect(gePredicate.parse(value)).toBe(value);
			});

			test.each([10n])('GIVEN %d THEN throws ConstraintError', (value) => {
				expectError(
					() => gePredicate.parse(value),
					new ExpectedConstraintError('s.bigint().greaterThanOrEqual()', 'Invalid bigint value', value, 'expected >= 42n')
				);
			});
		});

		describe('equal', () => {
			const eqPredicate = s.bigint().equal(42n);

			test.each([42n])('GIVEN %d THEN returns given value', (value) => {
				expect(eqPredicate.parse(value)).toBe(value);
			});

			test.each([10n, 100n])('GIVEN %d THEN throws ConstraintError', (value) => {
				expectError(
					() => eqPredicate.parse(value),
					new ExpectedConstraintError('s.bigint().equal()', 'Invalid bigint value', value, 'expected === 42n')
				);
			});
		});

		describe('notEqual', () => {
			const nePredicate = s.bigint().notEqual(42n);

			test.each([10n, 100n])('GIVEN %d THEN returns given value', (value) => {
				expect(nePredicate.parse(value)).toBe(value);
			});

			test.each([42n])('GIVEN %d THEN throws ConstraintError', (value) => {
				expectError(
					() => nePredicate.parse(value),
					new ExpectedConstraintError('s.bigint().notEqual()', 'Invalid bigint value', value, 'expected !== 42n')
				);
			});
		});
	});

	describe('Constraints', () => {
		describe('Positive', () => {
			const positivePredicate = s.bigint().positive();

			test.each([smallInteger, largeInteger])('GIVEN %d THEN returns given value', (input) => {
				expect(positivePredicate.parse(input)).toBe(input);
			});

			test.each([-smallInteger, -largeInteger])('GIVEN %d THEN throws a ConstraintError', (input) => {
				expectError(
					() => positivePredicate.parse(input),
					new ExpectedConstraintError('s.bigint().greaterThanOrEqual()', 'Invalid bigint value', input, 'expected >= 0n')
				);
			});
		});

		describe('Negative', () => {
			const positivePredicate = s.bigint().negative();

			test.each([-smallInteger, -largeInteger])('GIVEN %d THEN returns given value', (input) => {
				expect(positivePredicate.parse(input)).toBe(input);
			});

			test.each([smallInteger, largeInteger])('GIVEN %d THEN throws a ConstraintError', (input) => {
				expectError(
					() => positivePredicate.parse(input),
					new ExpectedConstraintError('s.bigint().lessThan()', 'Invalid bigint value', input, 'expected < 0n')
				);
			});
		});

		describe('DivisibleBy', () => {
			const divisibleByPredicate = s.bigint().divisibleBy(5n);

			test.each([5n, 10n, 20n, 500n])('GIVEN %d THEN returns given value', (input) => {
				expect(divisibleByPredicate.parse(input)).toBe(input);
			});

			test.each([smallInteger, largeInteger, 6n])('GIVEN %d THEN throws a ConstraintError', (input) => {
				expectError(
					() => divisibleByPredicate.parse(input),
					new ExpectedConstraintError('s.bigint().divisibleBy()', 'BigInt is not divisible', input, 'expected % 5n === 0n')
				);
			});
		});
	});

	describe('Transformers', () => {
		describe('abs', () => {
			const absPredicate = s.bigint().abs();

			test.each([smallInteger, largeInteger, -smallInteger, -largeInteger])('GIVEN %d THEN returns transformed the result', (input) => {
				expect(absPredicate.parse(input)).toBe(input < 0 ? -input : input);
			});
		});

		describe('intN', () => {
			const intNPredicate = s.bigint().intN(5);

			test.each([smallInteger, largeInteger])('GIVEN %d THEN returns transformed the result from BigInt.asIntN', (input) => {
				expect(intNPredicate.parse(input)).toBe(BigInt.asIntN(5, input));
			});
		});

		describe('uintN', () => {
			const uintNPredicate = s.bigint().uintN(5);

			test.each([smallInteger, largeInteger])('GIVEN %d THEN returns transformed the result from BigInt.asUintN', (input) => {
				expect(uintNPredicate.parse(input)).toBe(BigInt.asUintN(5, input));
			});
		});

		describe('default', () => {
			const defaultPredicate = s.bigint().default(5n);
			const defaultFunctionPredicate = s.bigint().default(() => 5n);

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
