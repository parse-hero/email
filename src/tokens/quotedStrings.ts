import { anyOf, either, inSequence, many, maybe, regex, surroundWith } from "../combinators.ts";
import { DQUOTE, obs_qtext } from "./index.ts";
import { CFWS, FWS, quoted_pair } from "./topLevel.ts";
import { join } from "../transformers.ts";

/*
	qtext           =   %d33-39 /          ; Printable US-ASCII
                       %d42-91 /          ;  characters not including
                       %d93-126 /         ;  "(", ")", or "\"
                       obs-qtext
 */
export const qtext = () => anyOf([
	regex(/^[\x21\x23-\x5B\x5D-\x7E]/),
	obs_qtext(),
]);

// qcontent        =   qtext / quoted-pair
export const qcontent = () => either(
	qtext(),
	quoted_pair(),
);

/*
	quoted-string   =   [CFWS]
                       DQUOTE *([FWS] qcontent) [FWS] DQUOTE
                       [CFWS]
 */
export const quoted_string = () => surroundWith(
	() => maybe(CFWS()),
	surroundWith(
		DQUOTE,
		inSequence([
			many(
				inSequence([
					maybe(FWS()),
					qcontent(),
				]).map(join)
			),
			maybe(FWS()),
		]).map(join)
	)
);
