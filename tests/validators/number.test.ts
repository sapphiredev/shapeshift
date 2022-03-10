import { ExpectedConstraintError, s, ValidationError } from '../../src';
import { expectError } from '../common/macros/comparators';

const safeInteger = 42;
// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
const unsafeInteger = 242043489611808769;

describe('NumberValidator', () => {
	const predicate = s.number;

	test('GIVEN a number THEN returns a number', () => {
		expect(predicate.parse(42)).toBe(42);
	});

	test('GIVEN a non-number THEN throws ValidationError', () => {
		expectError(() => predicate.parse('Hello there'), new ValidationError('s.number', 'Expected a number primitive', 'Hello there'));
	});

	describe('Comparators', () => {
		describe('lt', () => {
			const ltPredicate = s.number.lt(42);

			test.each([10])('GIVEN %d THEN returns given value', (value) => {
				expect(ltPredicate.parse(value)).toBe(value);
			});

			test.each([42, 100])('GIVEN %d THEN throws ConstraintError', (value) => {
				expectError(
					() => ltPredicate.parse(value),
					new ExpectedConstraintError('s.number.lt', 'Invalid number value', value, 'expected < 42')
				);
			});
		});

		describe('le', () => {
			const lePredicate = s.number.le(42);

			test.each([10, 42])('GIVEN %d THEN returns given value', (input) => {
				expect(lePredicate.parse(input)).toBe(input);
			});

			test.each([100])('GIVEN %d THEN throws ConstraintError', (input) => {
				expectError(
					() => lePredicate.parse(input),
					new ExpectedConstraintError('s.number.le', 'Invalid number value', input, 'expected <= 42')
				);
			});
		});

		describe('gt', () => {
			const gtPredicate = s.number.gt(42);

			test.each([100])('GIVEN %d THEN returns given value', (value) => {
				expect(gtPredicate.parse(value)).toBe(value);
			});

			test.each([10, 42])('GIVEN %d THEN throws ConstraintError', (value) => {
				expectError(
					() => gtPredicate.parse(value),
					new ExpectedConstraintError('s.number.gt', 'Invalid number value', value, 'expected > 42')
				);
			});
		});

		describe('ge', () => {
			const gePredicate = s.number.ge(42);

			test.each([42, 100])('GIVEN %d THEN returns given value', (value) => {
				expect(gePredicate.parse(value)).toBe(value);
			});

			test.each([10])('GIVEN %d THEN throws ConstraintError', (value) => {
				expectError(
					() => gePredicate.parse(value),
					new ExpectedConstraintError('s.number.ge', 'Invalid number value', value, 'expected >= 42')
				);
			});
		});

		describe('eq', () => {
			const eqPredicate = s.number.eq(42);

			test.each([42])('GIVEN %d THEN returns given value', (value) => {
				expect(eqPredicate.parse(value)).toBe(value);
			});

			test.each([10, 100])('GIVEN %d THEN throws ConstraintError', (value) => {
				expectError(
					() => eqPredicate.parse(value),
					new ExpectedConstraintError('s.number.eq', 'Invalid number value', value, 'expected === 42')
				);
			});
		});

		describe('eq(NaN)', () => {
			const eqNanPredicate = s.number.eq(NaN);

			test.each([NaN])('GIVEN %d THEN returns given value', (input) => {
				expect(eqNanPredicate.parse(input)).toBe(input);
			});

			test.each([safeInteger, unsafeInteger, 42.1, Infinity, -Infinity])('GIVEN %d THEN throws a ConstraintError', (input) => {
				expectError(
					() => eqNanPredicate.parse(input),
					new ExpectedConstraintError('s.number.eq(NaN)', 'Invalid number value', input, 'expected === NaN')
				);
			});
		});

		describe('ne', () => {
			const nePredicate = s.number.ne(42);

			test.each([10, 100])('GIVEN %d THEN returns given value', (value) => {
				expect(nePredicate.parse(value)).toBe(value);
			});

			test.each([42])('GIVEN %d THEN throws ConstraintError', (value) => {
				expectError(
					() => nePredicate.parse(value),
					new ExpectedConstraintError('s.number.ne', 'Invalid number value', value, 'expected !== 42')
				);
			});
		});

		describe('ne(NaN)', () => {
			const neNanPredicate = s.number.ne(NaN);

			test.each([safeInteger, unsafeInteger, 42.1, Infinity, -Infinity])('GIVEN %d THEN returns given value', (input) => {
				expect(neNanPredicate.parse(input)).toBe(input);
			});

			test.each([NaN])('GIVEN %d THEN throws a ConstraintError', (input) => {
				expectError(
					() => neNanPredicate.parse(input),
					new ExpectedConstraintError('s.number.ne(NaN)', 'Invalid number value', input, 'expected !== NaN')
				);
			});
		});
	});

	describe('Constraints', () => {
		describe('Integer', () => {
			const intPredicate = s.number.int;

			test.each([safeInteger, unsafeInteger])('GIVEN %d THEN returns given value', (input) => {
				expect(intPredicate.parse(input)).toBe(input);
			});

			test.each([42.1, Infinity, NaN])('GIVEN %d THEN throws a ConstraintError', (input) => {
				expectError(
					() => intPredicate.parse(input),
					new ExpectedConstraintError('s.number.int', 'Given value is not an integer', input, 'Number.isInteger(expected) to be true')
				);
			});
		});

		describe('SafeInteger', () => {
			const safeIntPredicate = s.number.safeInt;

			test.each([safeInteger])('GIVEN %d THEN returns given value', (input) => {
				expect(safeIntPredicate.parse(input)).toBe(input);
			});

			test.each([unsafeInteger, 42.1, Infinity, NaN])('GIVEN %d THEN throws a ConstraintError', (input) => {
				expectError(
					() => safeIntPredicate.parse(input),
					new ExpectedConstraintError(
						's.number.safeInt',
						'Given value is not a safe integer',
						input,
						'Number.isSafeInteger(expected) to be true'
					)
				);
			});
		});

		describe('Positive', () => {
			const positivePredicate = s.number.positive;

			test.each([safeInteger, unsafeInteger, 42.1, Infinity])('GIVEN %d THEN returns given value', (input) => {
				expect(positivePredicate.parse(input)).toBe(input);
			});

			test.each([-safeInteger, -unsafeInteger, -42.1, -Infinity])('GIVEN %d THEN throws a ConstraintError', (input) => {
				expectError(
					() => positivePredicate.parse(input),
					new ExpectedConstraintError('s.number.ge', 'Invalid number value', input, 'expected >= 0')
				);
			});
		});

		describe('Negative', () => {
			const positivePredicate = s.number.negative;

			test.each([-safeInteger, -unsafeInteger, -42.1, -Infinity])('GIVEN %d THEN returns given value', (input) => {
				expect(positivePredicate.parse(input)).toBe(input);
			});

			test.each([safeInteger, unsafeInteger, 42.1, Infinity])('GIVEN %d THEN throws a ConstraintError', (input) => {
				expectError(
					() => positivePredicate.parse(input),
					new ExpectedConstraintError('s.number.lt', 'Invalid number value', input, 'expected < 0')
				);
			});
		});

		describe('Finite', () => {
			const finitePredicate = s.number.finite;

			test.each([safeInteger, unsafeInteger, 42.1])('GIVEN %d THEN returns given value', (input) => {
				expect(finitePredicate.parse(input)).toBe(input);
			});

			test.each([Infinity, -Infinity, NaN])('GIVEN %d THEN throws a ConstraintError', (input) => {
				expectError(
					() => finitePredicate.parse(input),
					new ExpectedConstraintError('s.number.finite', 'Given value is not finite', input, 'Number.isFinite(expected) to be true')
				);
			});
		});

		describe('DivisibleBy', () => {
			const divisibleByPredicate = s.number.divisibleBy(5);

			test.each([5, 10, 20, 500])('GIVEN %d THEN returns given value', (input) => {
				expect(divisibleByPredicate.parse(input)).toBe(input);
			});

			test.each([safeInteger, unsafeInteger, 6, 42.1, Infinity, -Infinity, NaN])('GIVEN %d THEN throws a ConstraintError', (input) => {
				expectError(
					() => divisibleByPredicate.parse(input),
					new ExpectedConstraintError('s.number.divisibleBy', 'Number is not divisible', input, 'expected % 5 === 0')
				);
			});
		});
	});

	describe('Transformers', () => {
		describe('abs', () => {
			const absPredicate = s.number.abs;

			test.each([safeInteger, unsafeInteger, 42.1, Infinity])('GIVEN %d THEN returns transformed the result from Math.abs', (input) => {
				expect(absPredicate.parse(input)).toBe(Math.abs(input));
			});
		});

		describe('sign', () => {
			const signPredicate = s.number.sign;

			test.each([safeInteger, unsafeInteger, 42.1, Infinity])('GIVEN %d THEN returns transformed the result from Math.sign', (input) => {
				expect(signPredicate.parse(input)).toBe(Math.sign(input));
			});
		});

		describe('trunc', () => {
			const truncPredicate = s.number.trunc;

			test.each([safeInteger, unsafeInteger, 42.1, Infinity])('GIVEN %d THEN returns transformed the result from Math.trunc', (input) => {
				expect(truncPredicate.parse(input)).toBe(Math.trunc(input));
			});
		});

		describe('floor', () => {
			const floorPredicate = s.number.floor;

			test.each([safeInteger, unsafeInteger, 42.1, Infinity])('GIVEN %d THEN returns transformed the result from Math.floor', (input) => {
				expect(floorPredicate.parse(input)).toBe(Math.floor(input));
			});
		});

		describe('fround', () => {
			const froundPredicate = s.number.fround;

			test.each([safeInteger, unsafeInteger, 42.1, Infinity])('GIVEN %d THEN returns transformed the result from Math.fround', (input) => {
				expect(froundPredicate.parse(input)).toBe(Math.fround(input));
			});
		});

		describe('round', () => {
			const roundPredicate = s.number.round;

			test.each([safeInteger, unsafeInteger, 42.1, Infinity])('GIVEN %d THEN returns transformed the result from Math.round', (input) => {
				expect(roundPredicate.parse(input)).toBe(Math.round(input));
			});
		});

		describe('ceil', () => {
			const ceilPredicate = s.number.ceil;

			test.each([safeInteger, unsafeInteger, 42.1, Infinity])('GIVEN %d THEN returns transformed the result from Math.ceil', (input) => {
				expect(ceilPredicate.parse(input)).toBe(Math.ceil(input));
			});
		});

		describe('default', () => {
			const defaultPredicate = s.number.default(5);
			const defaultFunctionPredicate = s.number.default(() => 5);

			test.each([safeInteger, unsafeInteger, 42.1, Infinity])('GIVEN %d THEN returns the input', (input) => {
				expect(defaultPredicate.parse(input)).toBe(input);
			});

			test('GIVEN undefined THEN returns the default', () => {
				expect(defaultPredicate.parse(undefined)).toBe(5);
			});

			test('GIVEN undefined THEN returns the output of default function', () => {
				expect(defaultFunctionPredicate.parse(undefined)).toBe(5);
			});
		});
	});
});
