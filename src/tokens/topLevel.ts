import { type Parser, many, many1, maybe, regex, str, surround } from "parsinator";
import { anyOf, either, inSequence } from "../combinators.ts";
import { CRLF, VCHAR, WSP } from "./core.ts";
import { obs_ctext, obs_qp } from "./miscTokens.ts";

/**
 * quoted-pair
 * @see https://datatracker.ietf.org/doc/html/rfc5322#section-3.2.1
 */
export const quoted_pair = () => anyOf([
	inSequence([
		str("\\"),
		anyOf([VCHAR(), WSP()]),
	]),
	obs_qp(),
]);

/*
	FWS             =   ([*WSP CRLF] 1*WSP) /  obs-FWS
                                          ; Folding white space
 */
export const FWS = () => anyOf([
	inSequence([
		maybe(inSequence([
			many(WSP()),
			CRLF(),
		])),
		many1(WSP()),
	]),
	obs_FWS(),
]);

/*
	ctext           =   %d33-39 /          ; Printable US-ASCII
                       %d42-91 /          ;  characters not including
                       %d93-126 /         ;  "(", ")", or "\"
                       obs-ctext
 */
export const ctext = () => either(
	regex(/[\x21-\x27\x2A-\x5B\x5D-\x7E]/),
	obs_ctext(),
);

// ccontent        =   ctext / quoted-pair / comment
export const ccontent = (): Parser<unknown> => anyOf([
	ctext(),
	quoted_pair(),
	comment(),
]);

// comment         =   "(" *([FWS] ccontent) [FWS] ")"
export const comment = (): Parser<unknown> => surround(
	str("("),
	inSequence([
		many(inSequence([
			maybe(FWS()),
			ccontent(),
		])),
		maybe(FWS()),
	]),
	str(")"),
);

// CFWS            =   (1*([FWS] comment) [FWS]) / FWS
export const CFWS = () => either(
	inSequence([
		many1(inSequence([
			maybe(FWS()),
			comment(),
		])),
		maybe(FWS()),
	]),
	FWS(),
);


// obs-FWS         =   1*WSP *(CRLF 1*WSP)
export const obs_FWS = () => inSequence([
	many1(WSP()),
	many(inSequence([
		CRLF(),
		many1(WSP()),
	])),
]);
