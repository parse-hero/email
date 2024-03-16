import { Parser, choice, sequence, surround, sepBy1, str, count, many } from "parsinator";

export type ParserThunk<T> = () => Parser<T>;

export const inSequence = sequence<any>;

export const anyOf = choice<any>;

/**
 * Parse content surrounded by something
 * @param surroundThunk
 * @param contentParser
 * @example
 *      surroundWith(() => str('"'), regex(/\d/))
 *      // is the same as
 *      surround(
 *          str('"'),
 *          regex(/\d/),
 *          str('"')
 *      )
 */
export const surroundWith = <Surround, Content>(surroundThunk: ParserThunk<Surround>, contentParser: Parser<Content>) => surround(
	surroundThunk(),
	contentParser,
	surroundThunk(),
);

/**
 * Repeat a given {@link parserThunk} in sequence, {@link n} times
 * @example
 *      repeated(() => str("1"), 3)
 *      // is the sae as
 *      inSequence([str("1"), str("1"), str("1")])
 */
export const repeated = <T>(parserThunk: ParserThunk<T>, n: number) => count(n, parserThunk());

export const either = <Left, Right>(lhs: Parser<Left>, rhs: Parser<Right>) => anyOf([lhs, rhs]);

const separated1 = <Sep extends string>(sep: Sep) => <T>(parser: Parser<T>) => sepBy1(str(sep), parser)
export const commaSeparated1 = separated1(",");
export const dotSeparated1 = separated1(".");

/**
 * Repeat a given {@link parserThunk} in sequence, at least {@link n} times
 */
export const atLeastTimes = <T>(parserThunk: ParserThunk<T>, n: number) => inSequence([
	repeated(parserThunk, n),
	many(parserThunk()),
]);

export const anyStringFrom = <Strings extends readonly [string, ...string[]]>(strings: Strings) => anyOf(
	strings.map(string => str(string))
);
