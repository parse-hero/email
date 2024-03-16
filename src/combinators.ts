import * as Arc from "arcsecond";
import { Parser, sequenceOf, choice, sepBy1, str, possibly } from "arcsecond";
import { join, joinBy, orEmptyString } from "./transformers.ts";

export { str, char, sepBy1, regex, recursiveParser } from "arcsecond";

export type ParserThunk<T, E = string, D = any> = () => Parser<T, E, D>;

export type ParserValue<T> = T extends Parser<infer T, unknown, unknown> ? T : never;

export const inSequence = sequenceOf;

export const anyOf = choice;

export const many = <T, E, D>(parser: Parser<T, E, D>) => Arc.many(parser as any).map(join);
export const many1 = <T, E, D>(parser: Parser<T, E, D>) => Arc.many1(parser as any).map(join);

export const maybe = <T extends string, E, D>(parser: Parser<T, E, D>) => possibly(parser).map(orEmptyString);

export const surround = <Left extends Parser<any>, Content extends Parser<any>, Right extends Parser<any>>(left: Left, content: Content, right: Right) => inSequence/*<ParserValue<Left>, ParserValue<Content>, ParserValue<Right>>*/([
	left,
	content,
	right,
]).map(join);

// @ts-ignore
/**
 * Parse content surrounded by something
 * @param surroundThunk
 * @param contentParser
 * @example
 *      surroundWith(() => str('"'), regex(/^\d/))
 *      // is the same as
 *      surround(
 *          str('"'),
 *          regex(/^\d/),
 *          str('"')
 *      )
 */
export const surroundWith = <Surround, Content>(surroundThunk: ParserThunk<Surround>, contentParser: Parser<Content>) =>
	surround(
		surroundThunk(),
		contentParser,
		surroundThunk()
	);

/**
 * Repeat a given {@link parserThunk} in sequence, {@link n} times
 * @example
 *      repeated(() => str("1"), 3)
 *      // is the sae as
 *      inSequence([str("1"), str("1"), str("1")])
 */
export const repeated = <Thunk extends ParserThunk<any>>(parserThunk: Thunk, n: number): Parser<string> => inSequence(
	Array.from(
		{ length: n },
		() => parserThunk()
	)
).map(join);

export const either = <Left extends Parser<any>, Right extends Parser<any>>(lhs: Left, rhs: Right) => anyOf<ParserValue<Left>, ParserValue<Right>>([lhs, rhs]);

const separated1 = <Sep extends string>(sep: Sep) => <P extends Parser<any>>(parser: P) => sepBy1(str(sep))(parser).map(joinBy(sep))
export const commaSeparated1 = separated1(",");
export const dotSeparated1 = separated1(".");

/**
 * Repeat a given {@link parserThunk} in sequence, at least {@link n} times
 */
export const atLeastTimes = <Thunk extends ParserThunk<any>>(parserThunk: Thunk, n: number) => inSequence([
	repeated(parserThunk, n),
	many(parserThunk()),
]).map(join);

export const anyStringFrom = <Strings extends readonly [string, ...string[]]>(strings: Strings) => anyOf(
	strings.map(string => str(string))
);
