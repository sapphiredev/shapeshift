import { CombinedPropertyError, ExpectedConstraintError, MissingPropertyError, s, ValidationError } from '../../src';
import { expectError } from '../common/macros/comparators';

describe('LazyValidator', () => {
	const predicate = s.lazy((value) => {
		if (typeof value === 'boolean') return s.boolean.true;
		return s.string;
	});

	test.each([true, 'hello'])('GIVEN %j THEN returns the given value', (input) => {
		expect<true | string>(predicate.parse(input)).toBe(input);
	});

	test('GIVEN an invalid value THEN throw ValidationError', () => {
		expectError(() => predicate.parse(123), new ValidationError('s.string', 'Expected a string primitive', 123));
	});
});

describe('NestedLazyValidator', () => {
	const predicate = s.lazy((value) => {
		if (typeof value === 'boolean') return s.boolean.true;
		return s.lazy((value) => {
			if (typeof value === 'string') return s.string.lengthEqual(5);
			return s.number;
		});
	});

	test.each([true, 'hello', 123])('GIVEN %j THEN returns the given value', (input) => {
		expect<true | string | number>(predicate.parse(input)).toBe(input);
	});

	test('GIVEN an invalid value THEN throw ValidationError', () => {
		expectError(
			() => predicate.parse('Sapphire'),
			new ExpectedConstraintError('s.string.lengthEqual', 'Invalid string length', 'Sapphire', 'expected.length === 5')
		);
	});
});

describe('CircularLazyValidator', () => {
	// @ts-expect-error (circular)
	const predicate = s.object({
		id: s.string,
		items: s.lazy(() => predicate)
	});

	test('GIVEN circular schema THEN throw ', () => {
		expectError(
			() => predicate.parse({ id: 'Hello', items: { id: 'Hello', items: { id: 'Hello' } } }),
			new CombinedPropertyError([
				['items', new CombinedPropertyError([['items', new CombinedPropertyError([['items', new MissingPropertyError('items')]])]])]
			])
		);
	});
});
