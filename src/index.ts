import { addr_spec } from "./tokens";
import { runToEnd } from "./parse.ts";

export interface ValidEmailOptions {
	preprocess(input: string): string;
}

const preprocessEmail = (input: string) => input.trim().toLowerCase();

export const validEmailOrFail = (maybeEmail: string, {
	preprocess = preprocessEmail,
}: Partial<ValidEmailOptions> = {}) => {
	const input = preprocess(maybeEmail);
	runToEnd(addr_spec(), input);
}

export const isValidEmail = (maybeEmail: string, opts: Partial<ValidEmailOptions> = {}) => {
	try {
		validEmailOrFail(maybeEmail, opts);
		return true
	} catch(e) {
		return false;
	}
};
