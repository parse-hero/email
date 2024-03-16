import { many1, maybe, regex, sepBy1, str, surround } from "parsinator";
import { ALPHA, DIGIT, DQUOTE } from "./core.ts";
import { anyOf } from "../combinators.ts";

import { CFWS } from "./topLevel.ts";


/*
	atext           =   ALPHA / DIGIT /    ; Printable US-ASCII
                       "!" / "#" /        ;  characters not including
                       "$" / "%" /        ;  specials.  Used for atoms.
                       "&" / "'" /
                       "*" / "+" /
                       "-" / "/" /
                       "=" / "?" /
                       "^" / "_" /
                       "`" / "{" /
                       "|" / "}" /
                       "~"
*/
export const atext = () => anyOf([
	ALPHA(),
	DIGIT(),
	regex(/[!#$%&'*+/=?^_`{|}~-]/)
]);

// atom            =   [CFWS] 1*atext [CFWS]
export const atom = () => surround(
	maybe(CFWS()),
	many1(atext()),
	maybe(CFWS()),
);

/*
	dot-atom-text   =   1*atext *("." 1*atext)
 */
export const dot_atom_text = () => sepBy1(str("."), atext());

// dot-atom        =   [CFWS] dot-atom-text [CFWS]
export const dot_atom = () => surround(
	maybe(CFWS()),
	dot_atom_text(),
	maybe(CFWS()),
)

/*
	specials        =   "(" / ")" /        ; Special characters that do
                       "<" / ">" /        ;  not appear in atext
                       "[" / "]" /
                       ":" / ";" /
                       "@" / "\" /
                       "," / "." /
                       DQUOTE
 */
export const specials = () => anyOf([
	regex(/[()<>[\]:;@\\,.]/),
	DQUOTE(),
]);
