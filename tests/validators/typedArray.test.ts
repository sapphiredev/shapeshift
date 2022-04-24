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
		])('GIVEN %p THEN return the input', (input) => {
			expect(predicate.parse(input)).toBe(input);
		});

		test.each([1, true, 'sapphire'])('GIVEN %p THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray', `Expected a TypedArray`, input));
		});
	});

	describe('i8', () => {
		const predicate = s.i8;

		test('GIVEN typed array THEN return the input', () => {
			const typedArray = new Int8Array();
			expect(predicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([1, true, 'sapphire', new Int16Array()])('GIVEN %p THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray', `Expected a i8 array`, input));
		});
	});

	describe('u8', () => {
		const predicate = s.u8;

		test('GIVEN typed array THEN return the input', () => {
			const typedArray = new Uint8Array();
			expect(predicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([1, true, 'sapphire', new Uint16Array()])('GIVEN %p THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray', `Expected a u8 array`, input));
		});
	});

	describe('u8clamped', () => {
		const predicate = s.u8clamped;

		test('GIVEN typed array THEN return the input', () => {
			const typedArray = new Uint8ClampedArray();
			expect(predicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([1, true, 'sapphire', new Uint16Array()])('GIVEN %p THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray', `Expected a u8clamped array`, input));
		});
	});

	describe('i16', () => {
		const predicate = s.i16;

		test('GIVEN typed array THEN return the input', () => {
			const typedArray = new Int16Array();
			expect(predicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([1, true, 'sapphire', new Int32Array()])('GIVEN %p THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray', `Expected a i16 array`, input));
		});
	});

	describe('u16', () => {
		const predicate = s.u16;

		test('GIVEN typed array THEN return the input', () => {
			const typedArray = new Uint16Array();
			expect(predicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([1, true, 'sapphire', new Uint32Array()])('GIVEN %p THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray', `Expected a u16 array`, input));
		});
	});

	describe('i32', () => {
		const predicate = s.i32;

		test('GIVEN typed array THEN return the input', () => {
			const typedArray = new Int32Array();
			expect(predicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([1, true, 'sapphire', new Int16Array()])('GIVEN %p THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray', `Expected a i32 array`, input));
		});
	});

	describe('u32', () => {
		const predicate = s.u32;

		test('GIVEN typed array THEN return the input', () => {
			const typedArray = new Uint32Array();
			expect(predicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([1, true, 'sapphire', new Uint16Array()])('GIVEN %p THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray', `Expected a u32 array`, input));
		});
	});

	describe('f32', () => {
		const predicate = s.f32;

		test('GIVEN typed array THEN return the input', () => {
			const typedArray = new Float32Array();
			expect(predicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([1, true, 'sapphire', new Float64Array()])('GIVEN %p THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray', `Expected a f32 array`, input));
		});
	});

	describe('f64', () => {
		const predicate = s.f64;

		test('GIVEN typed array THEN return the input', () => {
			const typedArray = new Float64Array();
			expect(predicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([1, true, 'sapphire'])('GIVEN %p THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray', `Expected a f64 array`, input));
		});
	});

	describe('bi64', () => {
		const predicate = s.bi64;

		test('GIVEN typed array THEN return the input', () => {
			const typedArray = new BigInt64Array();
			expect(predicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([1, true, 'sapphire', new BigUint64Array()])('GIVEN %p THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray', `Expected a bi64 array`, input));
		});
	});

	describe('bu64', () => {
		const predicate = s.bu64;

		test('GIVEN typed array THEN return the input', () => {
			const typedArray = new BigUint64Array();
			expect(predicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([1, true, 'sapphire'])('GIVEN %p THEN throw', (input) => {
			expect(() => predicate.parse(input)).toThrow(new ValidationError('s.typedArray', `Expected a bu64 array`, input));
		});
	});

	describe('lengthEq', () => {
		const bytePredicate = s.typedArray().byteLengthEq(10);

		test('GIVEN typed array with byte length 10 THEN return the input', () => {
			const typedArray = new Uint8Array(10);
			expect(bytePredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(5)])('GIVEN %p THEN throw', (input) => {
			expect(() => bytePredicate.parse(input)).toThrow(
				new ExpectedConstraintError('s.typedArray(T).byteLengthEq', 'Invalid Typed Array byte length', input, 'expected.byteLength === 10')
			);
		});

		const lengthPredicate = s.typedArray().lengthEq(10);

		test('GIVEN typed array with length 10 THEN return the input', () => {
			const typedArray = new Uint8Array(10);
			expect(lengthPredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(5)])('GIVEN %p THEN throw', (input) => {
			expect(() => lengthPredicate.parse(input)).toThrow(
				new ExpectedConstraintError('s.typedArray(T).lengthEq', 'Invalid Typed Array length', input, 'expected.length === 10')
			);
		});
	});

	describe('lengthNe', () => {
		const bytePredicate = s.typedArray().byteLengthNe(10);

		test.each([new Uint8Array(5), new Uint8Array(15)])('GIVEN typed array with byte length 5 THEN return the input', (input) => {
			expect(bytePredicate.parse(input)).toBe(input);
		});

		test('GIVEN a typed array of byte length 10 THEN throw', () => {
			expect(() => bytePredicate.parse(new Uint8Array(10))).toThrow(
				new ExpectedConstraintError(
					's.typedArray(T).byteLengthNe',
					'Invalid Typed Array byte length',
					new Uint8Array(10),
					'expected.byteLength !== 10'
				)
			);
		});

		const lengthPredicate = s.typedArray().lengthNe(10);
		test.each([new Uint8Array(5), new Uint8Array(15)])('GIVEN typed array with length 5 THEN return the input', (input) => {
			expect(lengthPredicate.parse(input)).toBe(input);
		});

		test('GIVEN a typed array of length 10 THEN throw', () => {
			expect(() => lengthPredicate.parse(new Uint8Array(10))).toThrow(
				new ExpectedConstraintError('s.typedArray(T).lengthNe', 'Invalid Typed Array length', new Uint8Array(10), 'expected.length !== 10')
			);
		});
	});

	describe('lengthLt', () => {
		const bytePredicate = s.typedArray().byteLengthLt(10);

		test('GIVEN typed array with byte length < 10 THEN return the input', () => {
			const typedArray = new Uint8Array(5);
			expect(bytePredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(10)])('GIVEN %p THEN throw', (input) => {
			expect(() => bytePredicate.parse(input)).toThrow(
				new ExpectedConstraintError('s.typedArray(T).byteLengthLt', 'Invalid Typed Array byte length', input, 'expected.byteLength < 10')
			);
		});

		const lengthPredicate = s.typedArray().lengthLt(10);

		test('GIVEN typed array with length < 10 THEN return the input', () => {
			const typedArray = new Uint8Array(5);
			expect(lengthPredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(10)])('GIVEN %p THEN throw', (input) => {
			expect(() => lengthPredicate.parse(input)).toThrow(
				new ExpectedConstraintError('s.typedArray(T).lengthLt', 'Invalid Typed Array length', input, 'expected.length < 10')
			);
		});
	});

	describe('lengthLe', () => {
		const bytePredicate = s.typedArray().byteLengthLe(10);

		test('GIVEN typed array with byte length <= 10 THEN return the input', () => {
			const typedArray = new Uint8Array(5);
			expect(bytePredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(11)])('GIVEN %p THEN throw', (input) => {
			expect(() => bytePredicate.parse(input)).toThrow(
				new ExpectedConstraintError('s.typedArray(T).byteLengthLe', 'Invalid Typed Array byte length', input, 'expected.byteLength <= 10')
			);
		});

		const lengthPredicate = s.typedArray().lengthLe(10);

		test('GIVEN typed array with length <= 10 THEN return the input', () => {
			const typedArray = new Uint8Array(5);
			expect(lengthPredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(11)])('GIVEN %p THEN throw', (input) => {
			expect(() => lengthPredicate.parse(input)).toThrow(
				new ExpectedConstraintError('s.typedArray(T).lengthLe', 'Invalid Typed Array length', input, 'expected.length <= 10')
			);
		});
	});

	describe('lengthGt', () => {
		const bytePredicate = s.typedArray().byteLengthGt(10);

		test('GIVEN typed array with byte length > 10 THEN return the input', () => {
			const typedArray = new Uint8Array(15);
			expect(bytePredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(5)])('GIVEN %p THEN throw', (input) => {
			expect(() => bytePredicate.parse(input)).toThrow(
				new ExpectedConstraintError('s.typedArray(T).byteLengthGt', 'Invalid Typed Array byte length', input, 'expected.byteLength > 10')
			);
		});

		const lengthPredicate = s.typedArray().lengthGt(10);

		test('GIVEN typed array with length > 10 THEN return the input', () => {
			const typedArray = new Uint8Array(15);
			expect(lengthPredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(5)])('GIVEN %p THEN throw', (input) => {
			expect(() => lengthPredicate.parse(input)).toThrow(
				new ExpectedConstraintError('s.typedArray(T).lengthGt', 'Invalid Typed Array length', input, 'expected.length > 10')
			);
		});
	});

	describe('lengthGe', () => {
		const bytePredicate = s.typedArray().byteLengthGe(10);

		test('GIVEN typed array with byte length >= 10 THEN return the input', () => {
			const typedArray = new Uint8Array(15);
			expect(bytePredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(5)])('GIVEN %p THEN throw', (input) => {
			expect(() => bytePredicate.parse(input)).toThrow(
				new ExpectedConstraintError('s.typedArray(T).byteLengthGe', 'Invalid Typed Array byte length', input, 'expected.byteLength >= 10')
			);
		});

		const lengthPredicate = s.typedArray().lengthGe(10);

		test('GIVEN typed array with length >= 10 THEN return the input', () => {
			const typedArray = new Uint8Array(15);
			expect(lengthPredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(5)])('GIVEN %p THEN throw', (input) => {
			expect(() => lengthPredicate.parse(input)).toThrow(
				new ExpectedConstraintError('s.typedArray(T).lengthGe', 'Invalid Typed Array length', input, 'expected.length >= 10')
			);
		});
	});

	describe('lengthRange', () => {
		const bytePredicate = s.typedArray().byteLengthRange(10, 20);

		test('GIVEN typed array with byte length >= 10 AND <= 20 THEN return the input', () => {
			const typedArray = new Uint8Array(15);
			expect(bytePredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(5), new Uint8Array(25)])('GIVEN %p THEN throw', (input) => {
			expect(() => bytePredicate.parse(input)).toThrow(
				new ExpectedConstraintError(
					's.typedArray(T).byteLengthRange',
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

		test.each([new Uint8Array(5), new Uint8Array(25)])('GIVEN %p THEN throw', (input) => {
			expect(() => lengthPredicate.parse(input)).toThrow(
				new ExpectedConstraintError('s.typedArray(T).lengthRange', 'Invalid Typed Array length', input, 'expected.length >= 10 AND <= 20')
			);
		});
	});

	describe('LengthRangeInclusive', () => {
		const bytePredicate = s.typedArray().byteLengthRangeInclusive(10, 20);

		test('GIVEN typed array with byte length >= 10 AND <= 20 THEN return the input', () => {
			const typedArray = new Uint8Array(15);
			expect(bytePredicate.parse(typedArray)).toBe(typedArray);
		});

		test.each([new Uint8Array(5), new Uint8Array(25)])('GIVEN %p THEN throw', (input) => {
			expect(() => bytePredicate.parse(input)).toThrow(
				new ExpectedConstraintError(
					's.typedArray(T).byteLengthRangeInclusive',
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

		test.each([new Uint8Array(5), new Uint8Array(25)])('GIVEN %p THEN throw', (input) => {
			expect(() => lengthPredicate.parse(input)).toThrow(
				new ExpectedConstraintError(
					's.typedArray(T).lengthRangeInclusive',
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

		test.each([new Uint8Array(5), new Uint8Array(25)])('GIVEN %p THEN throw', (input) => {
			expect(() => bytePredicate.parse(input)).toThrow(
				new ExpectedConstraintError(
					's.typedArray(T).byteLengthRangeExclusive',
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

		test.each([new Uint8Array(5), new Uint8Array(25)])('GIVEN %p THEN throw', (input) => {
			expect(() => lengthPredicate.parse(input)).toThrow(
				new ExpectedConstraintError(
					's.typedArray(T).lengthRangeExclusive',
					'Invalid Typed Array length',
					input,
					'expected.length > 10 AND < 20'
				)
			);
		});
	});

	describe('Clone', () => {
		const predicate = s.typedArray().byteLengthEq(20);

		test('GIVEN clone THEN returns similar instance', () => {
			// eslint-disable-next-line @typescript-eslint/dot-notation
			expectClonedValidator(predicate, predicate['clone']());
		});
	});
});
