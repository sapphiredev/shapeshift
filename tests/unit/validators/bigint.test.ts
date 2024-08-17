import { ExpectedConstraintError, s, ValidationError } from '../../../src';
import { expectError } from '../common/macros/comparators';

const smallInteger = 42n;
const largeInteger = 242043489611808769n;

describe.each(['custom message', undefined])('BigIntValidator (%s)', (message) => {
	const predicate = s.bigint({ message });

	test('GIVEN a bigint THEN returns a bigint', () => {
		expect(predicate.parse(42n)).toBe(42n);
	});

	test('GIVEN a non-bigint THEN throws ValidationError', () => {
		const errorMessage = message ?? 'Expected a bigint primitive';
		expectError(() => predicate.parse('Hello there'), new ValidationError('s.bigint()', errorMessage, 'Hello there'));
	});

	describe('Comparators', () => {
		describe('lessThan', () => {
			const ltPredicate = s.bigint().lessThan(42n, { message });

			test.each([10n])('GIVEN %d THEN returns given value', (value) => {
				expect(ltPredicate.parse(value)).toBe(value);
			});

			test.each([42n, 100n])('GIVEN %d THEN throws ConstraintError', (value) => {
				const errorMessage = message ?? 'Invalid bigint value';
				expectError(
					() => ltPredicate.parse(value),
					new ExpectedConstraintError('s.bigint().lessThan()', errorMessage, value, 'expected < 42n')
				);
			});
		});

		describe('lessThanOrEqual', () => {
			const lePredicate = s.bigint().lessThanOrEqual(42n, { message });

			test.each([10n, 42n])('GIVEN %d THEN returns given value', (input) => {
				expect(lePredicate.parse(input)).toBe(input);
			});

			test.each([100n])('GIVEN %d THEN throws ConstraintError', (input) => {
				const errorMessage = message ?? 'Invalid bigint value';
				expectError(
					() => lePredicate.parse(input),
					new ExpectedConstraintError('s.bigint().lessThanOrEqual()', errorMessage, input, 'expected <= 42n')
				);
			});
		});

		describe('greaterThan', () => {
			const gtPredicate = s.bigint().greaterThan(42n, { message });

			test.each([100n])('GIVEN %d THEN returns given value', (value) => {
				expect(gtPredicate.parse(value)).toBe(value);
			});

			test.each([10n, 42n])('GIVEN %d THEN throws ConstraintError', (value) => {
				const errorMessage = message ?? 'Invalid bigint value';
				expectError(
					() => gtPredicate.parse(value),
					new ExpectedConstraintError('s.bigint().greaterThan()', errorMessage, value, 'expected > 42n')
				);
			});
		});

		describe('greaterThanOrEqual', () => {
			const gePredicate = s.bigint().greaterThanOrEqual(42n, { message });

			test.each([42n, 100n])('GIVEN %d THEN returns given value', (value) => {
				expect(gePredicate.parse(value)).toBe(value);
			});

			test.each([10n])('GIVEN %d THEN throws ConstraintError', (value) => {
				const errorMessage = message ?? 'Invalid bigint value';
				expectError(
					() => gePredicate.parse(value),
					new ExpectedConstraintError('s.bigint().greaterThanOrEqual()', errorMessage, value, 'expected >= 42n')
				);
			});
		});

		describe('equal', () => {
			const eqPredicate = s.bigint().equal(42n, { message });

			test.each([42n])('GIVEN %d THEN returns given value', (value) => {
				expect(eqPredicate.parse(value)).toBe(value);
			});

			test.each([10n, 100n])('GIVEN %d THEN throws ConstraintError', (value) => {
				const errorMessage = message ?? 'Invalid bigint value';
				expectError(
					() => eqPredicate.parse(value),
					new ExpectedConstraintError('s.bigint().equal()', errorMessage, value, 'expected === 42n')
				);
			});
		});

		describe('notEqual', () => {
			const nePredicate = s.bigint().notEqual(42n, { message });

			test.each([10n, 100n])('GIVEN %d THEN returns given value', (value) => {
				expect(nePredicate.parse(value)).toBe(value);
			});

			test.each([42n])('GIVEN %d THEN throws ConstraintError', (value) => {
				const errorMessage = message ?? 'Invalid bigint value';
				expectError(
					() => nePredicate.parse(value),
					new ExpectedConstraintError('s.bigint().notEqual()', errorMessage, value, 'expected !== 42n')
				);
			});
		});
	});

	describe('Constraints', () => {
		describe('Positive', () => {
			const positivePredicate = s.bigint().positive({ message });

			test.each([smallInteger, largeInteger])('GIVEN %d THEN returns given value', (input) => {
				expect(positivePredicate.parse(input)).toBe(input);
			});

			test.each([-smallInteger, -largeInteger])('GIVEN %d THEN throws a ConstraintError', (input) => {
				const errorMessage = message ?? 'Invalid bigint value';
				expectError(
					() => positivePredicate.parse(input),
					new ExpectedConstraintError('s.bigint().greaterThanOrEqual()', errorMessage, input, 'expected >= 0n')
				);
			});
		});

		describe('Negative', () => {
			const positivePredicate = s.bigint().negative({ message });

			test.each([-smallInteger, -largeInteger])('GIVEN %d THEN returns given value', (input) => {
				expect(positivePredicate.parse(input)).toBe(input);
			});

			test.each([smallInteger, largeInteger])('GIVEN %d THEN throws a ConstraintError', (input) => {
				const errorMessage = message ?? 'Invalid bigint value';
				expectError(
					() => positivePredicate.parse(input),
					new ExpectedConstraintError('s.bigint().lessThan()', errorMessage, input, 'expected < 0n')
				);
			});
		});

		describe('DivisibleBy', () => {
			const divisibleByPredicate = s.bigint().divisibleBy(5n, { message });

			test.each([5n, 10n, 20n, 500n])('GIVEN %d THEN returns given value', (input) => {
				expect(divisibleByPredicate.parse(input)).toBe(input);
			});

			test.each([smallInteger, largeInteger, 6n])('GIVEN %d THEN throws a ConstraintError', (input) => {
				const errorMessage = message ?? 'BigInt is not divisible';
				expectError(
					() => divisibleByPredicate.parse(input),
					new ExpectedConstraintError('s.bigint().divisibleBy()', errorMessage, input, 'expected % 5n === 0n')
				);
			});
		});
	});

	describe('Transformers', () => {
		describe('abs', () => {
			const absPredicate = s.bigint().abs({ message });

			test.each([smallInteger, largeInteger, -smallInteger, -largeInteger])('GIVEN %d THEN returns transformed the result', (input) => {
				expect(absPredicate.parse(input)).toBe(input < 0 ? -input : input);
			});
		});

		describe('intN', () => {
			const intNPredicate = s.bigint().intN(5, { message });

			test.each([smallInteger, largeInteger])('GIVEN %d THEN returns transformed the result from BigInt.asIntN', (input) => {
				expect(intNPredicate.parse(input)).toBe(BigInt.asIntN(5, input));
			});
		});

		describe('uintN', () => {
			const uintNPredicate = s.bigint().uintN(5, { message });

			test.each([smallInteger, largeInteger])('GIVEN %d THEN returns transformed the result from BigInt.asUintN', (input) => {
				expect(uintNPredicate.parse(input)).toBe(BigInt.asUintN(5, input));
			});
		});

		describe('default', () => {
			const defaultPredicate = s.bigint({ message }).default(5n);
			const defaultFunctionPredicate = s.bigint({ message }).default(() => 5n);

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
