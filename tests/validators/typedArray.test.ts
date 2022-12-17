import { ExpectedConstraintError, s, ValidationError } from '../../src';
import { expectClonedValidator } from '../common/macros/comparators';

describe('TypedArray', () => {
	describe('Any type of typed array', () => {
		const predicate = s.typedArray();

		test.each([
			new Int8Array(),
			new Uint8Array(),
			new Uint8ClampedArray(),
			new Int16Array(),
			new Uint16Array(),
			new Int32Array(),
			new Uint32Array(),
			new Float32Array(),
			new Float64Array(),
			new BigInt64Array(),
			new BigUint64Array()
		])('GIVEN %j THEN return the input', (input) => {
			expect(predicate.parse(input)).toBe(input);
		});

		test.each([1, true, 'sapphire'])('GIVEN %j THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray()', `Expected a TypedArray`, input));
		});
	});

	describe('Int8Array', () => {
		const predicate = s.int8Array();

		test('GIVEN typed array THEN return the input', () => {
			const typedArray = new Int8Array();
			expect(predicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([1, true, 'sapphire', new Int16Array()])('GIVEN %j THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray()', `Expected an Int8Array`, input));
		});
	});

	describe('Uint8Array', () => {
		const predicate = s.uint8Array();

		test('GIVEN typed array THEN return the input', () => {
			const typedArray = new Uint8Array();
			expect(predicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([1, true, 'sapphire', new Uint16Array()])('GIVEN %j THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray()', `Expected an Uint8Array`, input));
		});
	});

	describe('Uint8ClampedArray', () => {
		const predicate = s.uint8ClampedArray();

		test('GIVEN typed array THEN return the input', () => {
			const typedArray = new Uint8ClampedArray();
			expect(predicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([1, true, 'sapphire', new Uint16Array()])('GIVEN %j THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray()', `Expected an Uint8ClampedArray`, input));
		});
	});

	describe('Int16Array', () => {
		const predicate = s.int16Array();

		test('GIVEN typed array THEN return the input', () => {
			const typedArray = new Int16Array();
			expect(predicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([1, true, 'sapphire', new Int32Array()])('GIVEN %j THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray()', `Expected an Int16Array`, input));
		});
	});

	describe('Uint16Array', () => {
		const predicate = s.uint16Array();

		test('GIVEN typed array THEN return the input', () => {
			const typedArray = new Uint16Array();
			expect(predicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([1, true, 'sapphire', new Uint32Array()])('GIVEN %j THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray()', `Expected an Uint16Array`, input));
		});
	});

	describe('Int32Array', () => {
		const predicate = s.int32Array();

		test('GIVEN typed array THEN return the input', () => {
			const typedArray = new Int32Array();
			expect(predicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([1, true, 'sapphire', new Int16Array()])('GIVEN %j THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray()', `Expected an Int32Array`, input));
		});
	});

	describe('Uint32Array', () => {
		const predicate = s.uint32Array();

		test('GIVEN typed array THEN return the input', () => {
			const typedArray = new Uint32Array();
			expect(predicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([1, true, 'sapphire', new Uint16Array()])('GIVEN %j THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray()', `Expected an Uint32Array`, input));
		});
	});

	describe('Float32Array', () => {
		const predicate = s.float32Array();

		test('GIVEN typed array THEN return the input', () => {
			const typedArray = new Float32Array();
			expect(predicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([1, true, 'sapphire', new Float64Array()])('GIVEN %j THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray()', `Expected a Float32Array`, input));
		});
	});

	describe('Float64Array', () => {
		const predicate = s.float64Array();

		test('GIVEN typed array THEN return the input', () => {
			const typedArray = new Float64Array();
			expect(predicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([1, true, 'sapphire'])('GIVEN %j THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray()', `Expected a Float64Array`, input));
		});
	});

	describe('BigInt64Array', () => {
		const predicate = s.bigInt64Array();

		test('GIVEN typed array THEN return the input', () => {
			const typedArray = new BigInt64Array();
			expect(predicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([1, true, 'sapphire', new BigUint64Array()])('GIVEN %j THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray()', `Expected a BigInt64Array`, input));
		});
	});

	describe('BigUint64Array', () => {
		const predicate = s.bigUint64Array();

		test('GIVEN typed array THEN return the input', () => {
			const typedArray = new BigUint64Array();
			expect(predicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([1, true, 'sapphire'])('GIVEN %j THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray()', `Expected a BigUint64Array`, input));
		});
	});

	describe('lengthEqual', () => {
		const bytePredicate = s.typedArray().byteLengthEqual(10);

		test('GIVEN typed array with byte length 10 THEN return the input', () => {
			const typedArray = new Uint8Array(10);
			expect(bytePredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(5)])('GIVEN %j THEN throw', (input) => {
			expect(() => bytePredicate.parse(input)).toThrow(
				new ExpectedConstraintError(
					's.typedArray(T).byteLengthEqual()',
					'Invalid Typed Array byte length',
					input,
					'expected.byteLength === 10'
				)
			);
		});

		const lengthPredicate = s.typedArray().lengthEqual(10);

		test('GIVEN typed array with length 10 THEN return the input', () => {
			const typedArray = new Uint8Array(10);
			expect(lengthPredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(5)])('GIVEN %j THEN throw', (input) => {
			expect(() => lengthPredicate.parse(input)).toThrow(
				new ExpectedConstraintError('s.typedArray(T).lengthEqual()', 'Invalid Typed Array length', input, 'expected.length === 10')
			);
		});
	});

	describe('lengthNotEqual', () => {
		const bytePredicate = s.typedArray().byteLengthNotEqual(10);

		test.each([new Uint8Array(5), new Uint8Array(15)])('GIVEN typed array with byte length 5 THEN return the input', (input) => {
			expect(bytePredicate.parse(input)).toBe(input);
		});

		test('GIVEN a typed array of byte length 10 THEN throw', () => {
			expect(() => bytePredicate.parse(new Uint8Array(10))).toThrow(
				new ExpectedConstraintError(
					's.typedArray(T).byteLengthNotEqual()',
					'Invalid Typed Array byte length',
					new Uint8Array(10),
					'expected.byteLength !== 10'
				)
			);
		});

		const lengthPredicate = s.typedArray().lengthNotEqual(10);
		test.each([new Uint8Array(5), new Uint8Array(15)])('GIVEN typed array with length 5 THEN return the input', (input) => {
			expect(lengthPredicate.parse(input)).toBe(input);
		});

		test('GIVEN a typed array of length 10 THEN throw', () => {
			expect(() => lengthPredicate.parse(new Uint8Array(10))).toThrow(
				new ExpectedConstraintError(
					's.typedArray(T).lengthNotEqual()',
					'Invalid Typed Array length',
					new Uint8Array(10),
					'expected.length !== 10'
				)
			);
		});
	});

	describe('lengthLessThan', () => {
		const bytePredicate = s.typedArray().byteLengthLessThan(10);

		test('GIVEN typed array with byte length < 10 THEN return the input', () => {
			const typedArray = new Uint8Array(5);
			expect(bytePredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(10)])('GIVEN %j THEN throw', (input) => {
			expect(() => bytePredicate.parse(input)).toThrow(
				new ExpectedConstraintError(
					's.typedArray(T).byteLengthLessThan()',
					'Invalid Typed Array byte length',
					input,
					'expected.byteLength < 10'
				)
			);
		});

		const lengthPredicate = s.typedArray().lengthLessThan(10);

		test('GIVEN typed array with length < 10 THEN return the input', () => {
			const typedArray = new Uint8Array(5);
			expect(lengthPredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(10)])('GIVEN %j THEN throw', (input) => {
			expect(() => lengthPredicate.parse(input)).toThrow(
				new ExpectedConstraintError('s.typedArray(T).lengthLessThan()', 'Invalid Typed Array length', input, 'expected.length < 10')
			);
		});
	});

	describe('lengthLessThanOrEqual', () => {
		const bytePredicate = s.typedArray().byteLengthLessThanOrEqual(10);

		test('GIVEN typed array with byte length <= 10 THEN return the input', () => {
			const typedArray = new Uint8Array(5);
			expect(bytePredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(11)])('GIVEN %j THEN throw', (input) => {
			expect(() => bytePredicate.parse(input)).toThrow(
				new ExpectedConstraintError(
					's.typedArray(T).byteLengthLessThanOrEqual()',
					'Invalid Typed Array byte length',
					input,
					'expected.byteLength <= 10'
				)
			);
		});

		const lengthPredicate = s.typedArray().lengthLessThanOrEqual(10);

		test('GIVEN typed array with length <= 10 THEN return the input', () => {
			const typedArray = new Uint8Array(5);
			expect(lengthPredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(11)])('GIVEN %j THEN throw', (input) => {
			expect(() => lengthPredicate.parse(input)).toThrow(
				new ExpectedConstraintError('s.typedArray(T).lengthLessThanOrEqual()', 'Invalid Typed Array length', input, 'expected.length <= 10')
			);
		});
	});

	describe('lengthGreaterThan', () => {
		const bytePredicate = s.typedArray().byteLengthGreaterThan(10);

		test('GIVEN typed array with byte length > 10 THEN return the input', () => {
			const typedArray = new Uint8Array(15);
			expect(bytePredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(5)])('GIVEN %j THEN throw', (input) => {
			expect(() => bytePredicate.parse(input)).toThrow(
				new ExpectedConstraintError(
					's.typedArray(T).byteLengthGreaterThan()',
					'Invalid Typed Array byte length',
					input,
					'expected.byteLength > 10'
				)
			);
		});

		const lengthPredicate = s.typedArray().lengthGreaterThan(10);

		test('GIVEN typed array with length > 10 THEN return the input', () => {
			const typedArray = new Uint8Array(15);
			expect(lengthPredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(5)])('GIVEN %j THEN throw', (input) => {
			expect(() => lengthPredicate.parse(input)).toThrow(
				new ExpectedConstraintError('s.typedArray(T).lengthGreaterThan()', 'Invalid Typed Array length', input, 'expected.length > 10')
			);
		});
	});

	describe('lengthGreaterThanOrEqual', () => {
		const bytePredicate = s.typedArray().byteLengthGreaterThanOrEqual(10);

		test('GIVEN typed array with byte length >= 10 THEN return the input', () => {
			const typedArray = new Uint8Array(15);
			expect(bytePredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(5)])('GIVEN %j THEN throw', (input) => {
			expect(() => bytePredicate.parse(input)).toThrow(
				new ExpectedConstraintError(
					's.typedArray(T).byteLengthGreaterThanOrEqual()',
					'Invalid Typed Array byte length',
					input,
					'expected.byteLength >= 10'
				)
			);
		});

		const lengthPredicate = s.typedArray().lengthGreaterThanOrEqual(10);

		test('GIVEN typed array with length >= 10 THEN return the input', () => {
			const typedArray = new Uint8Array(15);
			expect(lengthPredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(5)])('GIVEN %j THEN throw', (input) => {
			expect(() => lengthPredicate.parse(input)).toThrow(
				new ExpectedConstraintError(
					's.typedArray(T).lengthGreaterThanOrEqual()',
					'Invalid Typed Array length',
					input,
					'expected.length >= 10'
				)
			);
		});
	});

	describe('lengthRange', () => {
		const bytePredicate = s.typedArray().byteLengthRange(10, 20);

		test('GIVEN typed array with byte length >= 10 AND <= 20 THEN return the input', () => {
			const typedArray = new Uint8Array(15);
			expect(bytePredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(5), new Uint8Array(25)])('GIVEN %j THEN throw', (input) => {
			expect(() => bytePredicate.parse(input)).toThrow(
				new ExpectedConstraintError(
					's.typedArray(T).byteLengthRange()',
					'Invalid Typed Array byte length',
					input,
					'expected.byteLength >= 10 AND <= 20'
				)
			);
		});

		const lengthPredicate = s.typedArray().lengthRange(10, 20);

		test('GIVEN typed array with length >= 10 AND <= 20 THEN return the input', () => {
			const typedArray = new Uint8Array(15);
			expect(lengthPredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(5), new Uint8Array(25)])('GIVEN %j THEN throw', (input) => {
			expect(() => lengthPredicate.parse(input)).toThrow(
				new ExpectedConstraintError('s.typedArray(T).lengthRange()', 'Invalid Typed Array length', input, 'expected.length >= 10 AND <= 20')
			);
		});
	});

	describe('LengthRangeInclusive', () => {
		const bytePredicate = s.typedArray().byteLengthRangeInclusive(10, 20);

		test('GIVEN typed array with byte length >= 10 AND <= 20 THEN return the input', () => {
			const typedArray = new Uint8Array(15);
			expect(bytePredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(5), new Uint8Array(25)])('GIVEN %j THEN throw', (input) => {
			expect(() => bytePredicate.parse(input)).toThrow(
				new ExpectedConstraintError(
					's.typedArray(T).byteLengthRangeInclusive()',
					'Invalid Typed Array byte length',
					input,
					'expected.byteLength >= 10 AND <= 20'
				)
			);
		});

		const lengthPredicate = s.typedArray().lengthRangeInclusive(10, 20);

		test('GIVEN typed array with length >= 10 AND <= 20 THEN return the input', () => {
			const typedArray = new Uint8Array(15);
			expect(lengthPredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(5), new Uint8Array(25)])('GIVEN %j THEN throw', (input) => {
			expect(() => lengthPredicate.parse(input)).toThrow(
				new ExpectedConstraintError(
					's.typedArray(T).lengthRangeInclusive()',
					'Invalid Typed Array length',
					input,
					'expected.length >= 10 AND <= 20'
				)
			);
		});
	});

	describe('LengthRangeExclusive', () => {
		const bytePredicate = s.typedArray().byteLengthRangeExclusive(10, 20);

		test('GIVEN typed array with byte length > 10 AND < 20 THEN return the input', () => {
			const typedArray = new Uint8Array(15);
			expect(bytePredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(5), new Uint8Array(25)])('GIVEN %j THEN throw', (input) => {
			expect(() => bytePredicate.parse(input)).toThrow(
				new ExpectedConstraintError(
					's.typedArray(T).byteLengthRangeExclusive()',
					'Invalid Typed Array byte length',
					input,
					'expected.byteLength > 10 AND < 20'
				)
			);
		});

		const lengthPredicate = s.typedArray().lengthRangeExclusive(10, 20);

		test('GIVEN typed array with length > 10 AND < 20 THEN return the input', () => {
			const typedArray = new Uint8Array(15);
			expect(lengthPredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(5), new Uint8Array(25)])('GIVEN %j THEN throw', (input) => {
			expect(() => lengthPredicate.parse(input)).toThrow(
				new ExpectedConstraintError(
					's.typedArray(T).lengthRangeExclusive()',
					'Invalid Typed Array length',
					input,
					'expected.length > 10 AND < 20'
				)
			);
		});
	});

	describe('Clone', () => {
		const predicate = s.typedArray().byteLengthEqual(20);

		test('GIVEN clone THEN returns similar instance', () => {
			expectClonedValidator(predicate, predicate['clone']());
		});
	});
});
