// cf. https://datatracker.ietf.org/doc/html/rfc5234#section-5

import { char, either, inSequence, regex } from "../combinators.ts";
import { join } from "../transformers.ts";

// %x0D
//  carriage return
export const CR = () => char("\r");

// %x0A
//  linefeed
export const LF = () => char("\n");

// CR LF
//  Internet standard newline
export const CRLF = () => inSequence([CR(), LF()] as const).map(join);

// %x09
//  horizontal tab
export const HTAB = () => char("\t");

// %x20
//  space
export const SP = () => char(" ");

// SP / HTAB
//  whitespace
export const WSP = () => either(SP(), HTAB());

// DQUOTE = %x22
//  double quote
export const DQUOTE = () => char('"');

// DIGIT = %x30-39
//  0-9
export const DIGIT = () => regex(/^\d/);


// ALPHA = %x41-5A / %x61-7A
export const ALPHA = () => regex(/^[a-zA-Z]/);

// VCHAR = %x21-7E
//  visible (printing) characters
export const VCHAR = () => regex(/^[\x21-\x7E]/);

// BIT = "0" / "1"
export const BIT = () => regex(/^[01]/);

// CHAR = %x01-7F
//  Any 7-bit US-ASCII character, excluding NUL
export const CHAR = () => regex(/^[\x01-\x7F]/);

// NUL  = %d0
export const NUL = () => regex(/^\x00/);

// BACKSLASH = "\"
export const BACKSLASH  = () => char("\\");
