import { MultiplePossibilitiesConstraintError } from '../../lib/errors/MultiplePossibilitiesConstraintError';
import type { ValidatorOptions } from '../../lib/util-types';
import { combinedErrorFn, type ErrorFn } from './common/combinedResultFn';

export type StringProtocol = `${string}:`;

export type StringDomain = `${string}.${string}`;

export interface UrlOptions {
	allowedProtocols?: StringProtocol[];
	allowedDomains?: StringDomain[];
}

export function createUrlValidators(options?: UrlOptions, validatorOptions?: ValidatorOptions) {
	const fns: ErrorFn<[input: string, url: URL], MultiplePossibilitiesConstraintError<string>>[] = [];

	if (options?.allowedProtocols?.length) fns.push(allowedProtocolsFn(options.allowedProtocols, validatorOptions));
	if (options?.allowedDomains?.length) fns.push(allowedDomainsFn(options.allowedDomains, validatorOptions));

	return combinedErrorFn(...fns);
}

function allowedProtocolsFn(allowedProtocols: StringProtocol[], options?: ValidatorOptions) {
	return (input: string, url: URL) =>
		allowedProtocols.includes(url.protocol as StringProtocol)
			? null
			: new MultiplePossibilitiesConstraintError('s.string().url()', options?.message ?? 'Invalid URL protocol', input, allowedProtocols);
}

function allowedDomainsFn(allowedDomains: StringDomain[], options?: ValidatorOptions) {
	return (input: string, url: URL) =>
		allowedDomains.includes(url.hostname as StringDomain)
			? null
			: new MultiplePossibilitiesConstraintError('s.string().url()', options?.message ?? 'Invalid URL domain', input, allowedDomains);
}
