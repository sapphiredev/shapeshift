/**
 * [RFC-5322](https://datatracker.ietf.org/doc/html/rfc5322)
 * compliant {@link RegExp} to validate an email address
 *
 * @see https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression/201378#201378
 */
const validEmailRegex =
	/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

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

// TODO: refactor email validator
export function validateEmail(email: string): boolean {
	// If a nullish or empty email was provided then do an early exit
	if (!email) return false;

	// Split the email at the @ symbol
	const emailParts = email.split('@');

	// If the email didn't have at least an @ symbol then the email address is invalid
	if (emailParts.length !== 2) return false;

	// Extract the account name of the email address
	const account = emailParts[0];

	// If the account name exceeds 64 characters then the email address is invalid
	if (account.length > 64) return false;

	// Extract the domain name of the email address
	const domain = emailParts[1];

	// If the domain name exceeds 255 characters then the email address is invalid
	if (domain.length > 255) return false;

	// Split the domain on a period
	const domainParts = domain.split('.');

	// If the domain name doesn't have at least one period then the email address is invalid
	if (domainParts.length < 2) return false;

	// If any of the parts of the domain name exceed 63 characters then the email address is invalid
	if (domainParts.some((part) => part.length > 63)) return false;

	// If all the checks above have passed then validate the entire email address against the email regex
	return validEmailRegex.test(email);
}
