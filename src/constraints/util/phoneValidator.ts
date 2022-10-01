export const phoneNumberRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

export function validatePhoneNumber(input: string) {
	return phoneNumberRegex.test(input);
}
