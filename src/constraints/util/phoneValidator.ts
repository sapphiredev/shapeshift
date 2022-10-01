import { MultiplePossibilitiesConstraintError } from '../../lib/errors/MultiplePossibilitiesConstraintError';
import { combinedErrorFn, type ErrorFn } from './common/combinedResultFn';

export const phoneNumberRegex = /^(?:(?:\+|00)?(?<countryCode>\d{1,2})\s?)?(?<number>\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})$/;

export type CountryCode = `${'+' | '00'}${number}`;

export interface PhoneNumberOptions {
	allowedCountryCodes?: CountryCode[];
}

export interface PhoneNumber {
	countryCode: CountryCode;
	number: string;
}

export function createPhoneNumberValidators(options?: PhoneNumberOptions) {
	const fns: ErrorFn<[input: string, phoneNumber: PhoneNumber], MultiplePossibilitiesConstraintError<string>>[] = [];

	if (options?.allowedCountryCodes?.length) fns.push(allowedCountriesFn(options.allowedCountryCodes));

	return combinedErrorFn(...fns);
}

function allowedCountriesFn(allowedCountryCodes: CountryCode[]) {
	return (input: string, phoneNumber: PhoneNumber) =>
		allowedCountryCodes.includes(phoneNumber.countryCode)
			? null
			: new MultiplePossibilitiesConstraintError('s.string.phone', 'Invalid Phone number country code', input, allowedCountryCodes);
}
