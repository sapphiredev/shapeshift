import { CombinedPropertyError, ExpectedConstraintError, MissingPropertyError, ValidationError, s, type SchemaOf } from '../../../src';
import { expectError } from '../common/macros/comparators';

describe.each(['custom message', undefined])('LazyValidator (%s)', (message) => {
	const predicate = s.lazy((value) => {
		if (typeof value === 'boolean') return s.boolean().true();
		return s.string({ message });
	});

	test.each([true, 'hello'])('GIVEN %j THEN returns the given value', (input) => {
		expect<true | string>(predicate.parse(input)).toBe(input);
	});

	test('GIVEN an invalid value THEN throw ValidationError', () => {
		const errorMessage = message ?? 'Expected a string primitive';
		expectError(() => predicate.parse(123), new ValidationError('s.string()', errorMessage, 123));
	});
});

describe.each(['custom message', undefined])('NestedLazyValidator (%s)', (message) => {
	const predicate = s.lazy((value) => {
		if (typeof value === 'boolean') return s.boolean().true();
		return s.lazy((value) => {
			if (typeof value === 'string') return s.string().lengthEqual(5, { message });
			return s.number({ message });
		});
	});

	test.each([true, 'hello', 123])('GIVEN %j THEN returns the given value', (input) => {
		expect<true | string | number>(predicate.parse(input)).toBe(input);
	});

	test('GIVEN an invalid value THEN throw ValidationError', () => {
		const errorMessage = message ?? 'Invalid string length';
		expectError(
			() => predicate.parse('Sapphire'),
			new ExpectedConstraintError('s.string().lengthEqual()', errorMessage, 'Sapphire', 'expected.length === 5')
		);
	});
});

describe.each(['custom message', undefined])('CircularLazyValidator (%s)', (message) => {
	interface PredicateSchema {
		id: string;
		items: PredicateSchema;
	}

	const predicate: SchemaOf<PredicateSchema> = s.object({
		id: s.string({ message }),
		items: s.lazy<SchemaOf<PredicateSchema>>(() => predicate)
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

describe.each(['custom message', undefined])('PassingCircularLazyValidator (%s)', (message) => {
	interface PredicateSchema {
		id: string;
		items?: PredicateSchema;
	}

	const predicate: SchemaOf<PredicateSchema> = s.object({
		id: s.string({ message }),
		items: s.lazy<SchemaOf<PredicateSchema>>(() => predicate).optional({ message })
	});

	test('GIVEN circular schema THEN return given value', () => {
		expect(predicate.parse({ id: 'Sapphire', items: { id: 'Hello' } })).toStrictEqual({ id: 'Sapphire', items: { id: 'Hello' } });
	});
});
