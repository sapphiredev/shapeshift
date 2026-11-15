import { expectTypeOf } from 'vitest';
import { getValue } from '../../../src/validators/util/getValue';

const resolveNullable = (value: boolean | (() => boolean) | null) => getValue(value);

describe('getValue', () => {
	test('GIVEN a value or a factory THEN returns the resolved value with its type', () => {
		const value = getValue(5);
		const resolved = getValue(() => 5);

		expect(value).toBe(5);
		expect(resolved).toBe(5);
		expectTypeOf(value).toEqualTypeOf<number>();
		expectTypeOf(resolved).toEqualTypeOf<number>();
	});

	test('GIVEN a nullable value or factory THEN preserves null and resolves false', () => {
		expect(resolveNullable(null)).toBeNull();
		expect(resolveNullable(false)).toBe(false);
		expect(resolveNullable(() => false)).toBe(false);
		expectTypeOf(resolveNullable).returns.toEqualTypeOf<boolean | null>();
	});
});
