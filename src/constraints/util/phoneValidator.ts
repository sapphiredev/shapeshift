export const phoneNumberRegex = /^((?:\+|0{0,2})\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

export function validatePhoneNumber(input: string) {
	return phoneNumberRegex.test(input);
}
