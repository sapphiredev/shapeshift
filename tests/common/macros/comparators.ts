import {
	CombinedError,
	CombinedPropertyError,
	ExpectedConstraintError,
	ExpectedValidationError,
	MissingPropertyError,
	MultiplePossibilitiesConstraintError,
	UnknownPropertyError,
	ValidationError,
	type BaseError,
	type BaseValidator
} from '../../../src';

export function expectClonedValidator<T>(expected: BaseValidator<T>, actual: BaseValidator<T>) {
	expect(actual).not.toBe(expected);
	expect(actual).toBeInstanceOf(expected.constructor);
}

export function expectIdenticalValidator<T>(expected: BaseValidator<T>, actual: BaseValidator<T>) {
	expectClonedValidator(expected, actual);
	expect(expected).toStrictEqual(actual);
}

export function expectModifiedClonedValidator<T>(expected: BaseValidator<T>, actual: BaseValidator<T>) {
	expectClonedValidator(expected, actual);
	expect(expected).not.toStrictEqual(actual);
}

export function expectError<T = any>(cb: () => T, expected: BaseError) {
	try {
		cb();
	} catch (error) {
		expect(error).toBeDefined();
		expectIdenticalError(error as BaseError, expected);
		return;
	}

	fail('Expected to throw, but failed to do so');
}

function expectIdenticalError(actual: BaseError, expected: BaseError) {
	expect(actual.constructor).toBe(expected.constructor);
	expect(actual.name).toBe(expected.name);
	expect(actual.message).toBe(expected.message);

	if (actual instanceof CombinedError) expectIdenticalCombinedError(actual, expected as CombinedError);
	if (actual instanceof CombinedPropertyError) expectIdenticalCombinedPropertyError(actual, expected as CombinedPropertyError);
	if (actual instanceof ExpectedValidationError) expectIdenticalExpectedValidationError(actual, expected as ExpectedValidationError<any>);
	if (actual instanceof MissingPropertyError) expectIdenticalMissingPropertyError(actual, expected as MissingPropertyError);
	if (actual instanceof UnknownPropertyError) expectIdenticalUnknownPropertyError(actual, expected as UnknownPropertyError);
	if (actual instanceof ValidationError) expectIdenticalValidationError(actual, expected as ValidationError);
	if (actual instanceof ExpectedConstraintError) expectIdenticalExpectedConstraintError(actual, expected as ExpectedConstraintError);
	if (actual instanceof MultiplePossibilitiesConstraintError) {
		expectIdenticalMultiplePossibilitiesConstraintError(actual, expected as MultiplePossibilitiesConstraintError);
	}
}

function expectIdenticalCombinedError(actual: CombinedError, expected: CombinedError) {
	expect(actual.errors).toHaveLength(expected.errors.length);
	for (let i = 0; i < actual.errors.length; ++i) {
		expectIdenticalError(actual.errors[i], expected.errors[i]);
	}
}

function expectIdenticalCombinedPropertyError(actual: CombinedPropertyError, expected: CombinedPropertyError) {
	expect(actual.errors).toHaveLength(expected.errors.length);
	for (let i = 0; i < actual.errors.length; ++i) {
		expect(actual.errors[i][0]).toBe(expected.errors[i][0]);
		expectIdenticalError(actual.errors[i][1], expected.errors[i][1]);
	}
}

function expectIdenticalExpectedConstraintError(actual: ExpectedConstraintError, expected: ExpectedConstraintError) {
	expect(actual.constraint).toBe(expected.constraint);
	expect(actual.given).toStrictEqual(expected.given);
	expect(actual.expected).toBe(expected.expected);
}

function expectIdenticalMultiplePossibilitiesConstraintError(
	actual: MultiplePossibilitiesConstraintError,
	expected: MultiplePossibilitiesConstraintError
) {
	expect(actual.constraint).toBe(expected.constraint);
	expect(actual.given).toStrictEqual(expected.given);
	expect(actual.expected).toStrictEqual(expected.expected);
}

function expectIdenticalExpectedValidationError<T = any>(actual: ExpectedValidationError<T>, expected: ExpectedValidationError<T>) {
	expect(actual.expected).toStrictEqual(expected.expected);
}

function expectIdenticalMissingPropertyError(actual: MissingPropertyError, expected: MissingPropertyError) {
	expect(actual.property).toBe(expected.property);
}

function expectIdenticalUnknownPropertyError(actual: UnknownPropertyError, expected: UnknownPropertyError) {
	expect(actual.property).toBe(expected.property);
	expect(actual.value).toStrictEqual(expected.value);
}

function expectIdenticalValidationError(actual: ValidationError, expected: ValidationError) {
	expect(actual.validator).toBe(expected.validator);
	expect(actual.given).toStrictEqual(expected.given);
}
