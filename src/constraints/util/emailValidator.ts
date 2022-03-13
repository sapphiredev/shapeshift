/**
 * [RFC-5322](https://datatracker.ietf.org/doc/html/rfc5322)
 * compliant {@link RegExp} to validate an email address
 *
 * @see https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression/201378#201378
 */
const accountRegex =
	/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")$/;

/**
 * Validates an email address string based on various checks:
 * - It must be a non nullish and non empty string
 * - It must include at least an `@` symbol`
 * - The account name may not exceed 64 characters
 * - The domain name may not exceed 255 characters
 * - The domain must include at least one `.` symbol
 * - Each part of the domain, split by `.` must not exceed 63 characters
 * - The email address must be [RFC-5322](https://datatracker.ietf.org/doc/html/rfc5322) compliant
 * @param email The email to validate
 * @returns `true` if the email is valid, `false` otherwise
 *
 * @remark Based on the following sources:
 * - `email-validator` by [manisharaan](https://github.com/manishsaraan) ([code](https://github.com/manishsaraan/email-validator/blob/master/index.js))
 * - [Comparing E-mail Address Validating Regular Expressions](http://fightingforalostcause.net/misc/2006/compare-email-regex.php)
 * - [Validating Email Addresses by Derrick Pallas](http://thedailywtf.com/Articles/Validating_Email_Addresses.aspx)
 * - [StackOverflow answer by bortzmeyer](http://stackoverflow.com/questions/201323/what-is-the-best-regular-expression-for-validating-email-addresses/201378#201378)
 * - [The wikipedia page on Email addresses](https://en.wikipedia.org/wiki/Email_address)
 */
export function validateEmail(email: string): boolean {
	// 1. Non-nullish and non-empty string check.
	//
	// If a nullish or empty email was provided then do an early exit
	if (!email) return false;

	// Find the location of the @ symbol:
	const atIndex = email.indexOf('@');

	// 2. @ presence check.
	//
	// If the email does not have the @ symbol, it's automatically invalid:
	if (atIndex === -1) return false;

	// 3. <account> maximum length check.
	//
	// From <account>@<domain>, if <account> exceeds 64 characters, then the
	// position of the @ symbol is 64 or greater. In this case, the email is
	// invalid:
	if (atIndex > 64) return false;

	const domainIndex = atIndex + 1;

	// 7.1. Duplicated @ symbol check.
	//
	// If there's a second @ symbol, the email is automatically invalid:
	if (email.includes('@', domainIndex)) return false;

	// 4. <domain> maximum length check.
	//
	// From <account>@<domain>, if <domain> exceeds 255 characters, then it
	// means that the amount of characters between the start of <domain> and the
	// end of the string is separated by 255 or more characters.
	if (email.length - domainIndex > 255) return false;

	// Find the location of the . symbol in <domain>:
	let dotIndex = email.indexOf('.', domainIndex);

	// 5. <domain> dot (.) symbol check.
	//
	// From <account>@<domain>, if <domain> does not contain a dot (.) symbol,
	// then it means the domain is invalid.
	if (dotIndex === -1) return false;

	// 6. <domain> parts length.
	//
	// Assign a temporary variable to store the start of the last read domain
	// part, this would be at the start of <domain>.
	//
	// For a <domain> part to be correct, it must have at most, 63 characters.
	// We repeat this step for every sub-section of <domain> contained within
	// dot (.) symbols.
	//
	// The following step is a more optimized version of the following code:
	//
	// ```javascript
	// domain.split('.').some((part) => part.length > 63);
	// ```
	let lastDotIndex = domainIndex;
	do {
		if (dotIndex - lastDotIndex > 63) return false;

		lastDotIndex = dotIndex + 1;
	} while ((dotIndex = email.indexOf('.', lastDotIndex)) !== -1);

	// 7.2. Character checks.
	//
	// From <account>@<domain>:
	// - Extract the <account> part by slicing the input from start to the @
	//   character. Validate afterwards.
	// - Extract the <domain> part by slicing the input from the start of
	//   <domain>. Validate afterwards.
	//
	// Note: we inline the variables so <domain> isn't created unless the
	//       <account> check passes.
	return accountRegex.test(email.slice(0, atIndex)) && validateEmailDomain(email.slice(domainIndex));
}

function validateEmailDomain(domain: string): boolean {
	try {
		return new URL(`http://${domain}`).hostname === domain;
	} catch {
		return false;
	}
}
