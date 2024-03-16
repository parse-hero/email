// cf. https://datatracker.ietf.org/doc/html/rfc5234#section-5

import { regex, str } from "parsinator";
import { either, inSequence } from "../combinators.ts";

// %x0D
//  carriage return
export const CR = () => str("\r");

// %x0A
//  linefeed
export const LF = () => str("\n");

// CR LF
//  Internet standard newline
export const CRLF = () => inSequence([CR(), LF()] as const);

// %x09
//  horizontal tab
export const HTAB = () => str("\t");

// %x20
//  space
export const SP = () => str(" ");

// SP / HTAB
//  whitespace
export const WSP = () => either(SP(), HTAB());

// %x22
//  double quote
export const DQUOTE = () => str('"');

// %x30-39
//  0-9
export const DIGIT = () => regex(/\d/);


// %x41-5A / %x61-7A
export const ALPHA = () => regex(/[a-zA-Z]/);

// %x21-7E
//  visible (printing) characters
export const VCHAR = () => regex(/[\x21-\x7E]/);

// "0" / "1"
export const BIT = () => regex(/[01]/);

// %x01-7F
//  Any 7-bit US-ASCII character, excluding NUL
export const CHAR = () => regex(/[\x01-\x7F]/);

// %d0
export const NUL = () => regex(/\x00/);

// "\"
export const BACKSLASH  = () => str("\\");
