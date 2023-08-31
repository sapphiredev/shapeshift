import type { ConstraintErrorNames } from './BaseConstraintError';

export interface BaseErrorJsonified {
	name: string;
	message: string;
}

export interface BaseConstraintErrorJsonified<T = unknown> extends BaseErrorJsonified {
	constraint: ConstraintErrorNames;
	given: T;
}

export interface ExpectedConstraintErrorJsonified<T = unknown> extends BaseConstraintErrorJsonified<T> {
	expected: string;
}

export interface ValidationErrorJsonified extends BaseErrorJsonified {
	validator: string;
	given: unknown;
}

export interface ExpectedValidationErrorJsonified<T = unknown> extends ValidationErrorJsonified {
	expected: T;
}

export interface MissingPropertyErrorJsonified extends BaseErrorJsonified {
	property: PropertyKey;
}

export interface MultiplePossibilitiesConstraintErrorJsonified<T = unknown> extends BaseConstraintErrorJsonified<T> {
	expected: readonly string[];
}

export interface UnknownEnumValueErrorJsonified extends BaseErrorJsonified {
	value: string | number;
	enumKeys: string[];
	enumMappings: readonly (readonly [string | number, string | number])[];
}

export interface UnknownEnumKeyErrorJsonified extends BaseErrorJsonified {
	property: PropertyKey;
	value: unknown;
}
