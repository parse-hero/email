// cf. https://datatracker.ietf.org/doc/html/rfc5322#section-3.3

import { either, inSequence, atLeastTimes, repeated, surroundWith, anyStringFrom } from "../combinators.ts";
import { CFWS, FWS } from "./topLevel.ts";
import { maybe, regex, str } from "parsinator";
import { DIGIT } from "./core.ts";

// date-time       =   [ day-of-week "," ] date time [CFWS]
export const date_time = () => inSequence([
	maybe(inSequence([
		day_of_week(),
		str(","),
	])),
	date(),
	time(),
	maybe(CFWS()),
]);

// day-of-week     =   ([FWS] day-name) / obs-day-of-week
export const day_of_week = () => either(
	inSequence([
		maybe(FWS()),
		day_name(),
	]),
	obs_day_of_week(),
);

/*
	day-name        =   "Mon" / "Tue" / "Wed" / "Thu" /
                       "Fri" / "Sat" / "Sun"
 */
export const day_name = () => anyStringFrom([
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
	"Sun",
] as const);

// date            =   day month year
export const date = () => inSequence([
	day(),
	month(),
	year(),
]);

// day             =   ([FWS] 1*2DIGIT FWS) / obs-day
export const day = () => either(
	inSequence([
		maybe(FWS()),
		DIGIT(),
		maybe(DIGIT()),
		FWS(),
	]),
	obs_day(),
);

/*
	month           =   "Jan" / "Feb" / "Mar" / "Apr" /
                       "May" / "Jun" / "Jul" / "Aug" /
                       "Sep" / "Oct" / "Nov" / "Dec"
 */
export const month = () => anyStringFrom([
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
] as const);

// year            =   (FWS 4*DIGIT FWS) / obs-year
export const year = () => either(
	surroundWith(
		FWS,
		repeated(DIGIT, 4),
	),
	obs_year(),
);

// time            =   time-of-day zone
export const time = () => inSequence([
	time_of_day(),
	zone(),
]);

// time-of-day     =   hour ":" minute [ ":" second ]
export const time_of_day = () => inSequence([
	hour(),
	str(":"),
	minute(),
	maybe(inSequence([
		str(":"),
		second(),
	])),
]);

// hour            =   2DIGIT / obs-hour
export const hour = () => either(
	repeated(DIGIT, 2),
	obs_hour(),
);

// minute          =   2DIGIT / obs-minute
export const minute = () => either(
	repeated(DIGIT, 2),
	obs_minute(),
);

// second          =   2DIGIT / obs-second
export const second = () => either(
	repeated(DIGIT, 2),
	obs_second(),
);

// zone            =   (FWS ( "+" / "-" ) 4DIGIT) / obs-zone
export const zone = () => either(
	inSequence([
		FWS(),
		regex(/[+-]/),
		repeated(DIGIT, 4),
	]),
	obs_zone(),
);


//// OBSOLETES

// obs-day-of-week =   [CFWS] day-name [CFWS]
export const obs_day_of_week = () => surroundWith(
	() => maybe(CFWS()),
	day_name()
);

// obs-day         =   [CFWS] 1*2DIGIT [CFWS]
export const obs_day = () => surroundWith(
	() => maybe(CFWS()),
	inSequence([
		DIGIT(),
		maybe(DIGIT()),
	])
);

// obs-year        =   [CFWS] 2*DIGIT [CFWS]
export const obs_year = () => surroundWith(
	() => maybe(CFWS()),
	atLeastTimes(DIGIT, 2),
);

// obs-hour        =   [CFWS] 2DIGIT [CFWS]
export const obs_hour = () => surroundWith(
	() => maybe(CFWS()),
	repeated(DIGIT, 2),
);

// obs-minute      =   [CFWS] 2DIGIT [CFWS]
export const obs_minute = () => surroundWith(
	() => maybe(CFWS()),
	repeated(DIGIT, 2),
);

// obs-second      =   [CFWS] 2DIGIT [CFWS]
export const obs_second = () => surroundWith(
	() => maybe(CFWS()),
	repeated(DIGIT, 2),
);

/*
	obs-zone        =   "UT" / "GMT" /     ; Universal Time
                                          ; North American UT
                                          ; offsets
                       "EST" / "EDT" /    ; Eastern:  - 5/ - 4
                       "CST" / "CDT" /    ; Central:  - 6/ - 5
                       "MST" / "MDT" /    ; Mountain: - 7/ - 6
                       "PST" / "PDT" /    ; Pacific:  - 8/ - 7
                                          ;
                       %d65-73 /          ; Military zones - "A"
                       %d75-90 /          ; through "I" and "K"
                       %d97-105 /         ; through "Z", both
                       %d107-122          ; upper and lower case
 */
export const obs_zone = () => either(
	anyStringFrom([
		"UT",
		"GMT",
		"EST",
		"EDT",
		"CST",
		"CDT",
		"MST",
		"MDT",
		"PST",
		"PDT",
	] as const),
	regex(/[\x41-\x49\x4B-\x5A\x61-\x69\x6B-\x7A]/),
);
