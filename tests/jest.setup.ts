function fail(reason = 'Expected to throw, but failed to do so') {
	throw new Error(reason);
}

global.fail = fail;
