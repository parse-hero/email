import { anyOf, char, either, inSequence, many, many1, maybe, regex } from "../combinators.ts";
import { atom } from "./atom.ts";
import { quoted_string } from "./quotedStrings";
// import { many, many1, maybe, regex, str } from "parsinator";
import { CFWS, FWS } from "./topLevel.ts";
import { BACKSLASH, CR, LF, NUL, VCHAR, WSP } from "./core.ts";
import { join } from "../transformers.ts";

// word            =   atom / quoted-string
export const word = () => either(
	atom(),
	quoted_string(),
);

// phrase          =   1*word / obs-phrase
export const phrase = () => either(
	many1(word()),
	obs_phrase(),
);

// unstructured    =   (*([FWS] VCHAR) *WSP) / obs-unstruct
export const unstructured = () => either(
	inSequence([
		many(
			inSequence([
				maybe(FWS()),
				VCHAR()
			]).map(join)
		),
		many(WSP()),
	]).map(join),
	obs_unstruct(),
);

//// OBSOLETES

/*
	obs-NO-WS-CTL   =   %d1-8 /            ; US-ASCII control
                       %d11 /             ;  characters that do not
                       %d12 /             ;  include the carriage
                       %d14-31 /          ;  return, line feed, and
                       %d127              ;  white space characters
 */
export const obs_NO_WS_CTL = () => regex(/^[\x01-\x08\x11\x12\x14-\x1F\x7F]/);

// obs-utext       =   %d0 / obs-NO-WS-CTL / VCHAR
export const obs_utext = () => anyOf([
	NUL(),
	obs_NO_WS_CTL(),
	VCHAR(),
]);

// obs-qp          =   "\" (%d0 / obs-NO-WS-CTL / LF / CR)
export const obs_qp = () => inSequence([
	BACKSLASH(),
	anyOf([
		NUL(),
		obs_NO_WS_CTL(),
		LF(),
		CR(),
	]),
]).map(join);

// obs-ctext       =   obs-NO-WS-CTL
export const obs_ctext = () => obs_NO_WS_CTL();

// obs-qtext       =   obs-NO-WS-CTL
export const obs_qtext = () => obs_NO_WS_CTL();

// obs-phrase      =   word *(word / "." / CFWS)
export const obs_phrase = () => inSequence([
	word(),
	many(anyOf([
		word(),
		char("."),
		CFWS(),
	]))
]).map(join);

// obs-unstruct    =   *((*LF *CR *(obs-utext *LF *CR)) / FWS)
export const obs_unstruct = () => many(either(
	inSequence([
		many(LF()),
		many(CR()),
		many(
			inSequence([
				obs_utext(),
				many(LF()),
				many(CR()),
			]).map(join)
		)
	]).map(join),
	FWS()
));
