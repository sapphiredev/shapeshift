import { s, setGlobalValidationEnabled, type BaseValidator } from '../../src';

describe('Validation enabled and disabled configurations', () => {
	const stringPredicate = s.string().lengthGreaterThan(5);
	const arrayPredicate = s.array(s.string()).lengthGreaterThan(2);
	const mapPredicate = s.map(s.string(), s.number());
	const objectPredicate = s.object({
		owo: s.boolean()
	});
	const recordPredicate = s.record(s.number());
	const setPredicate = s.set(s.number());
	const tuplePredicate = s.tuple([s.string(), s.number()]);

	const predicateAndValues: [string, BaseValidator<unknown>, unknown][] = [
		//
		['string', stringPredicate, ''],
		['array', arrayPredicate, []],
		['map', mapPredicate, new Map([[0, '']])],
		['object', objectPredicate, { owo: 'string' }],
		['record', recordPredicate, { one: 'one' }],
		['set', setPredicate, new Set(['1'])],
		['tuple', tuplePredicate, [0, 'zero']]
	];

	describe('Global configurations', () => {
		beforeAll(() => {
			setGlobalValidationEnabled(false);
		});

		afterAll(() => {
			setGlobalValidationEnabled(true);
		});

		test.each(predicateAndValues)('GIVEN globally disabled %j predicate THEN returns the input', (_, inputPredicate, input) => {
			expect(inputPredicate.parse(input)).toStrictEqual(input);
		});
	});

	describe('Validator level configurations', () => {
		test.each(predicateAndValues)('GIVEN disabled %j predicate THEN returns the input', (_, inputPredicate, input) => {
			const predicate = inputPredicate.setValidationEnabled(false);

			expect(predicate.parse(input)).toStrictEqual(input);
		});

		test.each(predicateAndValues)('GIVEN function to disable %j predicate THEN returns the input', (_, inputPredicate, input) => {
			const predicate = inputPredicate.setValidationEnabled(() => false);

			expect(predicate.parse(input)).toStrictEqual(input);
		});

		test("GIVEN disabled predicate THEN checking if it's disabled should return true", () => {
			const predicate = s.string().setValidationEnabled(false);

			expect(predicate.getValidationEnabled()).toBe(false);
		});
	});

	describe('Globally disabled but locally enabled', () => {
		beforeAll(() => {
			setGlobalValidationEnabled(false);
		});

		afterAll(() => {
			setGlobalValidationEnabled(true);
		});

		test.each(predicateAndValues)(
			'GIVEN enabled %j predicate while the global option is set to false THEN it should throw validation errors',
			(_, inputPredicate, input) => {
				const predicate = inputPredicate.setValidationEnabled(true);

				expect(() => predicate.parse(input)).toThrowError();
			}
		);
	});
});
