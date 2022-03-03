import { s } from '../../src';

describe('NativeEnumValidator', () => {
	describe('string enum', () => {
		enum StringEnum {
			Hi = 'hi'
		}

		const stringPredicate = s.nativeEnum(StringEnum);

		test.each([
			['Hi', StringEnum.Hi],
			[StringEnum.Hi, StringEnum.Hi]
		])('GIVEN a key or value of a native enum (%p) THEN returns the value', (value, expected) => {
			expect<StringEnum>(stringPredicate.parse(value)).toBe(expected);
		});
	});

	describe('number enum', () => {
		enum NumberEnum {
			Vladdy,
			Kyra,
			Favna
		}
		const numberPredicate = s.nativeEnum(NumberEnum);

		test.each([
			['Vladdy', NumberEnum.Vladdy],
			[NumberEnum.Vladdy, NumberEnum.Vladdy]
		])('GIVEN a key or value of a native enum (%p) THEN returns the value', (input, expected) => {
			expect<NumberEnum>(numberPredicate.parse(input)).toBe(expected);
		});
	});

	describe('mixed enum', () => {
		enum MixedEnum {
			Sapphire = 'is awesome',
			Vladdy = 420
		}

		const mixedPredicate = s.nativeEnum(MixedEnum);

		test.each([
			['Sapphire', MixedEnum.Sapphire],
			[MixedEnum.Sapphire, MixedEnum.Sapphire],
			['Vladdy', MixedEnum.Vladdy],
			[MixedEnum.Vladdy, MixedEnum.Vladdy]
		])('GIVEN a key or value of a native enum (%p) THEN returns the value', (input, expected) => {
			expect<MixedEnum>(mixedPredicate.parse(input)).toBe(expected);
		});
	});
});
