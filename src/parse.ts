import { endOfInput, Parser, sequenceOf, startOfInput } from "arcsecond";

export const runToEnd = <T, E, D>(parser: Parser<T, E, D>, input: string) => {
	sequenceOf([
		startOfInput,
		parser as any,
		endOfInput,
	]).run(input);
};
