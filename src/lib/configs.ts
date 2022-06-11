let validationEnabled = true;

/**
 * Sets whether validators should run on the input, or if the input should be passed through.
 * @param enabled Whether validation should be done on inputs
 */
export function setGlobalValidationEnabled(enabled: boolean) {
	validationEnabled = enabled;
}

/**
 * @returns Whether validation is enabled
 */
export function getGlobalValidationEnabled() {
	return validationEnabled;
}
