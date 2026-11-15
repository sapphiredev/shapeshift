import type { ConstraintErrorNames } from './BaseConstraintError';

export interface BaseErrorJsonified {
	message: string;
	name: string;
}

export interface BaseConstraintErrorJsonified<T = unknown> extends BaseErrorJsonified {
	constraint: ConstraintErrorNames;
	given: T;
}

export interface ExpectedConstraintErrorJsonified<T = unknown> extends BaseConstraintErrorJsonified<T> {
	expected: string;
}

export interface ValidationErrorJsonified extends BaseErrorJsonified {
	given: unknown;
	validator: string;
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
	enumKeys: string[];
	enumMappings: readonly (readonly [number | string, number | string])[];
	value: number | string;
}

export interface UnknownEnumKeyErrorJsonified extends BaseErrorJsonified {
	property: PropertyKey;
	value: unknown;
}
