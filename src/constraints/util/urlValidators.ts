import { ConstraintError } from '../../lib/errors/ConstraintError';
import { combinedErrorFn, ErrorFn } from './common/combinedResultFn';

export type StringProtocol = `${string}:`;

export type StringDomain = `${string}.${string}`;

export interface UrlOptions {
	allowedProtocols?: StringProtocol[];
	allowedDomains?: StringDomain[];
}

export function createUrlValidators(options?: UrlOptions) {
	const fns: ErrorFn<[input: string, url: URL], ConstraintError<string>>[] = [];

	if (options?.allowedProtocols?.length) fns.push(allowedProtocolsFn(options.allowedProtocols));
	if (options?.allowedDomains?.length) fns.push(allowedDomainsFn(options.allowedDomains));

	return combinedErrorFn(...fns);
}

function allowedProtocolsFn(allowedProtocols: StringProtocol[]) {
	const oneOf = allowedProtocols.join(', ');
	return (input: string, url: URL) =>
		allowedProtocols.includes(url.protocol as StringProtocol)
			? null
			: new ConstraintError('s.string.url', 'Invalid URL protocol', input, `expected ${url.protocol} to be one of: ${oneOf}`);
}

function allowedDomainsFn(allowedDomains: StringDomain[]) {
	const oneOf = allowedDomains.join(', ');
	return (input: string, url: URL) =>
		allowedDomains.includes(url.hostname as StringDomain)
			? null
			: new ConstraintError('s.string.url', 'Invalid URL domain', input, `expected ${url.hostname} to be one of: ${oneOf}`);
}
