//#region ../pebble-app/src/flowers/editions.js
var newEditions = [
	{
		id: "white-lotus",
		name: "White Lotus",
		zh: "白荷",
		title: "Moonlit Lotus",
		colors: [
			"#f4f5e7",
			"#b5d4cb",
			"#4f8f87"
		],
		accent: "#39786d",
		note: "Pearl-to-teal plumage and an upright lotus fan above a still pond.",
		scene: [
			"#8aa6ba",
			"#bdcedb",
			"#7ea9a2"
		],
		night: [
			"#142b3e",
			"#244957",
			"#345f62"
		]
	},
	{
		id: "tree-peony",
		name: "Tree Peony",
		zh: "牡丹",
		title: "Peony Courtyard",
		colors: [
			"#401e4a",
			"#782752",
			"#c06991"
		],
		accent: "#9a3b65",
		note: "Deep mulberry plumage and a full magenta peony in a moon-gate courtyard.",
		scene: [
			"#f4dfd9",
			"#f8efdf",
			"#b4bc9c"
		],
		night: [
			"#32243d",
			"#583b50",
			"#775866"
		]
	},
	{
		id: "magnolia",
		name: "Magnolia",
		zh: "玉兰",
		title: "Magnolia After Rain",
		colors: [
			"#f8f5f3",
			"#dfd6eb",
			"#a59dbc"
		],
		accent: "#776a9c",
		note: "Porcelain-lilac plumage and sculpted ivory magnolia cups after rain.",
		scene: [
			"#94a8bb",
			"#becbd5",
			"#b5c0ca"
		],
		night: [
			"#242b49",
			"#3b4860",
			"#646c82"
		]
	},
	{
		id: "orchid",
		name: "Orchid",
		zh: "兰花",
		title: "Orchid Rain",
		colors: [
			"#cee0d9",
			"#6d9e94",
			"#315e61"
		],
		accent: "#4a786b",
		note: "Ink-jade plumage, a slender orchid spray, and long ribbon leaves.",
		scene: [
			"#9eaf98",
			"#c2cfb3",
			"#9db5a1"
		],
		night: [
			"#182e2b",
			"#2a4842",
			"#4a645a"
		]
	},
	{
		id: "osmanthus",
		name: "Osmanthus",
		zh: "桂花",
		title: "Osmanthus Moon",
		colors: [
			"#fff0ce",
			"#e7c57d",
			"#b18b51"
		],
		accent: "#9a702c",
		note: "Honey-gold plumage and tiny four-petal clusters under an autumn moon.",
		scene: [
			"#aebfa8",
			"#d0dbc2",
			"#c2ab78"
		],
		night: [
			"#302a36",
			"#57434a",
			"#8b6a49"
		]
	},
	{
		id: "crabapple",
		name: "Flowering Crabapple",
		zh: "海棠",
		title: "Crabapple Dawn",
		colors: [
			"#fff1d9",
			"#efbd9e",
			"#cf846f"
		],
		accent: "#a55578",
		note: "Apricot plumage and a hanging coral bud spray beside a dawn-lit lattice.",
		scene: [
			"#bda6b6",
			"#dec8d0",
			"#c0b49b"
		],
		night: [
			"#34263e",
			"#5f3c55",
			"#7f6175"
		]
	},
	{
		id: "peony",
		name: "Peony",
		zh: "芍药",
		title: "Dew-kissed Peony",
		colors: [
			"#eee0ef",
			"#c6a0c8",
			"#8e658f"
		],
		accent: "#ac4f72",
		note: "Dusty mauve plumage and a wide, open blush bloom with a golden heart.",
		scene: [
			"#adbfba",
			"#d0dbd0",
			"#aeb9ac"
		],
		night: [
			"#322c45",
			"#514359",
			"#78637b"
		]
	},
	{
		id: "spider-lily",
		name: "Red Spider Lily",
		zh: "彼岸花",
		title: "Crimson Dusk",
		colors: [
			"#1f2948",
			"#343c66",
			"#666084"
		],
		accent: "#aa3b50",
		note: "Midnight-indigo plumage and fine crimson curls above a misty dusk river.",
		scene: [
			"#c3b7c3",
			"#e5c6c4",
			"#8a7484"
		],
		night: [
			"#171c30",
			"#35283e",
			"#603b51"
		]
	}
];
var firstScenes = {
	"plum-blossom": {
		title: "Plum Blossom in Snow",
		scene: [
			"#aaa6bf",
			"#dad1df",
			"#bcc7d5"
		],
		night: [
			"#202e47",
			"#3a506e",
			"#78899f"
		]
	},
	jasmine: {
		title: "Jasmine Morning",
		scene: [
			"#97b0ae",
			"#c4d5cd",
			"#9eb8a0"
		],
		night: [
			"#202e30",
			"#354846",
			"#65806a"
		]
	},
	camellia: {
		title: "Camellia Garden",
		scene: [
			"#e8d8d6",
			"#f6e9df",
			"#9cb5a4"
		],
		night: [
			"#282a38",
			"#4d3848",
			"#79505d"
		]
	}
};
//#endregion
//#region ../pebble-app/src/flowers/catalog.js
var flowers = [
	{
		id: "plum-blossom",
		name: "Plum Blossom",
		zh: "梅花",
		colors: [
			"#edf5f7",
			"#bdd7e4",
			"#7094b7"
		],
		accent: "#a34767",
		note: "Icy blue plumage, a pink five-petal branch, and fresh winter snow."
	},
	{
		id: "jasmine",
		name: "Jasmine",
		zh: "茉莉",
		colors: [
			"#fff8df",
			"#e4e9bd",
			"#9cb982"
		],
		accent: "#507554",
		note: "Warm cream plumage and a trailing spray of small white jasmine flowers."
	},
	{
		id: "camellia",
		name: "Camellia",
		zh: "山茶",
		colors: [
			"#842d31",
			"#bd4c49",
			"#ee9478"
		],
		accent: "#a4384d",
		note: "Terracotta plumage, a compact coral rosette, and glossy evergreen leaves."
	},
	...newEditions
].map((f) => ({
	...firstScenes[f.id],
	...f
}));
//#endregion
//#region ../pebble-app/src/flowers/edition-art.js
var isNewEdition = (id) => newEditions.some((f) => f.id === id);
var palette = {
	"white-lotus": [
		"#ffffff",
		"#fff6ef",
		"#d9b8cb"
	],
	"tree-peony": [
		"#ffb4c5",
		"#dc4b87",
		"#851b57"
	],
	magnolia: [
		"#ffffff",
		"#f7f0ed",
		"#bba3c4"
	],
	orchid: [
		"#fff9e8",
		"#d7c8e5",
		"#997fae"
	],
	osmanthus: [
		"#fff4b2",
		"#f1c25b",
		"#ca8b35"
	],
	crabapple: [
		"#fff6df",
		"#f5ad9e",
		"#d76c72"
	],
	peony: [
		"#fff0e8",
		"#f4b4c1",
		"#cf729a"
	],
	"spider-lily": [
		"#ffb49c",
		"#e34e61",
		"#962742"
	]
};
function editionDefs(uid, id) {
	const c = palette[id];
	return `<radialGradient id="${uid}-petal" cx="34%" cy="18%" r="90%"><stop stop-color="${c[0]}"/><stop offset=".53" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></radialGradient><linearGradient id="${uid}-fold" x2=".8" y2="1"><stop stop-color="${c[2]}"/><stop offset=".43" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[0]}"/></linearGradient>`;
}
var group = (x, y, r, s, art) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">${art}</g>`;
var leaf$2 = (uid, x, y, r, s = 1) => group(x, y, r, s, `<path d="M0 0C-39-31-38-70 2-106C35-69 32-21 0 0Z" fill="url(#${uid}-leaf)"/><path d="M0-9V-86" stroke="#d1deb7" stroke-width="2" opacity=".4"/>`);
var pollen = (uid, n = 13, r = 15) => Array.from({ length: n }, (_, i) => {
	const a = i / n * Math.PI * 2, x = Math.sin(a) * r, y = Math.cos(a) * r;
	return `<path d="M0 0L${x} ${y}" stroke="#f8d9a2" stroke-width="1.4"/><circle cx="${x}" cy="${y}" r="2.6" fill="url(#${uid}-gold)"/>`;
}).join("");
function petals$1(uid, n, d, r = 0, s = 1) {
	return Array.from({ length: n }, (_, i) => group(0, 0, i * 360 / n + r, s, `<path d="${d}" fill="url(#${uid}-petal)"/>`)).join("");
}
function editionBloom(uid, id, x = 0, y = 0, s = 1, r = 0) {
	let art = "";
	if (id === "white-lotus") art = `<path d="M-73 34Q0 2 73 34Q0 62-73 34Z" fill="url(#${uid}-leaf)"/>` + [
		-66,
		-43,
		-22,
		0,
		22,
		43,
		66
	].map((angle, i) => group(0, 27, angle, i === 3 ? 1 : .89, `<path d="M0 7C-29-13-29-48 0-94C29-48 29-13 0 7Z" fill="url(#${uid}-petal)"/><path d="M0-4Q-6-34 0-69" stroke="#d7b7c4" stroke-width="1.1" fill="none" opacity=".28"/>`)).join("") + `<ellipse cy="29" rx="26" ry="8" fill="url(#${uid}-gold)"/>`;
	if (id === "magnolia") art = [
		{
			r: -64,
			s: .9
		},
		{
			r: 61,
			s: .9
		},
		{
			r: -31,
			s: 1
		},
		{
			r: 30,
			s: 1
		},
		{
			r: 0,
			s: .9
		}
	].map((k) => group(0, 22, k.r, k.s, `<path d="M0 8C-34-17-41-66-8-96C15-105 37-64 26-37C21-17 9 0 0 8Z" fill="url(#${uid}-petal)"/><path d="M0 5Q-12-25-7-56" stroke="#ba8ea8" opacity=".32" stroke-width="3" fill="none"/>`)).join("") + `<ellipse cy="16" rx="9" ry="17" fill="url(#${uid}-gold)"/>`;
	if (id === "peony") art = `<g transform="scale(1.16 .84)">${petals$1(uid, 7, "M0 15C-30 9-57-11-53-32C-67-46-50-67-34-64C-32-81-9-83 1-69C18-82 40-74 40-59C62-62 66-36 47-25C40-3 16 2 0 15Z", 8)}${petals$1(uid, 6, "M0 11C-25 8-45-9-42-29C-48-45-28-60-13-53C4-69 31-55 32-37C45-20 24 0 0 11Z", 35, .69)}</g><ellipse rx="25" ry="19" fill="url(#${uid}-gold)"/>${pollen(uid, 23, 21)}<g fill="#fffef7" opacity=".8"><ellipse cx="-47" cy="-23" rx="4" ry="5"/><circle cx="30" cy="-42" r="3"/></g>`;
	if (id === "tree-peony") {
		const rich = id === "tree-peony";
		art = [
			{
				n: rich ? 10 : 8,
				s: 1,
				a: 0
			},
			{
				n: 8,
				s: .78,
				a: 18
			},
			{
				n: 7,
				s: .55,
				a: 2
			},
			{
				n: 6,
				s: .34,
				a: 26
			}
		].map((k, j) => petals$1(uid, k.n, rich ? "M0 16C-23 7-52-12-50-38C-59-51-42-71-27-69C-13-87 3-73 13-72C34-80 55-61 48-39C52-17 18-2 0 16Z" : "M0 15C-30 9-57-11-53-32C-67-46-50-67-34-64C-32-81-9-83 1-69C18-82 40-74 40-59C62-62 66-36 47-25C40-3 16 2 0 15Z", k.a, k.s) + `<circle r="${2 + j}" fill="${rich ? "#e776a0" : "#f2b4bf"}"/>`).join("") + pollen(uid, 9, 9);
		if (!rich) art += `<g fill="#fffef7" opacity=".8"><ellipse cx="-39" cy="-25" rx="4" ry="5"/><circle cx="26" cy="-48" r="3"/></g>`;
	}
	if (id === "orchid") art = [
		[-70, .9],
		[70, .9],
		[-145, .72],
		[145, .72],
		[0, 1]
	].map(([a, k]) => group(0, 0, a, k, `<path d="M0 8C-25-8-35-48 0-91C32-51 18-17 0 8Z" fill="url(#${uid}-petal)"/><path d="M0-4Q-6-37 0-69" stroke="#af88b1" stroke-width="2" opacity=".35" fill="none"/>`)).join("") + `<path d="M-17-6Q0-20 17-6L27 25Q16 52 0 37Q-16 52-27 25Z" fill="url(#${uid}-fold)"/><path d="M-8 4Q0 25 8 4" stroke="#efc97f" stroke-width="9" stroke-linecap="round" fill="none"/><g fill="#a25b94"><circle cx="-9" cy="24" r="2"/><circle cy="28" r="2"/><circle cx="9" cy="24" r="2"/></g>`;
	if (id === "osmanthus") art = petals$1(uid, 4, "M0 5C-18-2-22-17-13-27C-4-36 15-31 17-19C19-9 7-1 0 5Z", 20) + `<circle r="5" fill="#b88039"/>`;
	if (id === "crabapple") art = petals$1(uid, 5, "M0 5C-14 1-33-15-30-35C-30-52-10-59 1-48C13-58 31-43 27-28C22-13 10-5 0 5Z", 12) + `<circle r="12" fill="#ce729f"/>` + pollen(uid, 12, 17);
	if (id === "spider-lily") art = Array.from({ length: 6 }, (_, i) => group(0, 0, i * 60, 1, `<path d="M0 12C-14-9-60-27-54-57C-48-85-15-96-10-78C-25-89-42-70-37-56C-28-35-3-28 0 12Z" fill="url(#${uid}-petal)"/>`)).join("") + Array.from({ length: 12 }, (_, i) => group(0, 0, i * 30 + 8, 1, `<path d="M0 6C22-10 90-12 78-77" fill="none" stroke="#ce3b54" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="78" cy="-77" rx="3.4" ry="2.2" fill="#efba80"/>`)).join("") + `<circle r="7" fill="#f2a18f"/>`;
	return group(x, y, r, s, `<g filter="url(#${uid}-soft-shadow)">${art}</g>`);
}
function editionArrangement(uid, id) {
	if (id === "white-lotus") return `${leaf$2(uid, 29, 26, 79, .76)}${editionBloom(uid, id, 0, 3, .95, -5)}`;
	if (id === "magnolia") return `<path d="M-45 44Q-8 24 39-40" fill="none" stroke="#876474" stroke-width="8" stroke-linecap="round"/>${editionBloom(uid, id, 0, 4, .9, 15)}${leaf$2(uid, -26, 33, -54, .47)}`;
	if (id === "orchid") return `<path d="M-25 46Q-95-16-76-85Q-59-16-25 46M-18 41Q-20-47 24-91Q-10-14-18 41" fill="url(#${uid}-leaf)"/>${editionBloom(uid, id, 3, -8, .8, 19)}${editionBloom(uid, id, -36, 35, .39, -24)}`;
	if (id === "osmanthus") return `${leaf$2(uid, -17, 19, -58, .73)}${leaf$2(uid, 21, 17, 49, .7)}${leaf$2(uid, 12, 29, 115, .51)}${[
		[
			-28,
			-21,
			.67
		],
		[
			9,
			-36,
			.61
		],
		[
			34,
			-8,
			.68
		],
		[
			-7,
			0,
			.78
		],
		[
			-36,
			16,
			.56
		],
		[
			9,
			35,
			.62
		],
		[
			38,
			28,
			.49
		]
	].map(([x, y, k]) => editionBloom(uid, id, x, y, k, x)).join("")}`;
	if (id === "crabapple") return `<path d="M-36-27Q-4-2-24 71M-10 3Q30 15 38 46M-18 42Q-53 40-51 64" fill="none" stroke="#8a6259" stroke-width="5" stroke-linecap="round"/>${leaf$2(uid, -20, -4, -44, .52)}${leaf$2(uid, 4, 13, 53, .41)}${editionBloom(uid, id, -18, -14, .68, -16)}${editionBloom(uid, id, 19, 24, .44, 20)}<g fill="url(#${uid}-petal)"><ellipse cx="-24" cy="72" rx="12" ry="18"/><ellipse cx="38" cy="49" rx="11" ry="16"/><ellipse cx="-51" cy="66" rx="8" ry="12"/></g><g fill="#6d8052"><path d="M-35 60-24 66-14 60-24 56Z"/><path d="M28 39 38 44 48 39 38 35Z"/></g>`;
	if (id === "peony") return `${leaf$2(uid, -26, 20, -66, .64)}${leaf$2(uid, 30, 17, 63, .63)}${editionBloom(uid, id, 0, 0, 1, -9)}`;
	if (id === "spider-lily") return `<path d="M-18 40Q-5 9 2-11" fill="none" stroke="#759075" stroke-width="6"/>${editionBloom(uid, id, 0, -4, .94, 4)}`;
	return `${leaf$2(uid, -25, 15, -63, .76)}${leaf$2(uid, 25, 9, 49, .71)}${leaf$2(uid, 34, 28, 99, .49)}${editionBloom(uid, id, 0, 0, id === "peony" ? .91 : .94, id === "peony" ? -9 : 8)}`;
}
function editionPlacement(id, icon = false) {
	const fit = {
		"white-lotus": [
			837,
			315,
			-8,
			1.18,
			184,
			42,
			-8,
			.37
		],
		"tree-peony": [
			830,
			313,
			-12,
			1.28,
			181,
			42,
			-12,
			.4
		],
		magnolia: [
			844,
			321,
			-10,
			1.14,
			185,
			44,
			-8,
			.37
		],
		orchid: [
			392,
			358,
			-28,
			1.13,
			45,
			33,
			-28,
			.35
		],
		osmanthus: [
			847,
			316,
			-12,
			1.25,
			185,
			42,
			-12,
			.4
		],
		crabapple: [
			382,
			355,
			-10,
			1.4,
			40,
			33,
			-10,
			.44
		],
		peony: [
			402,
			360,
			-16,
			1.16,
			48,
			34,
			-16,
			.37
		],
		"spider-lily": [
			843,
			290,
			-12,
			1,
			184,
			37,
			-12,
			.28
		]
	}[id];
	const [x, y, r, s] = icon ? fit.slice(4) : fit;
	return `translate(${x} ${y}) rotate(${r}) scale(${s})`;
}
//#endregion
//#region ../pebble-app/src/flowers/soft-flowers.js
function softFlowerDefs(uid) {
	const radial = (name, a, b, c) => `<radialGradient id="${uid}-${name}" cx="35%" cy="24%" r="86%"><stop stop-color="${a}"/><stop offset=".54" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></radialGradient>`;
	return `${radial("plum", "#fff1ed", "#efafbd", "#bd6488")}${radial("plum-inner", "#fff7ef", "#ffc9cc", "#df819e")}${radial("jasmine", "#ffffff", "#fffdf0", "#cbd7ba")}${radial("jasmine-inner", "#ffffff", "#fffef6", "#e7e9d6")}${radial("camellia", "#ffd0ad", "#ee775f", "#b83b39")}${radial("camellia-inner", "#ffe5c4", "#f6a583", "#d35846")}${radial("leaf", "#a9c59a", "#527e59", "#264e40")}${radial("bud", "#ffd9dc", "#d77b9e", "#994c70")}${radial("gold", "#fff4bd", "#ecc36f", "#c99346")}
 <filter id="${uid}-soft-shadow" x="-35%" y="-35%" width="170%" height="180%" color-interpolation-filters="sRGB"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#503646" flood-opacity=".16"/></filter>`;
}
function leaf$1(uid, x, y, angle, scale = 1) {
	return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})"><path d="M0 4C-37-19-38-57-8-94C-2-100 3-109 4-116C43-67 42-26 0 4Z" fill="url(#${uid}-leaf)"/><path d="M0-7Q9-51 4-99" stroke="#d7e4b4" stroke-width="2.5" opacity=".45" fill="none" stroke-linecap="round"/><path d="M6-47Q-4-68-18-75" stroke="#dae7bc" stroke-width="1.6" opacity=".22" fill="none"/></g>`;
}
function stamens(uid, n, r) {
	return `<g>${Array.from({ length: n }, (_, i) => {
		const a = i / n * Math.PI * 2, x = Math.sin(a) * r, y = Math.cos(a) * r;
		return `<path d="M0 1Q${x * .7} ${y * .35} ${x} ${y}" stroke="#ffe9ba" stroke-width="1.6" fill="none"/><circle cx="${x}" cy="${y}" r="2.8" fill="url(#${uid}-gold)"/>`;
	}).join("")}<circle r="4" fill="#edc487"/></g>`;
}
function softBloom(uid, kind, x, y, scale = 1, angle = 0) {
	let petals = "";
	if (kind === "plum-blossom") petals = Array.from({ length: 5 }, (_, i) => `<g transform="rotate(${i * 72 + [
		0,
		3,
		-3,
		4,
		-2
	][i]})"><path d="M0 8C-12-2-31-15-29-35C-28-58 3-63 18-48C31-34 24-13 0 8Z" fill="url(#${uid}-plum)"/><path d="M-23-36C-24-49-7-56 5-52" fill="none" stroke="#fff2eb" stroke-width="3" opacity=".65" stroke-linecap="round"/><path d="M0 4Q-6-14-10-27" fill="none" stroke="#be6c8b" stroke-width="1.4" opacity=".18"/></g>`).join("") + stamens(uid, 12, 19);
	else if (kind === "jasmine") petals = [{
		n: 7,
		s: 1,
		offset: 0
	}, {
		n: 5,
		s: .59,
		offset: 23
	}].map((layer, j) => Array.from({ length: layer.n }, (_, i) => `<g transform="rotate(${i * 360 / layer.n + layer.offset}) scale(${layer.s})"><path d="M0 8C-20-1-27-24-19-43C-15-54-5-60 3-65C20-58 29-40 22-23C17-10 7-6 0 8Z" fill="url(#${uid}-${j ? "jasmine-inner" : "jasmine"})"/><path d="M1 0Q-8-20 0-47" fill="none" stroke="#becaa9" opacity=".16" stroke-width="1.5"/></g>`).join("")).join("") + `<circle r="6" fill="url(#${uid}-gold)"/>`;
	else petals = [
		{
			n: 8,
			s: 1,
			a: 0
		},
		{
			n: 7,
			s: .77,
			a: 21
		},
		{
			n: 6,
			s: .52,
			a: 2
		},
		{
			n: 5,
			s: .31,
			a: 29
		}
	].map((layer, j) => Array.from({ length: layer.n }, (_, i) => `<g transform="rotate(${i * 360 / layer.n + layer.a}) scale(${layer.s})"><path d="M0 17C-21 12-51-14-48-43C-46-67-17-79 8-71C34-78 52-56 43-32C35-10 11 3 0 17Z" fill="url(#${uid}-${j > 1 ? "camellia-inner" : "camellia"})"/><path d="M-39-45C-35-62-16-67-3-63" fill="none" stroke="#ffc8ba" stroke-width="2.4" opacity="${.28 + j * .09}" stroke-linecap="round"/></g>`).join("")).join("") + stamens(uid, 14, 11);
	return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})" filter="url(#${uid}-soft-shadow)">${petals}</g>`;
}
var bud = (uid, x, y, r, s = 1, white = false) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><ellipse cy="-10" rx="13" ry="21" fill="url(#${uid}-${white ? "jasmine" : "bud"})"/><path d="M-11-1Q0 14 11-1L7 14H-5Z" fill="#6d8b60"/></g>`;
function softArrangement(uid, kind) {
	if (kind === "plum-blossom") return `<path d="M-43 56Q-24 30 1-7Q15-30 40-54M-4 2-48-24M20-30 58-25" stroke="#805754" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M-41 54Q-22 29 2-8Q18-31 38-52" stroke="#bd8c82" stroke-width="2.5" fill="none" stroke-linecap="round"/>
 ${softBloom(uid, kind, 5, -10, .94, 12)}${softBloom(uid, kind, -48, -24, .65, -20)}${softBloom(uid, kind, -34, 31, .61, 25)}${bud(uid, 43, -55, 30, .54)}${bud(uid, 58, -25, 55, .43)}`;
	if (kind === "jasmine") return `<path d="M15-54Q-23 2-6 59Q-18 84-45 104M-13 16-67 9M-8 40 48 56" fill="none" stroke="#708c5a" stroke-width="6" stroke-linecap="round"/>
 ${leaf$1(uid, -16, 24, -52, .78)}${leaf$1(uid, 17, 29, 46, .9)}${leaf$1(uid, -4, 67, -66, .65)}${leaf$1(uid, -18, 83, -90, .58)}
 ${softBloom(uid, kind, -29, -1, .72, -15)}${softBloom(uid, kind, 31, 39, .54, 27)}${softBloom(uid, kind, -20, 72, .45, 9)}${bud(uid, 16, -55, 21, .72, true)}${bud(uid, -64, 7, -55, .5, true)}${bud(uid, -45, 104, 160, .43, true)}`;
	return `${leaf$1(uid, -23, 5, -58, .72)}${leaf$1(uid, 25, -5, 39, .68)}${leaf$1(uid, 34, 27, 99, .6)}${softBloom(uid, kind, 0, 0, 1.06, 8)}${softBloom(uid, kind, 54, 36, .43, 32)}${bud(uid, -49, 29, -41, .48)}`;
}
function flowerPlacement(kind, icon = false) {
	if (icon) return kind === "jasmine" ? "translate(40 34) rotate(-14) scale(.35)" : kind === "camellia" ? "translate(185 40) rotate(-12) scale(.37)" : "translate(185 42) rotate(-12) scale(.40)";
	return kind === "jasmine" ? "translate(377 363) rotate(-16) scale(1.35)" : kind === "camellia" ? "translate(845 310) rotate(-12) scale(1.15)" : "translate(845 315) rotate(-12) scale(1.2)";
}
//#endregion
//#region ../pebble-app/src/nivoRig.js
var EYES = [{
	name: "left",
	cx: 489,
	cy: 604,
	rx: 94,
	ry: 98
}, {
	name: "right",
	cx: 799,
	cy: 511,
	rx: 98,
	ry: 98
}];
var clamp = (n, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));
var ease = (n) => {
	const x = clamp(n);
	return x * x * (3 - 2 * x);
};
function blinkAt(ms) {
	if (ms < 0 || ms >= 290) return 0;
	const p = ms / 290;
	return p < .38 ? ease(p / .38) : 1 - ease((p - .38) / .62);
}
function neutralPose() {
	return {
		x: 0,
		y: 0,
		rotate: 0,
		sx: 1,
		sy: 1,
		left: 0,
		right: 0,
		blink: 0,
		happy: 0,
		sparkle: 0
	};
}
function idleAt(ms) {
	const t = ms / 1e3;
	const pose = neutralPose();
	pose.y = -14 * (1 - Math.cos(t * Math.PI * 2 / 5.4));
	pose.rotate = .65 * Math.sin(t * Math.PI * 2 / 7.1);
	pose.left = 1.3 * Math.sin(t * Math.PI * 2 / 5.4);
	pose.right = -pose.left;
	pose.blink = blinkAt(ms % 6400 - 2450);
	return pose;
}
var ellipse = (e, attrs = "") => `<ellipse cx="${e.cx}" cy="${e.cy}" rx="${e.rx}" ry="${e.ry}" ${attrs}/>`;
var [shoulderStart, shoulderControl, shoulderEnd] = [
	[252, 640],
	[252, 710],
	[297, 780]
];
var leftTip = `M0 ${shoulderStart[1]} H${shoulderStart[0]} Q${shoulderControl.join(" ")} ${shoulderEnd.join(" ")} C316 810 318 860 333 888 C343 902 351 913 351 920 H0 Z`;
var rightTip = "M985 640 H1254 V910 H934 C961 852 984 737 985 640 Z";
var leftWing = "M310 755 C290 752 257 772 229 803 C204 828 192 853 211 875 C231 900 275 902 310 884 C335 869 349 843 344 811 C339 783 325 762 310 755 Z";
var rightWing = "M969 716 C993 721 1023 757 1045 795 C1065 828 1075 852 1057 871 C1036 892 995 882 964 866 C936 851 927 821 933 785 C937 751 950 725 969 716 Z";
function createRig(container, source, id, label, appearance = "classic", deepSeaSource = null) {
	const deepsea = appearance === "deepsea" && !!deepSeaSource;
	const artwork = deepsea ? deepSeaSource : source;
	const eyes = deepsea ? [{
		name: "left",
		cx: 481,
		cy: 593,
		rx: 102,
		ry: 107
	}, {
		name: "right",
		cx: 829,
		cy: 493,
		rx: 104,
		ry: 109
	}] : EYES;
	const leftCut = deepsea ? "M0 718 H210 Q231 741 244 751 C287 737 332 763 344 812 C353 854 332 886 306 900 L285 960 H0 Z" : leftTip;
	const rightCut = deepsea ? "M1054 672 H1254 V970 H1060 Q1030 916 1007 878 C948 843 943 800 963 750 Q981 711 1014 701 Q1034 691 1054 672 Z" : rightTip;
	const leftWindow = deepsea ? leftCut : leftWing;
	const rightWindow = deepsea ? rightCut : rightWing;
	const beakWindow = deepsea ? "M568 638 Q568 600 611 576 Q674 531 759 581 L758 627 Q748 720 663 715 Q613 708 588 659 Z" : "M574 661 Q565 621 600 592 Q661 546 739 595 L737 632 Q737 714 660 716 Q612 710 591 665 Z";
	const image = (attrs = "") => `<use href="#${id}-art" ${attrs}/>`;
	const mask = (name, cuts) => `<mask id="${id}-${name}" maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254" style="mask-type:luminance"><rect width="1254" height="1254" fill="white"/>${cuts}</mask>`;
	container.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${deepsea ? "70 45 1120 1120" : "160 170 970 970"}" role="img" aria-label="${label}">
    <defs>
      <filter id="${id}-ocean-light" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
        <feComponentTransfer in="SourceAlpha" result="solid"><feFuncA type="linear" slope="255" intercept="-127"/></feComponentTransfer>
        <feGaussianBlur in="solid" stdDeviation="2" result="soft-solid"/>
        <feMorphology in="soft-solid" operator="erode" radius="3" result="core"/>
        <feComposite in="SourceGraphic" in2="core" operator="in" result="colour"/>
        <feMorphology in="core" operator="dilate" radius="4" result="edge"/>
        <feComposite in="edge" in2="core" operator="out" result="hard-ring"/>
        <feGaussianBlur in="hard-ring" stdDeviation="2.5" result="ring"/>
        <feImage href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1254' height='1254'%3E%3Cdefs%3E%3ClinearGradient id='g' x2='0' y2='1'%3E%3Cstop stop-color='%234ee0ff'/%3E%3Cstop offset='.5' stop-color='%234cbbff'/%3E%3Cstop offset='1' stop-color='%23bc83ff'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23g)' d='M0 0h1254v1254H0z'/%3E%3C/svg%3E" x="0" y="0" width="1254" height="1254" result="gradient"/>
        <feComposite in="gradient" in2="ring" operator="in" result="rim"/>
        <feGaussianBlur in="rim" stdDeviation="10" result="glow"/>
        <feFlood flood-color="#80dce9" flood-opacity="0" data-part="aurora-light" result="sparkle-colour"/>
        <feComposite in="sparkle-colour" in2="glow" operator="in" result="sparkle-glow"/>
        <feMerge><feMergeNode in="glow"/><feMergeNode in="glow"/><feMergeNode in="sparkle-glow"/><feMergeNode in="rim"/><feMergeNode in="colour"/></feMerge>
      </filter>
      <image id="${id}-art" href="${artwork}" width="1254" height="1254"/>
      <clipPath id="${id}-perch-edge" clipPathUnits="userSpaceOnUse"><rect width="1254" height="${deepsea ? 770 : 798}"/></clipPath>
      <clipPath id="${id}-beak-window"><path d="${beakWindow}"/></clipPath>
      <clipPath id="${id}-left-wing"><path d="${leftWindow}"/></clipPath>
      <clipPath id="${id}-right-wing"><path d="${rightWindow}"/></clipPath>
      ${eyes.map((e) => `<clipPath id="${id}-${e.name}-eye">${ellipse(e)}</clipPath>`).join("")}
      ${mask("body-mask", `<path d="${leftCut}" fill="black" stroke="white" stroke-width="${deepsea ? 14 : 0}"/><path d="${rightCut}" fill="black" stroke="white" stroke-width="${deepsea ? 14 : 0}"/>`)}
    </defs>
    <g class="character" data-part="motion" ${deepsea ? `filter="url(#${id}-ocean-light)"` : ""}>
      <g data-part="left-flipper">${image(`clip-path="url(#${id}-left-wing)"`)}</g>
      <g data-part="right-flipper">${image(`clip-path="url(#${id}-right-wing)"`)}</g>
      <!-- The torso covers rotating roots; the original white face lives here. -->
      <g data-part="body">${image(`mask="url(#${id}-body-mask)"`)}</g>
      ${eyes.map((e) => `<g data-part="${e.name}-eye-assembly">
        ${ellipse(e, `fill="#ffffff"`)}
        <g data-part="${e.name}-eye">${image(`clip-path="url(#${id}-${e.name}-eye)"`)}</g>
        <path data-part="${e.name}-lid" fill="none" stroke="#111111" stroke-width="16" stroke-linecap="round" opacity="0" transform="translate(${e.cx} ${e.cy}) rotate(-17)" d="M-59 8 Q0 38 59 8"/>
      </g>`).join("")}
      <!-- Deep-Sea’s intact beak is already on the torso. Its old overlay caught a pupil edge. -->
      <g data-part="beak">${deepsea ? "" : image(`clip-path="url(#${id}-beak-window)"`)}</g>
    </g>
    <g data-part="SparkleBurst" fill="${deepsea ? "#9ae7ed" : "#f5bb43"}" opacity="0" aria-hidden="true">
      ${[
		[228, 365],
		[1e3, 320],
		[1100, 635],
		[210, 665],
		[350, 215],
		[1030, 960]
	].map(([x, y], i) => `<path data-sparkle="${i}" data-x="${x}" data-y="${y}" d="M0 -16 Q3 -3 14 0 Q3 3 0 16 Q-3 3 -14 0 Q-3 -3 0 -16Z" transform="translate(${x} ${y})"/>`).join("")}
    </g>
  </svg>`;
	const nodes = Object.fromEntries([...container.querySelectorAll("[data-part]")].map((el) => [el.dataset.part, el]));
	const bodyArtwork = nodes.body.querySelector("use");
	const sparkles = [...container.querySelectorAll("[data-sparkle]")];
	return {
		render(pose) {
			if (deepsea) nodes["aurora-light"].setAttribute("flood-opacity", String(pose.sparkle * .16));
			nodes.motion.setAttribute("transform", `translate(${pose.x} ${pose.y}) translate(635 650) rotate(${pose.rotate}) scale(${pose.sx} ${pose.sy}) translate(-635 -650)`);
			nodes["left-flipper"].setAttribute("transform", `translate(0 ${pose.leftY || 0}) rotate(${pose.left} ${deepsea ? "310 850" : "320 815"})`);
			nodes["right-flipper"].setAttribute("transform", `translate(0 ${pose.rightY || 0}) rotate(${pose.right} ${deepsea ? "995 815" : "965 785"})`);
			const wholeSilhouette = deepsea && !pose.peek && pose.left === 0 && pose.right === 0;
			bodyArtwork.setAttribute("mask", wholeSilhouette ? "none" : `url(#${id}-body-mask)`);
			nodes["left-flipper"].setAttribute("opacity", wholeSilhouette ? "0" : "1");
			nodes["right-flipper"].setAttribute("opacity", wholeSilhouette ? "0" : "1");
			nodes.body.setAttribute("clip-path", pose.peek ? `url(#${id}-perch-edge)` : "none");
			if (pose.peek) for (const [part, x, y] of [[
				"left-flipper",
				deepsea ? 310 : 320,
				deepsea ? 850 : 815
			], [
				"right-flipper",
				deepsea ? 995 : 965,
				deepsea ? 815 : 785
			]]) nodes[part].setAttribute("transform", `${nodes[part].getAttribute("transform")} translate(${x} ${y}) scale(1.35) translate(${-x} ${-y})`);
			for (const eye of eyes) {
				const openness = Math.max(.025, 1 - pose.blink);
				const node = nodes[`${eye.name}-eye`];
				node.setAttribute("transform", `translate(${eye.cx} ${eye.cy}) rotate(-17) scale(1 ${openness}) rotate(17) translate(${-eye.cx} ${-eye.cy})`);
				node.setAttribute("opacity", String(clamp(deepsea ? (openness - .025) / .195 : openness / .22)));
				const lid = nodes[`${eye.name}-lid`];
				lid.setAttribute("opacity", String(clamp((pose.blink - .62) / .3)));
				lid.setAttribute("d", pose.happy > .2 ? "M-59 10 Q0 -43 59 10" : "M-59 8 Q0 38 59 8");
			}
			nodes.SparkleBurst.setAttribute("opacity", String(pose.sparkle));
			for (const [index, star] of sparkles.entries()) {
				star.setAttribute("opacity", index < (pose.sparkleLimit ?? sparkles.length) ? "1" : "0");
				const x = Number(star.dataset.x), y = Number(star.dataset.y);
				const drift = pose.sparkle * 26;
				star.setAttribute("transform", `translate(${x + Math.sign(x - 635) * drift} ${y - drift}) scale(${.7 + pose.sparkle * .4})`);
			}
		},
		setLabel(text) {
			container.querySelector("svg").setAttribute("aria-label", text);
		}
	};
}
function applyClassicCoat(svg, uid, colors, markings = "") {
	const defs = svg.querySelector("defs");
	const element = (markup) => {
		const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
		group.innerHTML = markup;
		return group;
	};
	const source = defs.querySelector(`[id="${uid}-art"]`);
	source.id = `${uid}-classic-source`;
	defs.append(element(`<filter id="${uid}-plumage-selection" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="table" tableValues="1 .9 .8 .7 .6 .5 .4 .3 .2 .1 0"/><feFuncG type="table" tableValues="1 .9 .8 .7 .6 .5 .4 .3 .2 .1 0"/><feFuncB type="table" tableValues="1 .9 .8 .7 .6 .5 .4 .3 .2 .1 0"/></feComponentTransfer></filter>
 <mask id="${uid}-plumage-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254" style="mask-type:luminance"><use href="#${uid}-classic-source" filter="url(#${uid}-plumage-selection)"/>${EYES.map((e) => `<ellipse cx="${e.cx}" cy="${e.cy}" rx="${e.rx + 14}" ry="${e.ry + 14}" fill="#000"/>`).join("")}<path d="M574 661Q565 621 600 592Q661 546 739 595L737 632Q737 714 660 716Q612 710 591 665Z" fill="#000"/></mask>
 <linearGradient id="${uid}-coat-gradient" x1="0" y1="0" x2=".5" y2="1"><stop stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient>
 <g id="${uid}-art"><use href="#${uid}-classic-source"/><g mask="url(#${uid}-plumage-mask)"><rect width="1254" height="1254" fill="url(#${uid}-coat-gradient)"/><g>${markings}</g></g></g>`));
	for (const part of [
		"left-eye",
		"right-eye",
		"beak"
	]) svg.querySelector(`[data-part="${part}"] use`).setAttribute("href", `#${uid}-classic-source`);
}
//#endregion
//#region \0flower-body
var _flower_body_default = new URL("./nivo-body.png", "" + import.meta.url).href;
//#endregion
//#region ../pebble-app/src/flowers/art.js
var softFaceIds = [
	"plum-blossom",
	"jasmine",
	"white-lotus",
	"magnolia",
	"orchid",
	"osmanthus",
	"crabapple",
	"peony"
];
var softFace = (id) => softFaceIds.includes(id);
var arrangement = (uid, id) => (isNewEdition(id) ? editionArrangement : softArrangement)(uid, id);
var placement = (id, icon = false) => (isNewEdition(id) ? editionPlacement : flowerPlacement)(id, icon);
var defs = (uid, id) => softFlowerDefs(uid) + (isNewEdition(id) ? editionDefs(uid, id) : "");
var gradient = (uid, colors, y1, y2) => `<linearGradient id="${uid}" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="${y1}" y2="${y2}">${colors.map((c, i) => `<stop offset="${i / 2}" stop-color="${c}"/>`).join("")}</linearGradient>`;
function makeFlower(host, f, uid) {
	const rig = createRig(host, _flower_body_default, uid, f.name), svg = host.querySelector("svg");
	svg.setAttribute("viewBox", "110 40 1080 1120");
	applyClassicCoat(svg, uid, [f.colors[0], f.colors[2]]);
	const g = svg.querySelector(`[id="${uid}-coat-gradient"]`);
	g.outerHTML = gradient(uid + "-coat-gradient", f.colors, 220, 1110);
	svg.querySelectorAll(`[id="${uid}-plumage-selection"] feFuncR,[id="${uid}-plumage-selection"] feFuncG,[id="${uid}-plumage-selection"] feFuncB`).forEach((n) => n.setAttribute("tableValues", softFace(f.id) ? "1 1 1 1 1 1 1 1 1 .9 0" : "1 1 .8 .7 .6 .5 .4 .3 .2 .1 0"));
	if (softFace(f.id)) {
		const art = svg.querySelector(`[id="${uid}-art"]`);
		art.style.isolation = "isolate";
		art.querySelector(`[mask="url(#${uid}-plumage-mask)"]`).style.mixBlendMode = "screen";
	}
	svg.querySelector("defs").insertAdjacentHTML("beforeend", `<filter id="${uid}-soft-silhouette" x="-2%" y="-2%" width="104%" height="104%" color-interpolation-filters="sRGB"><feMorphology in="SourceAlpha" operator="erode" radius="7" result="inset-edge"/><feGaussianBlur in="inset-edge" stdDeviation="1.1" result="soft-edge"/><feComposite in="SourceGraphic" in2="soft-edge" operator="in"/></filter>` + defs(uid, f.id));
	svg.querySelector(`[id="${uid}-art"]`).setAttribute("filter", `url(#${uid}-soft-silhouette)`);
	svg.querySelector("[data-part=\"motion\"]").insertAdjacentHTML("beforeend", `<g data-flower-fit transform="${placement(f.id)}">${arrangement(uid, f.id)}</g>`);
	if (f.id === "plum-blossom") svg.insertAdjacentHTML("beforeend", "<g data-petal opacity=\"0\"><path d=\"M-9-3Q-14-24 5-19Q22-6 0 12Q-9 8-9-3Z\" fill=\"#e8a2b8\"/></g>");
	const petal = svg.querySelector("[data-petal]");
	return { render(pose = neutralPose(), time = 0, active = false) {
		rig.render(pose);
		if (petal) {
			const p = time % 7200 / 7200;
			petal.setAttribute("transform", `translate(${1050 - 58 * p + 18 * Math.sin(p * 6)} ${440 + 390 * p}) rotate(${p * 180})`);
			petal.setAttribute("opacity", active && p > .1 && p < .8 ? String(Math.min(1, (p - .1) * 7, (.8 - p) * 7) * .65) : "0");
		}
	} };
}
//#endregion
//#region ../pebble-app/src/flowers/scenes.js
var bloom = (f, u, x, y, s, r = 0) => (isNewEdition(f.id) ? editionBloom : softBloom)(u, f.id, x, y, s, r);
var leaf = (u, x, y, r, s = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M0 0C-40-27-58-76-3-120C29-79 41-36 0 0Z" fill="url(#${u}-leaf)"/><path d="M0-8Q-8-50-3-102" stroke="#d5e4bf" stroke-width="1.5" opacity=".3" fill="none"/></g>`;
var flowers$1 = (f, u, points) => points.map(([x, y, s, r = 0]) => bloom(f, u, x, y, s, r)).join("");
var stems = (points, base, color = "#6e886b") => `<g fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round">${points.map(([x, y], i) => `<path d="M${x + (i % 2 ? 12 : -12)} ${base}Q${x - 14} ${(y + base) / 2} ${x} ${y}"/>`).join("")}</g>`;
var petals = (u, points) => `<g fill="url(#${u}-fallen)" opacity=".65">${points.map(([x, y, r = 0]) => `<path transform="translate(${x} ${y}) rotate(${r})" d="M-5 0Q-7-9 1-8Q10-4 3 3Q-2 5-5 0Z"/>`).join("")}</g>`;
function sceneArt(f, u, night = false, layout = "home") {
	const card = layout === "card", h = card ? 340 : 800, c = night ? f.night : f.scene;
	const floor = card ? 286 : 665, canopy = card ? 28 : 168;
	const paleCoat = [
		"plum-blossom",
		"jasmine",
		"white-lotus",
		"magnolia",
		"orchid",
		"osmanthus",
		"crabapple",
		"peony"
	].includes(f.id);
	const distant = night ? "#9ab0a1" : "#789487", stone = night ? "#9b8b95" : "#c4b29d";
	const hills = `<path d="M0 ${h * .65}Q70 ${h * .47} 135 ${h * .62}Q228 ${h * .45} 307 ${h * .6}Q361 ${h * .52} 400 ${h * .61}V${h}H0Z" fill="${c[2]}" opacity=".16"/><path d="M0 ${h * .79}Q89 ${h * .64} 182 ${h * .75}Q298 ${h * .6} 400 ${h * .75}V${h}H0Z" fill="${c[2]}" opacity=".24"/>`;
	const moon = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r * 2.2}" fill="url(#${u}-mist)" opacity=".42"/><circle cx="${x}" cy="${y}" r="${r}" fill="${night ? "#f3e5be" : "#fffaf0"}" opacity=".86"/>`;
	const ground = `<path d="M0 ${floor}Q108 ${floor - 27} 202 ${floor + 6}Q309 ${floor - 38} 400 ${floor - 7}V${h}H0Z" fill="${c[2]}" opacity=".3"/>`;
	let landscape = hills, back = "", front = "";
	const bush = (side, scale = 1) => {
		const x = side === "left" ? 28 : 374;
		return `<g opacity=".92">${leaf(u, x, h + 12, side === "left" ? -28 : 28, scale)}${leaf(u, x, h + 7, side === "left" ? 34 : -39, scale * .9)}${leaf(u, x + (side === "left" ? 28 : -27), h + 9, side === "left" ? 9 : -7, scale * .7)}</g>`;
	};
	switch (f.id) {
		case "plum-blossom":
			landscape += `<path d="M0 ${floor + 10}Q117 ${floor - 20} 220 ${floor + 16}Q321 ${floor - 16} 400 ${floor + 5}V${h}H0Z" fill="${night ? "#b7c6d8" : "#fbfcfd"}" opacity=".78"/>`;
			back = `<g stroke-linecap="round" fill="none"><path d="M423 ${canopy - 40}Q355 ${canopy + 35} 298 ${canopy + 44}M365 ${canopy + 12}Q346 ${canopy + 76} 373 ${canopy + 111}M329 ${canopy + 37} 291 ${canopy + 3}" stroke="#816473" stroke-width="6"/><path d="M422 ${canopy - 43}Q355 ${canopy + 30} 299 ${canopy + 41}" stroke="#e9e8ec" stroke-width="3"/></g>${flowers$1(f, u, [
				[
					394,
					canopy - 3,
					.33
				],
				[
					352,
					canopy + 25,
					.4,
					18
				],
				[
					308,
					canopy + 42,
					.3,
					-13
				],
				[
					292,
					canopy + 2,
					.25
				],
				[
					356,
					canopy + 71,
					.29,
					22
				],
				[
					373,
					canopy + 107,
					.23
				]
			])}`;
			front = `<path d="M-15 ${h + 12}Q29 ${floor + 10} 17 ${floor - 62}M19 ${floor - 10} 64 ${floor - 38}" fill="none" stroke="#8a6b79" stroke-width="5" stroke-linecap="round"/>${flowers$1(f, u, [
				[
					17,
					floor - 62,
					.4,
					15
				],
				[
					26,
					floor - 15,
					.32,
					-20
				],
				[
					64,
					floor - 38,
					.26,
					8
				],
				[
					4,
					floor + 29,
					.28
				]
			])}${petals(u, [
				[
					75,
					h - 22,
					24
				],
				[
					321,
					h - 19,
					80
				],
				[
					345,
					floor + 19,
					135
				]
			])}<g fill="#fffdf8" opacity=".75">${[
				[40, canopy + 80],
				[102, canopy + 10],
				[360, floor - 43],
				[76, floor + 15],
				[329, h - 30]
			].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2"/>`).join("")}</g>`;
			break;
		case "jasmine":
			landscape += ground + `<path d="M123 ${h}Q87 ${floor} 169 ${floor - 40}H186Q135 ${floor + 5} 207 ${h}" fill="${night ? "#bac6a0" : "#f6edcf"}" opacity=".35"/>`;
			back = `<g fill="none" stroke="${distant}" opacity=".32" stroke-width="3"><path d="M17 ${floor}V${canopy + 45}Q49 ${canopy - 17} 91 ${canopy + 43}V${canopy + 99}"/><path d="M5 ${canopy + 75}H100M5 ${canopy + 113}H75M39 ${canopy + 5}V${floor}"/></g><path d="M19 ${floor}Q56 ${floor - 85} 25 ${canopy + 122}Q7 ${canopy + 60} 47 ${canopy + 33}Q77 ${canopy + 11} 90 ${canopy + 58}" fill="none" stroke="#6b8c60" stroke-width="3"/>${leaf(u, 27, canopy + 111, -27, .45)}${leaf(u, 44, canopy + 52, 46, .39)}${leaf(u, 24, floor - 48, 50, .48)}${flowers$1(f, u, [
				[
					27,
					canopy + 115,
					.29,
					-20
				],
				[
					20,
					canopy + 69,
					.34
				],
				[
					53,
					canopy + 28,
					.31,
					10
				],
				[
					88,
					canopy + 56,
					.23
				],
				[
					25,
					floor - 67,
					.28
				]
			])}`;
			front = bush("right", 1.05) + bush("left", .68) + flowers$1(f, u, [
				[
					367,
					h - 55,
					.52,
					17
				],
				[
					399,
					h - 97,
					.37
				],
				[
					335,
					h - 27,
					.31,
					-16
				],
				[
					19,
					h - 35,
					.32
				],
				[
					48,
					h - 13,
					.25
				]
			]);
			break;
		case "camellia":
			landscape += ground + `<g fill="none" stroke="${stone}" opacity=".4"><path d="M0 ${floor - 7}Q180 ${floor - 33} 400 ${floor - 8}M0 ${floor + 9}Q180 ${floor - 17} 400 ${floor + 8}" stroke-width="6"/><path d="M95 ${floor - 22}V${floor + 1}M295 ${floor - 21}V${floor + 2}" stroke-width="3"/></g>`;
			back = `<path d="M408 ${canopy - 52}Q362 ${canopy + 21} 388 ${canopy + 108}" fill="none" stroke="#6b7053" stroke-width="5"/>${leaf(u, 386, canopy + 29, -42, .65)}${leaf(u, 377, canopy + 83, 48, .55)}${flowers$1(f, u, [[
				379,
				canopy + 23,
				.39
			], [
				395,
				canopy + 91,
				.28,
				24
			]])}`;
			front = bush("left", 1.45) + bush("right", 1.05) + flowers$1(f, u, [
				[
					12,
					h - 82,
					.48,
					-12
				],
				[
					53,
					h - 41,
					.57,
					14
				],
				[
					5,
					h - 4,
					.36
				],
				[
					386,
					h - 55,
					.46
				],
				[
					353,
					h - 15,
					.32,
					28
				]
			]) + petals(u, [[
				103,
				h - 14,
				24
			], [
				305,
				h - 24,
				65
			]]);
			break;
		case "white-lotus": {
			landscape = moon(294, card ? 62 : 185, 28) + hills + `<path d="M0 ${floor - 80}Q183 ${floor - 107} 400 ${floor - 76}V${h}H0Z" fill="${c[2]}" opacity=".35"/>`;
			back = `<g fill="none" stroke="${night ? "#b8cec6" : "#f8fff6"}" opacity=".4" stroke-width="1.2">${[
				floor - 49,
				floor - 18,
				h - 41,
				h - 15
			].map((y, i) => `<ellipse cx="${i % 2 ? 310 : 75}" cy="${y}" rx="${i % 2 ? 53 : 63}" ry="5"/>`).join("")}</g><g opacity=".55">${flowers$1(f, u, [
				[
					29,
					floor - 62,
					.24
				],
				[
					355,
					floor - 49,
					.27
				],
				[
					312,
					floor - 69,
					.16
				]
			])}</g>`;
			const pts = [
				[
					35,
					h - 75,
					.52,
					-8
				],
				[
					83,
					h - 32,
					.35,
					15
				],
				[
					369,
					h - 55,
					.56,
					9
				],
				[
					324,
					h - 16,
					.3,
					-15
				]
			];
			front = `<g fill="url(#${u}-leaf)">${[
				[
					32,
					h - 28,
					65
				],
				[
					361,
					h - 14,
					77
				],
				[
					75,
					h - 3,
					48
				]
			].map(([x, y, rx]) => `<path d="M${x - rx} ${y}Q${x} ${y - 32} ${x + rx} ${y}Q${x} ${y + 31} ${x - rx} ${y}L${x} ${y - 3}Z"/>`).join("")}</g>${stems(pts, h - 13)}${flowers$1(f, u, pts)}<ellipse cx="294" cy="${floor - 57}" rx="18" ry="3" fill="#f6eccd" opacity=".45"/>`;
			break;
		}
		case "tree-peony":
			landscape = `<path d="M0 ${canopy + 58}H400V${h}H0Z" fill="${stone}" opacity=".14"/><circle cx="206" cy="${card ? 167 : 398}" r="${card ? 123 : 147}" fill="none" stroke="${night ? "#ab8c9d" : "#fff5e1"}" stroke-width="24" opacity=".63"/>${hills}<path d="M135 ${h} 181 ${floor - 52}H233L291 ${h}" fill="${stone}" opacity=".45"/><path d="M160 ${floor + 5}H259M146 ${h - 25}H276" stroke="#f7e7d0" opacity=".4" stroke-width="2"/>`;
			back = `<g opacity=".48">${flowers$1(f, u, [
				[
					21,
					floor - 56,
					.28
				],
				[
					58,
					floor - 39,
					.25
				],
				[
					366,
					floor - 63,
					.29
				],
				[
					394,
					floor - 40,
					.22
				]
			])}</g>`;
			front = bush("left", 1.2) + bush("right", 1.4) + flowers$1(f, u, [
				[
					17,
					h - 44,
					.53,
					-14
				],
				[
					64,
					h - 11,
					.36
				],
				[
					386,
					h - 80,
					.45,
					18
				],
				[
					350,
					h - 28,
					.57,
					-7
				],
				[
					400,
					h + 5,
					.38
				]
			]);
			break;
		case "magnolia":
			landscape = `<path d="M0 ${canopy + 72}H400V${h}H0Z" fill="${night ? "#6c798e" : "#e8ebea"}" opacity=".38"/><g fill="none" stroke="${night ? "#8c9aaf" : "#bac6cf"}" opacity=".29"><path d="M0 ${canopy + 72}H400M0 ${canopy + 83}H400" stroke-width="3"/><path d="M74 ${canopy + 83}V${h}M319 ${canopy + 83}V${h}" stroke-width="2"/></g><path d="M0 ${floor + 1}H400V${h}H0Z" fill="${night ? "#a2acbc" : "#f4f1eb"}" opacity=".3"/><path d="M0 ${floor + 13}H400M0 ${floor + 33}H400" stroke="${stone}" opacity=".28"/>`;
			back = `<path d="M421 ${canopy - 55}Q379 ${canopy + 28} 314 ${canopy + 35}M381 ${canopy + 1}Q346 ${canopy - 21} 298 ${canopy - 17}M354 ${canopy + 23}Q364 ${canopy + 91} 391 ${canopy + 108}" fill="none" stroke="#927d87" stroke-width="5" stroke-linecap="round"/>${flowers$1(f, u, [
				[
					395,
					canopy - 17,
					.4,
					-16
				],
				[
					352,
					canopy + 25,
					.4,
					12
				],
				[
					310,
					canopy + 35,
					.28,
					-14
				],
				[
					300,
					canopy - 18,
					.28,
					7
				],
				[
					376,
					canopy + 80,
					.33,
					-14
				],
				[
					395,
					canopy + 109,
					.24,
					13
				]
			])}`;
			front = `<path d="M-17 ${h + 12}Q36 ${floor + 2} 23 ${floor - 50}M19 ${floor + 10}Q50 ${floor - 13} 67 ${floor - 10}" stroke="#9b8690" fill="none" stroke-width="5"/>${flowers$1(f, u, [
				[
					24,
					floor - 49,
					.43,
					-14
				],
				[
					68,
					floor - 9,
					.31,
					21
				],
				[
					8,
					h - 18,
					.27
				]
			])}${petals(u, [[
				94,
				h - 21,
				70
			], [
				324,
				h - 16,
				110
			]])}<g stroke="#eff7ff" opacity=".5">${[
				[31, canopy + 87],
				[371, floor - 53],
				[41, floor - 98]
			].map(([x, y]) => `<path d="M${x} ${y}l-4 14"/>`).join("")}</g>`;
			break;
		case "orchid": {
			landscape += `<g opacity=".23" stroke="${distant}" fill="none"><path d="M15 ${h}Q36 ${h * .45} 20 0M388 ${h}Q360 ${h * .48} 388 0" stroke-width="5"/>${[
				canopy + 35,
				canopy + 97,
				floor - 50,
				floor + 14
			].map((y) => `<path d="M14 ${y}h17M370 ${y - 12}h19" stroke-width="3"/>`).join("")}</g>${ground}`;
			const pts = [
				[
					26,
					h - 130,
					.42,
					-18
				],
				[
					58,
					h - 87,
					.32,
					17
				],
				[
					13,
					h - 51,
					.36
				],
				[
					374,
					h - 99,
					.46,
					12
				],
				[
					345,
					h - 53,
					.31,
					-12
				],
				[
					394,
					h - 32,
					.29
				]
			];
			front = `<g fill="url(#${u}-leaf)">${[
				[29, -1],
				[52, 1],
				[369, -1],
				[389, 1]
			].map(([x, sign]) => `<path d="M${x} ${h + 8}Q${x - sign * 62} ${h - 62} ${x - sign * 46} ${h - 170}Q${x - sign * 17} ${h - 64} ${x} ${h + 8}M${x} ${h + 8}Q${x + sign * 57} ${h - 97} ${x + sign * 74} ${h - 114}Q${x + sign * 32} ${h - 27} ${x} ${h + 8}"/>`).join("")}</g>${stems(pts, h)}${flowers$1(f, u, pts)}`;
			back = `<g opacity=".35">${flowers$1(f, u, [[
				11,
				floor - 104,
				.23
			], [
				396,
				floor - 146,
				.21
			]])}</g>`;
			break;
		}
		case "osmanthus": {
			landscape = moon(109, card ? 67 : 178, 32) + hills + `<g opacity=".33" fill="${stone}"><path d="M282 ${floor - 56}Q325 ${floor - 68} 345 ${floor - 92}Q366 ${floor - 67} 408 ${floor - 55}L395 ${floor - 47}H289Z"/><path d="M296 ${floor - 46}h6v67h-6ZM384 ${floor - 46}h6v67h-6Z"/><path d="M281 ${floor + 22}H400v6H281Z"/></g>${ground}`;
			const cluster = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${leaf(u, 0, 15, -48, .4)}${leaf(u, 6, 10, 48, .36)}${flowers$1(f, u, [
				[
					-17,
					-5,
					.38
				],
				[
					5,
					-16,
					.38
				],
				[
					22,
					4,
					.35
				],
				[
					-5,
					14,
					.42
				],
				[
					21,
					28,
					.31
				]
			])}</g>`;
			back = `<path d="M420 ${canopy - 28}Q357 ${canopy + 25} 297 ${canopy + 29}M360 ${canopy + 17}Q358 ${canopy + 71} 391 ${canopy + 94}" fill="none" stroke="#8d7956" stroke-width="5"/>${cluster(383, canopy, 1.06)}${cluster(338, canopy + 27, .95)}${cluster(294, canopy + 30, .7)}${cluster(379, canopy + 79, .88)}`;
			front = bush("left", .95) + cluster(20, h - 61, 1.1) + cluster(57, h - 31, 1) + cluster(2, h - 5, .75) + cluster(383, h - 22, .85) + `<g fill="#efd18a" opacity=".7"><circle cx="318" cy="${canopy + 107}" r="2"/><circle cx="347" cy="${floor - 57}" r="2"/><circle cx="88" cy="${h - 20}" r="2"/></g>`;
			break;
		}
		case "crabapple":
			landscape += `<g fill="none" stroke="${stone}" opacity=".4"><path d="M7 ${canopy + 31}H76V${floor - 10}H7Z" stroke-width="4"/>${[
				canopy + 58,
				canopy + 112,
				floor - 43
			].map((y) => `<path d="M8 ${y}H75M9 ${y}l32-28 33 28-33 28Z" stroke-width="1.7"/>`).join("")}<path d="M41 ${canopy + 32}V${floor - 11}" stroke-width="2"/></g>${ground}`;
			back = `<path d="M420 ${canopy - 42}Q359 ${canopy + 10} 298 ${canopy + 11}M354 ${canopy - 2}Q325 ${canopy + 51} 339 ${canopy + 79}M307 ${canopy + 9}Q284 ${canopy + 35} 289 ${canopy + 63}M390 ${canopy - 14}Q374 ${canopy + 74} 397 ${canopy + 109}" stroke="#9c7470" fill="none" stroke-width="4" stroke-linecap="round"/>${leaf(u, 354, canopy + 6, 38, .39)}${leaf(u, 300, canopy + 21, -32, .3)}${flowers$1(f, u, [
				[
					375,
					canopy + 7,
					.38,
					21
				],
				[
					320,
					canopy + 21,
					.31,
					165
				],
				[
					339,
					canopy + 76,
					.3,
					173
				],
				[
					288,
					canopy + 62,
					.26,
					150
				],
				[
					391,
					canopy + 81,
					.29,
					173
				]
			])}<g fill="url(#${u}-petal)"><ellipse cx="397" cy="${canopy + 110}" rx="6" ry="10"/><ellipse cx="298" cy="${canopy + 45}" rx="5" ry="8"/></g>`;
			front = `<path d="M-15 ${h + 17}Q46 ${floor + 28} 20 ${floor - 20}M31 ${floor + 30} 65 ${floor + 9}" stroke="#9c7470" stroke-width="4" fill="none"/>${leaf(u, 29, h - 21, 56, .5)}${flowers$1(f, u, [
				[
					19,
					floor - 21,
					.36,
					12
				],
				[
					36,
					floor + 22,
					.29
				],
				[
					66,
					floor + 10,
					.25,
					-16
				],
				[
					386,
					h - 26,
					.37,
					18
				]
			])}${petals(u, [
				[
					95,
					h - 17,
					45
				],
				[
					321,
					h - 27,
					125
				],
				[
					356,
					h - 9,
					20
				]
			])}`;
			break;
		case "peony": {
			landscape += ground + `<path d="M148 ${h}Q280 ${floor + 4} 226 ${floor - 70}H249Q329 ${floor + 2} 264 ${h}Z" fill="${night ? "#a18d9e" : "#f2e3d5"}" opacity=".58"/>`;
			back = `<g opacity=".4">${flowers$1(f, u, [
				[
					29,
					floor - 63,
					.29,
					-8
				],
				[
					68,
					floor - 41,
					.23
				],
				[
					357,
					floor - 56,
					.28
				],
				[
					394,
					floor - 79,
					.23
				]
			])}</g>`;
			const pts = [
				[
					17,
					h - 75,
					.48,
					-12
				],
				[
					63,
					h - 33,
					.46,
					18
				],
				[
					5,
					h - 2,
					.31
				],
				[
					376,
					h - 61,
					.52,
					9
				],
				[
					338,
					h - 17,
					.32,
					-16
				],
				[
					405,
					h - 7,
					.35
				]
			];
			front = bush("left", 1.2) + bush("right", 1.18) + stems(pts, h) + flowers$1(f, u, pts) + `<g fill="#fffdf2" opacity=".7"><ellipse cx="49" cy="${h - 31}" rx="2" ry="3"/><ellipse cx="356" cy="${h - 27}" rx="2" ry="3"/></g>`;
			break;
		}
		case "spider-lily": {
			landscape = moon(295, card ? 60 : 170, 26) + hills + `<path d="M141 ${h}Q80 ${floor + 4} 248 ${floor - 70}Q277 ${floor - 89} 244 ${floor - 106}Q309 ${floor - 93} 277 ${floor - 62}Q183 ${floor + 6} 276 ${h}Z" fill="${night ? "#8b9cba" : "#d3d2df"}" opacity=".44"/>`;
			const far = [
				[
					8,
					floor - 39,
					.19
				],
				[
					36,
					floor - 51,
					.18
				],
				[
					64,
					floor - 27,
					.15
				],
				[
					338,
					floor - 39,
					.16
				],
				[
					365,
					floor - 56,
					.2
				],
				[
					394,
					floor - 32,
					.17
				]
			];
			back = `<g opacity=".4">${stems(far, h)}${flowers$1(f, u, far)}</g>`;
			const pts = [
				[
					23,
					h - 83,
					.45,
					9
				],
				[
					66,
					h - 36,
					.31,
					-13
				],
				[
					1,
					h - 17,
					.3
				],
				[
					376,
					h - 90,
					.43,
					-8
				],
				[
					338,
					h - 35,
					.3,
					15
				],
				[
					408,
					h - 29,
					.32
				]
			];
			front = stems(pts, h, "#6f8474") + flowers$1(f, u, pts);
			break;
		}
	}
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>${softFlowerDefs(u)}${isNewEdition(f.id) ? editionDefs(u, f.id) : ""}<linearGradient id="${u}-sky" x2="0" y2="1"><stop stop-color="${c[0]}"/><stop offset=".6" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></linearGradient><radialGradient id="${u}-mist"><stop stop-color="#fff9ed" stop-opacity=".6"/><stop offset="1" stop-color="#fff9ed" stop-opacity="0"/></radialGradient><linearGradient id="${u}-fallen"><stop stop-color="#fff1e5"/><stop offset="1" stop-color="${f.accent || "#d89ca8"}"/></linearGradient></defs><rect width="400" height="${h}" fill="url(#${u}-sky)"/>${landscape}<ellipse cx="200" cy="${h * .44}" rx="169" ry="${h * .32}" fill="url(#${u}-mist)" opacity="${night ? .12 : paleCoat ? .16 : .5}"/><g opacity="${night ? .78 : .88}">${back}</g><g transform="translate(0 ${card ? 0 : -54})">${front}</g></svg>`;
}
//#endregion
export { flowers, idleAt, makeFlower, neutralPose, sceneArt };
