// cf. https://datatracker.ietf.org/doc/html/rfc5322#section-3.4

import { anyOf, commaSeparated1, dotSeparated1, either, inSequence, surroundWith } from "../combinators.ts";
import { many, many1, maybe, regex, str, surround } from "parsinator";
import { CFWS, FWS, quoted_pair } from "./topLevel.ts";
import { obs_NO_WS_CTL, phrase, word } from "./miscTokens.ts";
import { atom, dot_atom } from "./atom.ts";
import { quoted_string } from "./quotedStrings.ts";

// address         =   mailbox / group
export const address = () => either(
	mailbox(),
	group(),
);

// mailbox         =   name-addr / addr-spec
export const mailbox = () => either(
	name_addr(),
	addr_spec(),
);

// name-addr       =   [display-name] angle-addr
export const name_addr = () => inSequence([
	maybe(display_name()),
	angle_addr(),
]);

/*
	angle-addr      =   [CFWS] "<" addr-spec ">" [CFWS] /
                       obs-angle-addr
 */
export const angle_addr = () => either(
	surroundWith(
		() => maybe(CFWS()),
		surround(
			str("<"),
			addr_spec(),
			str(">"),
		)
	),
	obs_angle_addr()
);

// group           =   display-name ":" [group-list] ";" [CFWS]
export const group = () => inSequence([
	display_name(),
	str(":"),
	maybe(group_list()),
	str(";"),
	maybe(CFWS()),
]);

// display-name    =   phrase
export const display_name = () => phrase();

// mailbox-list    =   (mailbox *("," mailbox)) / obs-mbox-list
export const mailbox_list = () => either(
	commaSeparated1(mailbox()),
	obs_mbox_list()
);

// address-list    =   (address *("," address)) / obs-addr-list
export const address_list = () => either(
	commaSeparated1(address()),
	obs_addr_list()
);

// group-list      =   mailbox-list / CFWS / obs-group-list
export const group_list = () => anyOf([
	mailbox_list(),
	CFWS(),
	obs_group_list(),
]);

// addr-spec       =   local-part "@" domain
export const addr_spec = () => inSequence([
	local_part(),
	str("@"),
	domain(),
]);

// local-part      =   dot-atom / quoted-string / obs-local-part
export const local_part = () => anyOf([
	dot_atom(),
	quoted_string(),
	obs_local_part(),
]);

// domain          =   dot-atom / domain-literal / obs-domain
export const domain = () => anyOf([
	dot_atom(),
	domain_literal(),
	obs_domain(),
]);

// domain-literal  =   [CFWS] "[" *([FWS] dtext) [FWS] "]" [CFWS]
export const domain_literal = () => surroundWith(
	() => maybe(CFWS()),
	surround(
		str("["),
		inSequence([
			many(inSequence([
				maybe(FWS()),
				dtext(),
			])),
			maybe(FWS()),
		]),
		str("]"),
	)
);

/*
dtext           =   %d33-90 /          ; Printable US-ASCII
                       %d94-126 /         ;  characters not including
                       obs-dtext          ;  "[", "]", or "\"
 */
export const dtext = () => either(
	regex(/[\x21-\x5A\x5E-\x7E]/),
	obs_dtext()
);


//// OBSOLETES

// [CFWS] "<" obs-route addr-spec ">" [CFWS]
export const obs_angle_addr = () => surroundWith(
	() => maybe(CFWS()),
	surround(
		str("<"),
		inSequence([
			obs_route(),
			addr_spec(),
		]),
		str(">"),
	)
);

// obs-route       =   obs-domain-list ":"
export const obs_route = () => inSequence([
	obs_domain_list(),
	str(":"),
]);

/*
obs-domain-list =   *(CFWS / ",") "@" domain
                       *("," [CFWS] ["@" domain])
 */
export const obs_domain_list = () => inSequence([
	many(either(
		CFWS(),
		str(","),
	)),
	str("@"),
	domain(),
	many(inSequence([
		str(","),
		maybe(CFWS()),
		maybe(inSequence([
			str("@"),
			domain(),
		]))
	]))
]);

// obs-mbox-list   =   *([CFWS] ",") mailbox *("," [mailbox / CFWS])
export const obs_mbox_list = () => inSequence([
	many(inSequence([
		maybe(CFWS()),
		str(",")
	])),
	mailbox(),
	many(inSequence([
		str(","),
		maybe(either(
			mailbox(),
			CFWS()
		))
	])),
]);

// obs-addr-list   =   *([CFWS] ",") address *("," [address / CFWS])
export const obs_addr_list = () => inSequence([
	many(inSequence([
		maybe(CFWS()),
		str(",")
	])),
	address(),
	many(inSequence([
		str(","),
		maybe(either(
			address(),
			CFWS()
		))
	])),
]);

// obs-group-list  =   1*([CFWS] ",") [CFWS]
export const obs_group_list = () => inSequence([
	many1(inSequence([
		maybe(CFWS()),
		str(",")
	])),
	maybe(CFWS()),
]);

// obs-local-part  =   word *("." word)
export const obs_local_part = () => dotSeparated1(word());

// obs-domain      =   atom *("." atom)
export const obs_domain = () => dotSeparated1(atom());

// obs-dtext       =   obs-NO-WS-CTL / quoted-pair
export const obs_dtext = () => either(
	obs_NO_WS_CTL(),
	quoted_pair(),
);