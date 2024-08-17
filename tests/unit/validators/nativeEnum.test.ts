import { s, UnknownEnumValueError, ValidationError } from '../../../src';
import { expectClonedValidator, expectError } from '../common/macros/comparators';

describe.each(['custom message', undefined])('NativeEnumValidator (%s)', (message) => {
	describe('invalid inputs', () => {
		const predicate = s.nativeEnum({ hello: 'world' }, { message });

		test.each([true, null, undefined, {}])('GIVEN %j THEN throws ValidationError', (value) => {
			const errorMessage = message ?? 'Expected the value to be a string or number';
			expectError(() => predicate.parse(value), new ValidationError('s.nativeEnum(T)', errorMessage, value));
		});
	});

	describe('string enum', () => {
		enum StringEnum {
			Hi = 'hi'
		}

		const stringPredicate = s.nativeEnum(StringEnum, { message });

		test.each([
			['Hi', StringEnum.Hi],
			[StringEnum.Hi, StringEnum.Hi]
		])('GIVEN a key or value of a native enum (%j) THEN returns the value', (value, expected) => {
			expect<StringEnum>(stringPredicate.parse(value)).toBe(expected);
		});

		it('GIVEN a number input for a string enum THEN throws ValidationError', () => {
			const errorMessage = message ?? 'Expected the value to be a string';
			expectError(() => stringPredicate.parse(1), new ValidationError('s.nativeEnum(T)', errorMessage, 1));
		});
	});

	describe('number enum', () => {
		enum NumberEnum {
			Vladdy,
			Kyra,
			Favna
		}
		const numberPredicate = s.nativeEnum(NumberEnum, { message });

		test.each([
			['Vladdy', NumberEnum.Vladdy],
			[NumberEnum.Vladdy, NumberEnum.Vladdy]
		])('GIVEN a key or value of a native enum (%j) THEN returns the value', (input, expected) => {
			expect<NumberEnum>(numberPredicate.parse(input)).toBe(expected);
		});
	});

	describe('mixed enum', () => {
		enum MixedEnum {
			Sapphire = 'is awesome',
			Vladdy = 420
		}

		const mixedPredicate = s.nativeEnum(MixedEnum, { message });

		test.each([
			['Sapphire', MixedEnum.Sapphire],
			[MixedEnum.Sapphire, MixedEnum.Sapphire],
			['Vladdy', MixedEnum.Vladdy],
			[MixedEnum.Vladdy, MixedEnum.Vladdy]
		])('GIVEN a key or value of a native enum (%j) THEN returns the value', (input, expected) => {
			expect<MixedEnum>(mixedPredicate.parse(input)).toBe(expected);
		});
	});

	describe('valid input but invalid enum value', () => {
		const predicate = s.nativeEnum({ owo: 42 }, { message });

		test.each(['uwu', 69])('GIVEN valid type for input but not part of enum (%j) THEN throws ValidationError', (value) => {
			const errorMessage = message ?? 'Expected the value to be one of the following enum values:';
			expectError(() => predicate.parse(value), new UnknownEnumValueError(value, ['owo'], new Map([['owo', 42]]), { message: errorMessage }));
		});
	});

	test('GIVEN clone THEN returns similar instance', () => {
		const predicate = s.nativeEnum({ Example: 69 });
		// @ts-expect-error Test clone
		const clonePredicate = predicate.clone();

		expectClonedValidator(predicate, clonePredicate);
		expect(predicate.parse('Example')).toBe(69);
		expect(predicate.parse(69)).toBe(69);
	});
});
