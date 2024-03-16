// import { type Parser, many, many1, maybe, regex, str, surround } from "parsinator";
import {
	anyOf,
	char,
	either,
	inSequence,
	many,
	many1,
	maybe,
	recursiveParser,
	regex,
	surround,
} from "../combinators.ts";
import { BACKSLASH, CRLF, VCHAR, WSP } from "./core.ts";
import { obs_ctext, obs_qp } from "./miscTokens.ts";
import { Parser } from "arcsecond";
import { join } from "../transformers.ts";

/**
 * quoted-pair
 * @see https://datatracker.ietf.org/doc/html/rfc5322#section-3.2.1
 */
export const quoted_pair = () => either(
	inSequence([
		BACKSLASH(),
		either(VCHAR(), WSP()),
	]).map(join),
	obs_qp(),
);

/*
	FWS             =   ([*WSP CRLF] 1*WSP) /  obs-FWS
                                          ; Folding white space
 */
export const FWS = () => either(
	inSequence([
		maybe(
			inSequence([
				many(WSP()),
				CRLF(),
			]).map(join)
		),
		many1(WSP()),
	]).map(join),
	obs_FWS(),
);

/*
	ctext           =   %d33-39 /          ; Printable US-ASCII
                       %d42-91 /          ;  characters not including
                       %d93-126 /         ;  "(", ")", or "\"
                       obs-ctext
 */
export const ctext = () => either(
	regex(/^[\x21-\x27\x2A-\x5B\x5D-\x7E]/),
	obs_ctext(),
);

// ccontent        =   ctext / quoted-pair / comment
export const ccontent = () => recursiveParser(() => anyOf([
	ctext(),
	quoted_pair(),
	comment(),
]));

// comment         =   "(" *([FWS] ccontent) [FWS] ")"
export const comment = (): Parser<string> => recursiveParser(() => surround(
	char("("),
	inSequence([
		many(
			inSequence([
				maybe(FWS()),
				ccontent(),
			]).map(join)
		),
		maybe(FWS()),
	]).map(join),
	char(")"),
));

// CFWS            =   (1*([FWS] comment) [FWS]) / FWS
export const CFWS = () => either(
	inSequence([
		many1(
			inSequence([
				maybe(FWS()),
				comment(),
			]).map(join)
		),
		maybe(FWS()),
	]).map(join),
	FWS(),
);


// obs-FWS         =   1*WSP *(CRLF 1*WSP)
export const obs_FWS = () => inSequence([
	many1(WSP()),
	many(
		inSequence([
			CRLF(),
			many1(WSP()),
		]).map(join)
	),
]).map(join);
