//#region src/myths/scenes.js
var worlds = {
	anubis: {
		name: "Sands of eternity",
		note: "Warm dunes, sandstone gateways, and a sky of tiny gold stars.",
		day: [
			"#f4e6cb",
			"#d5b58c",
			"#b78b61",
			"#8b6850",
			"#fff4cf"
		],
		night: [
			"#15243b",
			"#394057",
			"#827078",
			"#afa0a0",
			"#efcf8c"
		]
	},
	horus: {
		name: "Above the Nile",
		note: "A wide blue river, sunlit cliffs, and papyrus beneath a winged sun.",
		day: [
			"#e2f0f1",
			"#a8d0da",
			"#78a4b4",
			"#557e80",
			"#fff0ba"
		],
		night: [
			"#142a43",
			"#284967",
			"#4b7083",
			"#87a9b0",
			"#e9ca8c"
		]
	},
	athena: {
		name: "The olive courtyard",
		note: "Pale columns, silver olive branches, and a peaceful mosaic courtyard.",
		day: [
			"#edf0df",
			"#d1d6be",
			"#a6b291",
			"#788b70",
			"#fff5d9"
		],
		night: [
			"#202d32",
			"#3c4c49",
			"#6a8071",
			"#a3b39c",
			"#e6d5ac"
		]
	},
	poseidon: {
		name: "The coral sanctuary",
		note: "Sunbeams reach an underwater temple through turquoise water and coral.",
		day: [
			"#d4eee9",
			"#72b5b4",
			"#41898f",
			"#3a727b",
			"#e3fff3"
		],
		night: [
			"#122e42",
			"#1d5263",
			"#317387",
			"#87bfc3",
			"#c5f1de"
		]
	},
	artemis: {
		name: "The silver grove",
		note: "A crescent moon watches over pine trees, silver leaves, and a still lake.",
		day: [
			"#e1e8f1",
			"#a9c0c9",
			"#6d9697",
			"#557675",
			"#f5f7ed"
		],
		night: [
			"#18253c",
			"#2a4055",
			"#416671",
			"#8dabae",
			"#e2e9d0"
		]
	},
	apollo: {
		name: "The golden terrace",
		note: "Warm sunshine, laurel trees, and marble steps above a golden valley.",
		day: [
			"#fff0d2",
			"#ebc28f",
			"#c49966",
			"#947c54",
			"#fff8da"
		],
		night: [
			"#342c42",
			"#725063",
			"#b08075",
			"#c7a77b",
			"#ffdc9d"
		]
	},
	zeus: {
		name: "A palace in the clouds",
		note: "Marble pillars and quiet thunderclouds float above the distant mountains.",
		day: [
			"#e7edf8",
			"#b4c8e1",
			"#91aac8",
			"#7286a6",
			"#ffffff"
		],
		night: [
			"#19263f",
			"#3b4e6c",
			"#7085a1",
			"#a5b7cd",
			"#f3e3bb"
		]
	},
	medusa: {
		name: "The jade garden",
		note: "Ivy winds through weathered pillars, jade stones, and a mossy garden.",
		day: [
			"#e7eddd",
			"#afc6ac",
			"#7c9b85",
			"#547c69",
			"#f3f0d7"
		],
		night: [
			"#172f2d",
			"#315347",
			"#567c68",
			"#93b29a",
			"#dce3b5"
		]
	},
	hades: {
		name: "The quiet underworld",
		note: "An obsidian gateway, a violet river, and soft lanterns light the way home.",
		day: [
			"#e7dfea",
			"#b9a8c7",
			"#85749c",
			"#625779",
			"#eee0cc"
		],
		night: [
			"#1d1b30",
			"#352d4d",
			"#635778",
			"#aa95b9",
			"#e9c2ae"
		]
	}
};
var path$1 = (d, fill, extra = "") => `<path d="${d}" fill="${fill}" ${extra}/>`;
var line$1 = (d, c, w = 2, extra = "") => path$1(d, "none", `stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}`);
var at$1 = (x, y, art, s = 1, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">${art}</g>`;
var glint = (x, y, c, s = 1) => at$1(x, y, path$1("M0-5Q1-1 5 0Q1 1 0 5Q-1 1-5 0Q-1-1 0-5Z", c), s);
function branch(x, y, c, light, scale = 1, flip = 1) {
	return at$1(x, y, `<g transform="scale(${flip} 1)">${line$1("M0 0Q-8-69 39-149", c, 3)}${Array.from({ length: 6 }, (_, i) => {
		const yy = -25 - i * 21;
		return at$1(1 + i * i * 1.05, yy, path$1("M0 0Q-34-2-31-26Q-9-26 0 0Z", c) + path$1("M0-5Q5-36 24-34Q30-14 0-5Z", light));
	}).join("")}</g>`, scale);
}
var contact = (x, y, u, width = 40) => at$1(x, y, `<ellipse rx="${width}" ry="9" fill="url(#${u}-contact)"/><ellipse rx="${width * .64}" ry="2.5" fill="#17212a" opacity=".18"/>`);
function plinth(x, y, u, width = 35) {
	return contact(x, y + 17, u, width + 12) + at$1(x, y, `${path$1(`M${-width} 4L${-width + 7}-4H${width - 7}L${width} 4V16H${-width}Z`, `url(#${u}-stone)`)}${path$1(`M${-width} 4L${-width + 7}-4H${width - 7}L${width} 4Z`, `url(#${u}-plinth-top)`)}${line$1(`M${-width} 14H${width}`, "#17212a", 2, "opacity=\".12\"")}`);
}
function groundLip(x, y, color, kind = "sand", width = 43) {
	return at$1(x, y, path$1((kind === "moss" ? `M${-width} 7Q-31-5-22 1Q-14-8-5 1Q5-3 13 3Q25-6 ${width} 8` : `M${-width} 7Q-24-1-9 5Q8 10 23 3Q33 1 ${width} 8`) + `Q18 15-10 12Q-32 14${-width} 7Z`, color, "opacity=\".8\"") + line$1(`M-27 7Q-9 4 5 9`, color, 2));
}
function column(x, y, height, u, broken = false, scale = 1) {
	return contact(x, y + 16 * scale, u, 39 * scale) + at$1(x, y, `${path$1(`M-15 0H15V${-height + 12}${broken ? "L8 " + (-height + 2) + "L-1 " + (-height + 9) + "L-15 " + -height : "H-15"}Z`, `url(#${u}-stone)`)}${line$1(`M-7-7V${-height + 21}M1-7V${-height + 21}M9-7V${-height + 21}`, `url(#${u}-edge)`, 1.5)}<rect x="-22" y="0" width="44" height="9" rx="3" fill="url(#${u}-stone)"/><rect x="-26" y="9" width="52" height="7" rx="2" fill="url(#${u}-stone)"/>${broken ? "" : `<rect x="-21" y="${-height}" width="42" height="10" rx="3" fill="url(#${u}-stone)"/><rect x="-26" y="${-height - 7}" width="52" height="8" rx="3" fill="url(#${u}-stone)"/>`}`, scale);
}
function clouds(y, c, opacity = 1) {
	return `<g opacity="${opacity}">${path$1(`M-30 ${y + 24}Q-20 ${y - 17} 16 ${y - 7}Q25 ${y - 53} 66 ${y - 33}Q101 ${y - 47} 118 ${y - 11}Q159 ${y - 18} 172 ${y + 24}Z`, c)}${path$1(`M237 ${y + 53}Q231 ${y + 22} 266 ${y + 18}Q279 ${y - 25} 314 ${y - 9}Q344 ${y - 34} 370 ${y + 2}Q411 ${y - 12} 430 ${y + 53}Z`, c)}</g>`;
}
function pine(x, y, height, c) {
	return at$1(x, y, path$1(`M0-${height}L-${height * .22}-${height * .47}H-${height * .12}L-${height * .35}-${height * .17}H-5V0H5V-${height * .17}H${height * .35}L${height * .12}-${height * .47}H${height * .22}Z`, c));
}
function coral(x, y, c, s = 1, flip = 1) {
	return at$1(x, y, `<g transform="scale(${flip} 1)">${line$1("M0 3Q-9-41 0-86M-2-29Q-34-29-37-57M-3-50Q23-51 28-78M-1-66Q-20-72-22-99M-29-39L-29-65M17-54L16-80", c, 7)}${line$1("M-1-4Q-7-39-1-68", "#f9e7ce", 1.5, "opacity=\".45\"")}</g>`, s);
}
function reeds(x, y, c, s = 1) {
	return at$1(x, y, `${[
		-1,
		0,
		1
	].map((v) => line$1(`M0 0Q${v * 11} -37 ${v * 19} -80`, c, 2) + path$1(`M${v * 19} -80L${v * 19 - 15} -89Q${v * 19} -101 ${v * 19 + 15} -89Z`, c)).join("")}`, s);
}
function stone(x, y, c, s = 1) {
	return at$1(x, y, path$1("M-23 0L-18-18L3-24L26-12L30 0Z", c) + line$1("M-16-17L3-18L22-10", "#eff4dc", 1, "opacity=\".3\""), s);
}
function pomegranate(x, y, c, fruit, s = 1) {
	return branch(x, y, c, c, s) + at$1(x + 13 * s, y - 61 * s, `<circle r="11" fill="${fruit}"/>${path$1("M-4-8L-4-15L0-12L4-15L4-8Z", fruit)}${line$1("M-5-4Q-9 2-5 6", "#f4c4b6", 1.5, "opacity=\".65\"")}`, s);
}
function sceneArt(f, u, night = false, layout = "home") {
	const w = worlds[f.id], card = layout === "card", h = card ? 340 : 800;
	const [top, bottom, mid, ink, light] = w[night ? "night" : "day"];
	const canopy = card ? 38 : 164, horizon = card ? 205 : 392, floor = card ? 291 : 686;
	const sky = `<rect width="400" height="${h}" fill="url(#${u}-sky)"/>`;
	const sun = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r * 2.3}" fill="url(#${u}-glow)"/><circle cx="${x}" cy="${y}" r="${r}" fill="${light}" opacity=".9"/>`;
	const hills = path$1(`M0 ${horizon + 35}Q76 ${horizon - 26} 140 ${horizon + 18}Q226 ${horizon - 26} 302 ${horizon + 10}Q370 ${horizon - 6} 400 ${horizon + 32}V${h}H0Z`, mid, "opacity=\".24\"") + path$1(`M0 ${floor - 16}Q128 ${floor - 56} 231 ${floor - 8}Q319 ${floor - 33} 400 ${floor - 7}V${h}H0Z`, mid, "opacity=\".28\"");
	const starry = night ? `<g opacity=".6">${[
		[35, 68],
		[86, canopy - 35],
		[305, 88],
		[362, canopy + 79],
		[21, horizon - 23],
		[330, canopy - 45]
	].map(([x, y], i) => glint(x, y, light, i % 2 ? .55 : .8)).join("")}</g>` : "";
	let back = "", front = "";
	switch (f.id) {
		case "anubis":
			back = sun(305, canopy + 17, 25) + path$1(`M-40 ${horizon + 60}L58 ${horizon - 58}L157 ${horizon + 60}Z`, mid, "opacity=\".56\"") + path$1(`M58 ${horizon - 58}L90 ${horizon + 60}H157Z`, ink, "opacity=\".23\"") + path$1(`M246 ${horizon + 42}L319 ${horizon - 44}L402 ${horizon + 42}Z`, mid, "opacity=\".38\"") + hills;
			for (const x of [22, 378]) back += plinth(x, floor - 2, u, 34) + at$1(x, floor, `${path$1(`M-24 0L-19-${card ? 200 : 436}L0-${card ? 225 : 461}L19-${card ? 200 : 436}L24 0Z`, `url(#${u}-stone)`)}${line$1(`M0-${card ? 216 : 452}V-16`, light, 1, "opacity=\".32\"")}${[
				-30,
				-63,
				-96
			].map((y) => line$1(`M-8 ${y}h16M-4 ${y - 8}h8`, ink, 2, "opacity=\".4\"")).join("")}`);
			front = [22, 378].map((x) => groundLip(x, floor + 10, mid)).join("") + path$1(`M0 ${h - 28}Q109 ${h - 78} 222 ${h - 23}Q316 ${h - 5} 400 ${h - 42}V${h}H0Z`, mid, "opacity=\".65\"") + reeds(16, h - 8, ink, .55) + reeds(380, h - 19, ink, .44) + stone(67, h - 14, mid, .55);
			break;
		case "horus":
			back = sun(200, canopy + 18, 26) + at$1(200, canopy + 18, [-1, 1].map((s) => `<g transform="scale(${s} 1)">${path$1("M29 0Q65-8 100-32Q83 8 37 18Z", light, "opacity=\".68\"")}${line$1("M41 4L86-17M50 9L80-6", mid, 1.5)}</g>`).join("")) + hills;
			back += path$1(`M0 ${horizon + 25}Q99 ${horizon + 8} 193 ${horizon + 44}Q249 ${horizon + 64} 199 ${floor}L266 ${h}H84Q156 ${floor + 7} 174 ${horizon + 93}Q146 ${horizon + 57} 0 ${horizon + 53}Z`, bottom) + line$1(`M30 ${horizon + 40}Q123 ${horizon + 37} 180 ${horizon + 65}`, light, 2, "opacity=\".55\"");
			back += path$1(`M0 ${horizon + 5}V${canopy + 34}L31 ${canopy + 14}L63 ${canopy + 40}L49 ${horizon + 12}Z`, mid, "opacity=\".55\"") + path$1(`M400 ${horizon + 29}V${canopy + 75}L367 ${canopy + 51}L345 ${canopy + 85}L356 ${horizon + 17}Z`, mid, "opacity=\".5\"");
			front = reeds(23, h - 13, ink, 1.05) + reeds(376, h - 4, ink, .86) + reeds(57, h + 15, mid, .68) + stone(345, h - 18, mid, .8);
			break;
		case "athena":
			back = hills + path$1(`M0 ${floor - 10}H400V${h}H0Z`, light, "opacity=\".28\"");
			back += column(31, floor - 8, card ? 201 : 446, u) + column(369, floor - 8, card ? 201 : 446, u) + line$1(`M5 ${canopy + 29}H395`, mid, 10, "opacity=\".4\"");
			front = branch(-2, h - 8, ink, mid, 1.1, 1) + branch(400, h - 9, ink, mid, 1.03, -1) + branch(404, canopy + 136, ink, mid, .9, -1) + line$1(`M70 ${h - 28}H330M90 ${h - 18}H310`, light, 3, "opacity=\".6\"");
			front += at$1(200, h - 38, [
				-2,
				-1,
				0,
				1,
				2
			].map((n) => path$1(`M${n * 24} -5l7 7-7 7-7-7Z`, ink, "opacity=\".2\"")).join(""));
			break;
		case "poseidon":
			back = path$1(`M45 0H89L285 ${h}H120Z`, light, "opacity=\".12\"") + path$1(`M221 0H241L400 ${h}H341Z`, light, "opacity=\".1\"") + hills;
			back += path$1(`M0 ${floor - 11}Q100 ${floor - 26} 200 ${floor - 5}Q300 ${floor - 20} 400 ${floor - 9}V${h}H0Z`, mid, "opacity=\".2\"");
			back += `<g opacity=".65">${column(42, floor - 23, card ? 163 : 395, u, true)}${column(357, floor - 23, card ? 197 : 452, u)}${line$1(`M333 ${floor - (card ? 210 : 465)}L400 ${floor - (card ? 204 : 459)}`, mid, 14)}</g>`;
			front = [42, 357].map((x) => groundLip(x, floor - 10, mid)).join("") + path$1(`M0 ${h - 30}Q75 ${h - 65} 188 ${h - 25}Q319 ${h - 59} 400 ${h - 30}V${h}H0Z`, mid, "opacity=\".6\"") + coral(29, h - 14, night ? "#ad8b9d" : "#d99986", .85) + coral(378, h - 8, night ? "#80b4af" : "#80c4ac", 1.1, -1) + coral(69, h + 5, light, .42, -1) + stone(333, h - 11, ink, .7);
			front += `<g fill="none" stroke="${light}" opacity=".65">${[
				[
					29,
					canopy + 28,
					4
				],
				[
					362,
					canopy + 7,
					7
				],
				[
					344,
					canopy + 43,
					3
				],
				[
					23,
					floor - 84,
					5
				],
				[
					377,
					floor - 128,
					4
				]
			].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("")}</g>`;
			break;
		case "artemis":
			back = at$1(300, canopy + 13, `<circle r="54" fill="url(#${u}-glow)"/>${path$1("M13-29C-17-29-31 12-5 29C-43 28-43-31-9-36Q3-37 13-29Z", light)}`) + hills;
			back += `<g opacity=".42">${pine(26, floor - 8, card ? 190 : 442, ink)}${pine(374, floor + 1, card ? 220 : 465, ink)}${pine(64, floor - 24, card ? 126 : 305, mid)}${pine(337, floor - 17, card ? 146 : 333, mid)}</g>`;
			back += path$1(`M0 ${floor + 10}Q200 ${floor - 14} 400 ${floor + 10}V${h}H0Z`, bottom) + line$1(`M108 ${h - 41}Q199 ${h - 47} 291 ${h - 41}M144 ${h - 28}H250`, light, 1.5, "opacity=\".45\"");
			front = branch(-10, h + 18, ink, mid, .88) + branch(407, h + 5, ink, mid, .7, -1) + line$1(`M22 ${canopy + 3}L44 ${canopy - 19}L73 ${canopy + 4}L59 ${canopy + 29}`, light, 1, "opacity=\".5\"") + [
				[22, 3],
				[44, -19],
				[73, 4],
				[59, 29]
			].map(([x, y]) => glint(x, canopy + y, light, .65)).join("");
			break;
		case "apollo":
			back = sun(282, canopy + 17, 35) + at$1(282, canopy + 17, Array.from({ length: 12 }, (_, i) => `<g transform="rotate(${i * 30})">${line$1("M0-46V-57", light, 2)}</g>`).join("")) + hills;
			back += path$1(`M0 ${floor - 6}H400V${h}H0Z`, mid, "opacity=\".3\"") + line$1(`M0 ${floor - 6}H400`, light, 3, "opacity=\".4\"") + column(24, floor - 5, card ? 182 : 424, u) + column(376, floor - 5, card ? 182 : 424, u) + line$1(`M0 ${floor + 22}H400M0 ${floor + 34}H400M0 ${h - 25}H400`, light, 3, "opacity=\".5\"");
			front = branch(-4, h + 6, ink, mid, .92) + branch(400, h + 6, ink, mid, .95, -1) + branch(-5, canopy + 130, ink, mid, .76) + at$1(352, h - 43, `${path$1("M-21-20Q-26 29 0 32Q26 29 21-20L16-27L12-19Q18 20 0 21Q-18 20-12-19L-16-27Z", light)}${line$1("M-13-17H13M-8-15V15M0-15V19M8-15V15", ink, 1.5)}`, .65);
			break;
		case "zeus":
			back = path$1(`M0 ${horizon + 60}L73 ${horizon - 13}L110 ${horizon + 25}L189 ${horizon - 56}L290 ${horizon + 35}L344 ${horizon + 4}L400 ${horizon + 53}V${h}H0Z`, mid, "opacity=\".36\"") + clouds(canopy + 28, light, .55);
			back += path$1(`M0 ${floor - 21}H400V${floor + 7}H0Z`, `url(#${u}-stone)`) + path$1(`M0 ${floor - 21}L14 ${floor - 30}H386L400 ${floor - 21}Z`, `url(#${u}-plinth-top)`) + line$1(`M0 ${floor + 6}H400`, ink, 2, "opacity=\".28\"") + column(23, floor - 27, card ? 174 : 412, u) + column(377, floor - 27, card ? 174 : 412, u) + path$1(`M142 ${floor + 5}H258L298 ${h}H102Z`, light, "opacity=\".4\"") + Array.from({ length: 5 }, (_, i) => line$1(`M${140 - i * 6} ${floor + 12 + i * 15}H${260 + i * 6}`, mid, 2, "opacity=\".5\"")).join("");
			front = clouds(h - 34, light, .9) + clouds(floor + 13, light, .58) + line$1(`M363 ${canopy + 46}l-12 22h12l-7 17`, night ? "#f0d6a1" : "#dbc38f", 2.5, "opacity=\".8\"");
			break;
		case "medusa":
			back = hills + `<g opacity=".75">${column(28, floor - 9, card ? 192 : 433, u, true)}${column(373, floor - 3, card ? 224 : 473, u, true)}</g>`;
			back += line$1(`M9 ${floor - 40}Q60 ${floor - 108} 24 ${canopy + 119}Q-2 ${canopy + 56} 30 ${canopy + 22}M373 ${floor - 36}Q340 ${floor - 150} 379 ${canopy + 26}`, ink, 3, "opacity=\".7\"");
			front = groundLip(28, floor + 4, mid, "moss") + groundLip(373, floor + 10, mid, "moss") + branch(6, h - 13, ink, mid, .85) + branch(401, h + 10, ink, mid, 1, -1) + branch(15, canopy + 129, ink, mid, .62) + branch(393, canopy + 158, ink, mid, .75, -1);
			front += stone(35, h - 17, ink, 1.25) + stone(368, h - 16, ink, 1.12) + stone(329, h - 7, mid, .65) + line$1(`M4 ${h - 23}q20-16 46-4M348 ${h - 25}q24-8 44 4`, mid, 5);
			front += at$1(55, h - 43, path$1("M-10 8Q-25-3-12-13Q1-20 10-6Q17 3 8 13Q-4 22-10 8M-10 8Q-6-1 1 3", "none", `stroke="${light}" stroke-width="5" opacity=".65"`));
			break;
		case "hades":
			back = path$1(`M0 ${horizon + 38}L37 ${canopy + 91}L67 ${horizon + 7}L97 ${horizon - 30}L132 ${horizon + 53}V${h}H0ZM268 ${horizon + 48}L308 ${horizon - 20}L330 ${horizon + 10}L371 ${canopy + 70}L400 ${horizon + 39}V${h}H268Z`, mid, "opacity=\".4\"");
			back += [39, 361].map((x) => plinth(x, floor - 8, u, 25)).join("");
			back += `<path d="M39 ${floor}V${canopy + 102}Q39 ${canopy - 30} 200 ${canopy - 30}Q361 ${canopy - 30} 361 ${canopy + 102}V${floor}" fill="none" stroke="url(#${u}-stone)" stroke-width="24"/><path d="M54 ${floor}V${canopy + 102}Q54 ${canopy - 13} 200 ${canopy - 13}Q346 ${canopy - 13} 346 ${canopy + 102}V${floor}" fill="none" stroke="${light}" stroke-opacity=".32" stroke-width="2"/>`;
			back += path$1(`M161 ${horizon + 44}Q275 ${floor - 48} 202 ${floor}Q153 ${floor + 41} 250 ${h}H127Q91 ${floor + 44} 164 ${floor - 2}Q215 ${floor - 43} 151 ${horizon + 46}Z`, bottom) + line$1(`M171 ${floor + 37}Q151 ${h - 54} 185 ${h - 20}`, light, 1, "opacity=\".45\"");
			front = groundLip(39, floor + 4, mid, "sand", 35) + groundLip(361, floor + 4, mid, "sand", 35) + pomegranate(3, h + 8, ink, night ? "#c591a9" : "#ad657f", .75) + pomegranate(397, h + 8, ink, night ? "#c591a9" : "#ad657f", .83) + [32, 368].map((x) => at$1(x, floor - 36, `${path$1("M-7 7H7L11 40H-11Z", ink)}${path$1("M-16 0Q0 23 16 0Z", mid)}${path$1("M0-35Q-17-16-7-3Q3 6 10-7Q15-18 6-25Q7-11 0-13Q-6-15 0-35Z", light)}<circle cy="-11" r="27" fill="url(#${u}-glow)"/>`, .7)).join("");
			break;
	}
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" data-world="${f.id}" data-layout="${layout}"><defs>
    <linearGradient id="${u}-sky" x2="0" y2="1"><stop stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>
    <radialGradient id="${u}-glow"><stop stop-color="${light}" stop-opacity=".55"/><stop offset="1" stop-color="${light}" stop-opacity="0"/></radialGradient>
    <linearGradient id="${u}-stone"><stop stop-color="${mid}"/><stop offset=".3" stop-color="${night ? ink : light}"/><stop offset=".7" stop-color="${mid}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
    <linearGradient id="${u}-edge"><stop stop-color="${light}" stop-opacity=".5"/><stop offset="1" stop-color="${ink}" stop-opacity=".3"/></linearGradient>
    <radialGradient id="${u}-contact"><stop stop-color="#17212a" stop-opacity="${night ? .38 : .28}"/><stop offset=".55" stop-color="#17212a" stop-opacity=".13"/><stop offset="1" stop-color="#17212a" stop-opacity="0"/></radialGradient>
    <linearGradient id="${u}-plinth-top" x2="0" y2="1"><stop stop-color="${light}" stop-opacity=".65"/><stop offset="1" stop-color="${mid}"/></linearGradient>
    <radialGradient id="${u}-quiet"><stop stop-color="${top}" stop-opacity=".42"/><stop offset="1" stop-color="${top}" stop-opacity="0"/></radialGradient>
  </defs>${sky}${starry}${back}<ellipse cx="200" cy="${card ? 170 : 370}" rx="155" ry="${card ? 150 : 260}" fill="url(#${u}-quiet)"/>${front}</svg>`;
}
//#endregion
//#region src/nivoRig.js
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
var NIVO_FRAME = {
	x: 90,
	y: 40,
	size: 1120
};
function createRig(container, source, id, label, appearance = "classic") {
	const deepsea = appearance === "deepsea";
	const artwork = source;
	const eyes = EYES;
	const leftCut = leftTip;
	const rightCut = rightTip;
	const leftWindow = leftWing;
	const rightWindow = rightWing;
	const beakWindow = "M574 661 Q565 621 600 592 Q661 546 739 595 L737 632 Q737 714 660 716 Q612 710 591 665 Z";
	const image = (attrs = "") => `<use href="#${id}-art" ${attrs}/>`;
	const mask = (name, cuts) => `<mask id="${id}-${name}" maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254" style="mask-type:luminance"><rect width="1254" height="1254" fill="white"/>${cuts}</mask>`;
	const { x, y, size } = NIVO_FRAME;
	container.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${size} ${size}" role="img" aria-label="${label}">
    <defs>
      <filter id="${id}-ocean-light" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
        <feMorphology in="SourceAlpha" operator="erode" radius="2" result="core"/>
        <feMorphology in="SourceAlpha" operator="dilate" radius="2" result="edge"/>
        <feComposite in="edge" in2="core" operator="out" result="hard-ring"/>
        <feGaussianBlur in="hard-ring" stdDeviation=".7" result="ring"/>
        <feImage href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1254' height='1254'%3E%3Cdefs%3E%3ClinearGradient id='g' x2='0' y2='1'%3E%3Cstop stop-color='%2352eaff'/%3E%3Cstop offset='.55' stop-color='%2328bbff'/%3E%3Cstop offset='1' stop-color='%23b067ff'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23g)' d='M0 0h1254v1254H0z'/%3E%3C/svg%3E" x="0" y="0" width="1254" height="1254" result="gradient"/>
        <feComposite in="gradient" in2="ring" operator="in" result="rim-soft"/>
        <feComponentTransfer in="rim-soft" result="rim"><feFuncA type="linear" slope="1.5"/></feComponentTransfer>
        <feGaussianBlur in="rim" stdDeviation="12" result="blur"/>
        <feComponentTransfer in="blur" result="glow"><feFuncA type="linear" slope="3.5"/></feComponentTransfer>
        <feGaussianBlur in="rim" stdDeviation="26" result="ambient"/>
        <!-- Reflected ocean light sits just inside the moving silhouette. -->
        <feMorphology in="SourceAlpha" operator="erode" radius="18" result="inner-core"/>
        <feComposite in="SourceAlpha" in2="inner-core" operator="out" result="inner-edge"/>
        <feGaussianBlur in="inner-edge" stdDeviation="12" result="inner-soft"/>
        <feComposite in="gradient" in2="inner-soft" operator="in" result="inner-colour"/>
        <feComposite in="inner-colour" in2="SourceAlpha" operator="in" result="inner-clipped"/>
        <feComponentTransfer in="inner-clipped" result="reflected-light"><feFuncA type="linear" slope=".3"/></feComponentTransfer>
        <!-- The real white face supplies its own cyan edge, including the eye rims. -->
        <feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="face-luminance"/>
        <feComponentTransfer in="face-luminance" result="face"><feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0 1 1"/></feComponentTransfer>
        <feImage href="data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1254" height="1254"><g fill="white">${eyes.map((e) => ellipse(e)).join("")}<path d="${beakWindow}"/></g></svg>`)}" x="0" y="0" width="1254" height="1254" result="face-features"/>
        <feComposite in="face" in2="face-features" operator="arithmetic" k2="1" k3="1" result="face-filled"/>
        <feMorphology in="face-filled" operator="dilate" radius="9" result="face-wide"/>
        <feMorphology in="face-filled" operator="erode" radius="5" result="face-core"/>
        <feComposite in="face-wide" in2="face-core" operator="out" result="face-edge"/>
        <feGaussianBlur in="face-edge" stdDeviation="10" result="face-soft"/>
        <feFlood flood-color="#65e1ff" flood-opacity=".48" result="face-colour"/>
        <feComposite in="face-colour" in2="face-soft" operator="in" result="face-glow"/>
        <feFlood flood-color="#80dce9" flood-opacity="0" data-part="aurora-light" result="sparkle-colour"/>
        <feComposite in="sparkle-colour" in2="glow" operator="in" result="sparkle-glow"/>
        <feMerge><feMergeNode in="ambient"/><feMergeNode in="glow"/><feMergeNode in="sparkle-glow"/><feMergeNode in="SourceGraphic"/><feMergeNode in="reflected-light"/><feMergeNode in="face-glow"/><feMergeNode in="rim"/></feMerge>
      </filter>
      <image id="${id}-art" href="${artwork}" width="1254" height="1254"/>
      <clipPath id="${id}-perch-edge" clipPathUnits="userSpaceOnUse"><rect width="1254" height="798"/></clipPath>
      <clipPath id="${id}-beak-window"><path d="${beakWindow}"/></clipPath>
      <clipPath id="${id}-left-wing"><path d="${leftWindow}"/></clipPath>
      <clipPath id="${id}-right-wing"><path d="${rightWindow}"/></clipPath>
      ${eyes.map((e) => `<clipPath id="${id}-${e.name}-eye">${ellipse(e)}</clipPath>`).join("")}
      ${mask("body-mask", `<path d="${leftCut}" fill="black" stroke="white" stroke-width="0"/><path d="${rightCut}" fill="black" stroke="white" stroke-width="0"/>`)}
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
      <!-- Every appearance keeps Classic’s original beak and highlights. -->
      <g data-part="beak">${image(`clip-path="url(#${id}-beak-window)"`)}</g>
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
	if (deepsea) applyClassicCoat(container.querySelector("svg"), id, ["#070e27", "#0a1231"], `
    <defs><radialGradient id="${id}-ocean-depth" cx=".48" cy=".65" r=".43"><stop stop-color="#2459b8" stop-opacity=".8"/><stop offset=".48" stop-color="#194391" stop-opacity=".7"/><stop offset="1" stop-color="#13347a" stop-opacity="0"/></radialGradient></defs>
    <rect width="1254" height="1254" fill="url(#${id}-ocean-depth)"/>`);
	const nodes = Object.fromEntries([...container.querySelectorAll("[data-part]")].map((el) => [el.dataset.part, el]));
	const sparkles = [...container.querySelectorAll("[data-sparkle]")];
	return {
		render(pose) {
			if (deepsea) nodes["aurora-light"].setAttribute("flood-opacity", String(pose.sparkle * .16));
			nodes.motion.setAttribute("transform", `translate(${pose.x} ${pose.y}) translate(635 650) rotate(${pose.rotate}) scale(${pose.sx} ${pose.sy}) translate(-635 -650)`);
			nodes["left-flipper"].setAttribute("transform", `translate(0 ${pose.leftY || 0}) rotate(${pose.left} 320 815)`);
			nodes["right-flipper"].setAttribute("transform", `translate(0 ${pose.rightY || 0}) rotate(${pose.right} 965 785)`);
			nodes.body.setAttribute("clip-path", pose.peek ? `url(#${id}-perch-edge)` : "none");
			if (pose.peek) for (const [part, x, y] of [[
				"left-flipper",
				320,
				815
			], [
				"right-flipper",
				965,
				785
			]]) nodes[part].setAttribute("transform", `${nodes[part].getAttribute("transform")} translate(${x} ${y}) scale(1.35) translate(${-x} ${-y})`);
			for (const eye of eyes) {
				const openness = Math.max(.025, 1 - pose.blink);
				const node = nodes[`${eye.name}-eye`];
				node.setAttribute("transform", `translate(${eye.cx} ${eye.cy}) rotate(-17) scale(1 ${openness}) rotate(17) translate(${-eye.cx} ${-eye.cy})`);
				node.setAttribute("opacity", String(clamp(openness / .22)));
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
	const plumageCoverage = "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 .75 .25 0 0";
	defs.append(element(`<filter id="${uid}-opaque-art" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncA type="linear" slope="0" intercept="1"/></feComponentTransfer></filter>
 <mask id="${uid}-coat-silhouette" maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254" style="mask-type:alpha"><use href="#${uid}-classic-source"/></mask>
 <filter id="${uid}-plumage-selection" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="table" tableValues="${plumageCoverage}"/><feFuncG type="table" tableValues="${plumageCoverage}"/><feFuncB type="table" tableValues="${plumageCoverage}"/><feFuncA type="linear" slope="0" intercept="1"/></feComponentTransfer></filter>
 <mask id="${uid}-plumage-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254" style="mask-type:luminance"><use href="#${uid}-classic-source" filter="url(#${uid}-plumage-selection)"/>${EYES.map((e) => `<ellipse cx="${e.cx}" cy="${e.cy}" rx="${e.rx + 14}" ry="${e.ry + 14}" fill="#000"/>`).join("")}<path d="M574 661Q565 621 600 592Q661 546 739 595L737 632Q737 714 660 716Q612 710 591 665Z" fill="#000"/></mask>
 <linearGradient id="${uid}-coat-gradient" x1="0" y1="0" x2=".5" y2="1"><stop stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient>
 <g id="${uid}-art" mask="url(#${uid}-coat-silhouette)"><use href="#${uid}-classic-source" filter="url(#${uid}-opaque-art)"/><g mask="url(#${uid}-plumage-mask)"><rect width="1254" height="1254" fill="url(#${uid}-coat-gradient)"/><g>${markings}</g></g></g>`));
	for (const part of [
		"left-eye",
		"right-eye",
		"beak"
	]) svg.querySelector(`[data-part="${part}"] use`).setAttribute("href", `#${uid}-classic-source`);
}
//#endregion
//#region \0mythic-body
var _mythic_body_default = new URL("./nivo-body.png", "" + import.meta.url).href;
//#endregion
//#region \0mythic-icon
var _mythic_icon_default = new URL("./mythic-classic-icon.png", "" + import.meta.url).href;
//#endregion
//#region src/myths/measured-fit.js
var fit = {
	"sourceHash": "4e840642427313a39cb064e9c6e58ea9361f3318bfaded49d74796e1785cdadc",
	"origin": [644, 557.5],
	"angle": -16.69924423399362,
	"profile": [
		{
			"x": -380,
			"top": -78,
			"faceTop": null,
			"faceBottom": null
		},
		{
			"x": -375,
			"top": -88,
			"faceTop": null,
			"faceBottom": null
		},
		{
			"x": -370,
			"top": -97,
			"faceTop": null,
			"faceBottom": null
		},
		{
			"x": -365,
			"top": -107,
			"faceTop": null,
			"faceBottom": null
		},
		{
			"x": -360,
			"top": -115,
			"faceTop": null,
			"faceBottom": null
		},
		{
			"x": -355,
			"top": -120,
			"faceTop": null,
			"faceBottom": null
		},
		{
			"x": -350,
			"top": -129,
			"faceTop": null,
			"faceBottom": null
		},
		{
			"x": -345,
			"top": -136,
			"faceTop": null,
			"faceBottom": null
		},
		{
			"x": -340,
			"top": -144,
			"faceTop": null,
			"faceBottom": null
		},
		{
			"x": -335,
			"top": -150,
			"faceTop": -16,
			"faceBottom": 41
		},
		{
			"x": -330,
			"top": -156,
			"faceTop": -32,
			"faceBottom": 58
		},
		{
			"x": -325,
			"top": -161,
			"faceTop": -45,
			"faceBottom": 69
		},
		{
			"x": -320,
			"top": -168,
			"faceTop": -54,
			"faceBottom": 79
		},
		{
			"x": -315,
			"top": -173,
			"faceTop": -61,
			"faceBottom": 88
		},
		{
			"x": -310,
			"top": -179,
			"faceTop": -68,
			"faceBottom": 94
		},
		{
			"x": -305,
			"top": -184,
			"faceTop": -74,
			"faceBottom": 101
		},
		{
			"x": -300,
			"top": -187,
			"faceTop": -80,
			"faceBottom": 108
		},
		{
			"x": -295,
			"top": -194,
			"faceTop": -86,
			"faceBottom": 112
		},
		{
			"x": -290,
			"top": -198,
			"faceTop": -91,
			"faceBottom": 118
		},
		{
			"x": -285,
			"top": -203,
			"faceTop": -95,
			"faceBottom": 124
		},
		{
			"x": -280,
			"top": -208,
			"faceTop": -98,
			"faceBottom": 128
		},
		{
			"x": -275,
			"top": -212,
			"faceTop": -103,
			"faceBottom": 132
		},
		{
			"x": -270,
			"top": -216,
			"faceTop": -107,
			"faceBottom": 137
		},
		{
			"x": -265,
			"top": -221,
			"faceTop": -110,
			"faceBottom": 140
		},
		{
			"x": -260,
			"top": -223,
			"faceTop": -112,
			"faceBottom": 145
		},
		{
			"x": -255,
			"top": -228,
			"faceTop": -115,
			"faceBottom": 149
		},
		{
			"x": -250,
			"top": -233,
			"faceTop": -118,
			"faceBottom": 151
		},
		{
			"x": -245,
			"top": -235,
			"faceTop": -121,
			"faceBottom": 155
		},
		{
			"x": -240,
			"top": -240,
			"faceTop": -123,
			"faceBottom": 158
		},
		{
			"x": -235,
			"top": -243,
			"faceTop": -125,
			"faceBottom": 161
		},
		{
			"x": -230,
			"top": -247,
			"faceTop": -127,
			"faceBottom": 164
		},
		{
			"x": -225,
			"top": -249,
			"faceTop": -129,
			"faceBottom": 167
		},
		{
			"x": -220,
			"top": -252,
			"faceTop": -130,
			"faceBottom": 169
		},
		{
			"x": -215,
			"top": -257,
			"faceTop": -132,
			"faceBottom": 172
		},
		{
			"x": -210,
			"top": -260,
			"faceTop": -133,
			"faceBottom": 175
		},
		{
			"x": -205,
			"top": -264,
			"faceTop": -134,
			"faceBottom": 177
		},
		{
			"x": -200,
			"top": -267,
			"faceTop": -135,
			"faceBottom": 179
		},
		{
			"x": -195,
			"top": -270,
			"faceTop": -136,
			"faceBottom": 181
		},
		{
			"x": -190,
			"top": -273,
			"faceTop": -137,
			"faceBottom": 183
		},
		{
			"x": -185,
			"top": -274,
			"faceTop": -137,
			"faceBottom": 185
		},
		{
			"x": -180,
			"top": -278,
			"faceTop": -138,
			"faceBottom": 187
		},
		{
			"x": -175,
			"top": -281,
			"faceTop": -139,
			"faceBottom": 189
		},
		{
			"x": -170,
			"top": -284,
			"faceTop": -138,
			"faceBottom": 191
		},
		{
			"x": -165,
			"top": -286,
			"faceTop": -139,
			"faceBottom": 192
		},
		{
			"x": -160,
			"top": -289,
			"faceTop": -138,
			"faceBottom": 194
		},
		{
			"x": -155,
			"top": -292,
			"faceTop": -138,
			"faceBottom": 195
		},
		{
			"x": -150,
			"top": -295,
			"faceTop": -137,
			"faceBottom": 197
		},
		{
			"x": -145,
			"top": -297,
			"faceTop": -137,
			"faceBottom": 198
		},
		{
			"x": -140,
			"top": -299,
			"faceTop": -137,
			"faceBottom": 200
		},
		{
			"x": -135,
			"top": -302,
			"faceTop": -135,
			"faceBottom": 201
		},
		{
			"x": -130,
			"top": -304,
			"faceTop": -135,
			"faceBottom": 203
		},
		{
			"x": -125,
			"top": -306,
			"faceTop": -133,
			"faceBottom": 204
		},
		{
			"x": -120,
			"top": -308,
			"faceTop": -132,
			"faceBottom": 205
		},
		{
			"x": -115,
			"top": -311,
			"faceTop": -130,
			"faceBottom": 206
		},
		{
			"x": -110,
			"top": -313,
			"faceTop": -128,
			"faceBottom": 208
		},
		{
			"x": -105,
			"top": -315,
			"faceTop": -126,
			"faceBottom": 208
		},
		{
			"x": -100,
			"top": -317,
			"faceTop": -123,
			"faceBottom": 209
		},
		{
			"x": -95,
			"top": -318,
			"faceTop": -121,
			"faceBottom": 210
		},
		{
			"x": -90,
			"top": -321,
			"faceTop": -117,
			"faceBottom": 211
		},
		{
			"x": -85,
			"top": -323,
			"faceTop": -115,
			"faceBottom": 212
		},
		{
			"x": -80,
			"top": -324,
			"faceTop": -111,
			"faceBottom": 212
		},
		{
			"x": -75,
			"top": -326,
			"faceTop": -108,
			"faceBottom": 213
		},
		{
			"x": -70,
			"top": -327,
			"faceTop": -103,
			"faceBottom": 213
		},
		{
			"x": -65,
			"top": -329,
			"faceTop": -97,
			"faceBottom": 214
		},
		{
			"x": -60,
			"top": -330,
			"faceTop": -93,
			"faceBottom": 215
		},
		{
			"x": -55,
			"top": -331,
			"faceTop": -87,
			"faceBottom": 216
		},
		{
			"x": -50,
			"top": -333,
			"faceTop": -80,
			"faceBottom": 216
		},
		{
			"x": -45,
			"top": -335,
			"faceTop": -74,
			"faceBottom": 217
		},
		{
			"x": -40,
			"top": -335,
			"faceTop": -65,
			"faceBottom": 216
		},
		{
			"x": -35,
			"top": -337,
			"faceTop": -54,
			"faceBottom": 217
		},
		{
			"x": -30,
			"top": -337,
			"faceTop": -41,
			"faceBottom": 217
		},
		{
			"x": -25,
			"top": -339,
			"faceTop": -23,
			"faceBottom": 218
		},
		{
			"x": -20,
			"top": -339,
			"faceTop": -23,
			"faceBottom": 218
		},
		{
			"x": -15,
			"top": -340,
			"faceTop": -24,
			"faceBottom": 217
		},
		{
			"x": -10,
			"top": -341,
			"faceTop": -23,
			"faceBottom": 218
		},
		{
			"x": -5,
			"top": -341,
			"faceTop": -23,
			"faceBottom": 218
		},
		{
			"x": 0,
			"top": -342,
			"faceTop": -33,
			"faceBottom": 218
		},
		{
			"x": 5,
			"top": -343,
			"faceTop": -49,
			"faceBottom": 218
		},
		{
			"x": 10,
			"top": -343,
			"faceTop": -62,
			"faceBottom": 218
		},
		{
			"x": 15,
			"top": -343,
			"faceTop": -72,
			"faceBottom": 218
		},
		{
			"x": 20,
			"top": -343,
			"faceTop": -79,
			"faceBottom": 217
		},
		{
			"x": 25,
			"top": -342,
			"faceTop": -87,
			"faceBottom": 217
		},
		{
			"x": 30,
			"top": -341,
			"faceTop": -93,
			"faceBottom": 217
		},
		{
			"x": 35,
			"top": -340,
			"faceTop": -99,
			"faceBottom": 217
		},
		{
			"x": 40,
			"top": -338,
			"faceTop": -103,
			"faceBottom": 216
		},
		{
			"x": 45,
			"top": -337,
			"faceTop": -107,
			"faceBottom": 216
		},
		{
			"x": 50,
			"top": -334,
			"faceTop": -112,
			"faceBottom": 215
		},
		{
			"x": 55,
			"top": -269,
			"faceTop": -116,
			"faceBottom": 215
		},
		{
			"x": 60,
			"top": -268,
			"faceTop": -119,
			"faceBottom": 215
		},
		{
			"x": 65,
			"top": -267,
			"faceTop": -122,
			"faceBottom": 213
		},
		{
			"x": 70,
			"top": -266,
			"faceTop": -125,
			"faceBottom": 213
		},
		{
			"x": 75,
			"top": -264,
			"faceTop": -127,
			"faceBottom": 212
		},
		{
			"x": 80,
			"top": -263,
			"faceTop": -130,
			"faceBottom": 211
		},
		{
			"x": 85,
			"top": -261,
			"faceTop": -132,
			"faceBottom": 211
		},
		{
			"x": 90,
			"top": -260,
			"faceTop": -134,
			"faceBottom": 209
		},
		{
			"x": 95,
			"top": -258,
			"faceTop": -136,
			"faceBottom": 209
		},
		{
			"x": 100,
			"top": -257,
			"faceTop": -137,
			"faceBottom": 208
		},
		{
			"x": 105,
			"top": -255,
			"faceTop": -139,
			"faceBottom": 207
		},
		{
			"x": 110,
			"top": -253,
			"faceTop": -140,
			"faceBottom": 206
		},
		{
			"x": 115,
			"top": -251,
			"faceTop": -141,
			"faceBottom": 204
		},
		{
			"x": 120,
			"top": -249,
			"faceTop": -142,
			"faceBottom": 203
		},
		{
			"x": 125,
			"top": -246,
			"faceTop": -143,
			"faceBottom": 202
		},
		{
			"x": 130,
			"top": -243,
			"faceTop": -143,
			"faceBottom": 200
		},
		{
			"x": 135,
			"top": -241,
			"faceTop": -144,
			"faceBottom": 199
		},
		{
			"x": 140,
			"top": -239,
			"faceTop": -144,
			"faceBottom": 197
		},
		{
			"x": 145,
			"top": -237,
			"faceTop": -144,
			"faceBottom": 196
		},
		{
			"x": 150,
			"top": -234,
			"faceTop": -143,
			"faceBottom": 194
		},
		{
			"x": 155,
			"top": -232,
			"faceTop": -144,
			"faceBottom": 192
		},
		{
			"x": 160,
			"top": -228,
			"faceTop": -144,
			"faceBottom": 191
		},
		{
			"x": 165,
			"top": -226,
			"faceTop": -143,
			"faceBottom": 189
		},
		{
			"x": 170,
			"top": -222,
			"faceTop": -142,
			"faceBottom": 186
		},
		{
			"x": 175,
			"top": -218,
			"faceTop": -141,
			"faceBottom": 184
		},
		{
			"x": 180,
			"top": -216,
			"faceTop": -140,
			"faceBottom": 181
		},
		{
			"x": 185,
			"top": -212,
			"faceTop": -138,
			"faceBottom": 178
		},
		{
			"x": 190,
			"top": -209,
			"faceTop": -137,
			"faceBottom": 176
		},
		{
			"x": 195,
			"top": -205,
			"faceTop": -135,
			"faceBottom": 173
		},
		{
			"x": 200,
			"top": -202,
			"faceTop": -133,
			"faceBottom": 170
		},
		{
			"x": 205,
			"top": -198,
			"faceTop": -131,
			"faceBottom": 167
		},
		{
			"x": 210,
			"top": -192,
			"faceTop": -129,
			"faceBottom": 164
		},
		{
			"x": 215,
			"top": -189,
			"faceTop": -125,
			"faceBottom": 160
		},
		{
			"x": 220,
			"top": -184,
			"faceTop": -121,
			"faceBottom": 155
		},
		{
			"x": 225,
			"top": -179,
			"faceTop": -118,
			"faceBottom": 153
		},
		{
			"x": 230,
			"top": -175,
			"faceTop": -113,
			"faceBottom": 147
		},
		{
			"x": 235,
			"top": -168,
			"faceTop": -110,
			"faceBottom": 142
		},
		{
			"x": 240,
			"top": -163,
			"faceTop": -104,
			"faceBottom": 137
		},
		{
			"x": 245,
			"top": -158,
			"faceTop": -98,
			"faceBottom": 131
		},
		{
			"x": 250,
			"top": -151,
			"faceTop": -92,
			"faceBottom": 125
		},
		{
			"x": 255,
			"top": -144,
			"faceTop": -85,
			"faceBottom": 118
		},
		{
			"x": 260,
			"top": -139,
			"faceTop": -76,
			"faceBottom": 109
		},
		{
			"x": 265,
			"top": -131,
			"faceTop": -66,
			"faceBottom": 99
		},
		{
			"x": 270,
			"top": -123,
			"faceTop": -54,
			"faceBottom": 88
		},
		{
			"x": 275,
			"top": -114,
			"faceTop": -39,
			"faceBottom": 73
		},
		{
			"x": 280,
			"top": -107,
			"faceTop": -17,
			"faceBottom": 49
		},
		{
			"x": 285,
			"top": -96,
			"faceTop": null,
			"faceBottom": null
		},
		{
			"x": 290,
			"top": -86,
			"faceTop": null,
			"faceBottom": null
		},
		{
			"x": 295,
			"top": -74,
			"faceTop": null,
			"faceBottom": null
		},
		{
			"x": 300,
			"top": -60,
			"faceTop": null,
			"faceBottom": null
		},
		{
			"x": 305,
			"top": -44,
			"faceTop": null,
			"faceBottom": null
		},
		{
			"x": 310,
			"top": -26,
			"faceTop": null,
			"faceBottom": null
		},
		{
			"x": 315,
			"top": 2,
			"faceTop": null,
			"faceBottom": null
		},
		{
			"x": 320,
			"top": null,
			"faceTop": null,
			"faceBottom": null
		}
	],
	"band": {
		"center": -40,
		"radius": 255,
		"lowerCenter": -170,
		"thickness": 35,
		"lo": -360,
		"hi": 270
	},
	"capHull": [
		[-360, -115],
		[-340, -144],
		[-320, -168],
		[-310, -179],
		[-295, -194],
		[-280, -208],
		[-265, -221],
		[-250, -233],
		[-230, -247],
		[-205, -264],
		[-190, -273],
		[-150, -295],
		[-135, -302],
		[-115, -311],
		[-85, -323],
		[-45, -335],
		[-25, -339],
		[5, -343],
		[20, -343],
		[35, -340],
		[45, -337],
		[50, -334],
		[205, -198],
		[215, -189],
		[230, -175],
		[245, -158],
		[260, -139],
		[270, -123]
	],
	"collar": [
		[-315, 88],
		[-310, 94],
		[-305, 101],
		[-300, 108],
		[-295, 112],
		[-290, 118],
		[-285, 124],
		[-280, 128],
		[-275, 132],
		[-270, 137],
		[-265, 140],
		[-260, 145],
		[-255, 149],
		[-250, 151],
		[-245, 155],
		[-240, 158],
		[-235, 161],
		[-230, 164],
		[-225, 167],
		[-220, 169],
		[-215, 172],
		[-210, 175],
		[-205, 177],
		[-200, 179],
		[-195, 181],
		[-190, 183],
		[-185, 185],
		[-180, 187],
		[-175, 189],
		[-170, 191],
		[-165, 192],
		[-160, 194],
		[-155, 195],
		[-150, 197],
		[-145, 198],
		[-140, 200],
		[-135, 201],
		[-130, 203],
		[-125, 204],
		[-120, 205],
		[-115, 206],
		[-110, 208],
		[-105, 208],
		[-100, 209],
		[-95, 210],
		[-90, 211],
		[-85, 212],
		[-80, 212],
		[-75, 213],
		[-70, 213],
		[-65, 214],
		[-60, 215],
		[-55, 216],
		[-50, 216],
		[-45, 217],
		[-40, 216],
		[-35, 217],
		[-30, 217],
		[-25, 218],
		[-20, 218],
		[-15, 217],
		[-10, 218],
		[-5, 218],
		[0, 218],
		[5, 218],
		[10, 218],
		[15, 218],
		[20, 217],
		[25, 217],
		[30, 217],
		[35, 217],
		[40, 216],
		[45, 216],
		[50, 215],
		[55, 215],
		[60, 215],
		[65, 213],
		[70, 213],
		[75, 212],
		[80, 211],
		[85, 211],
		[90, 209],
		[95, 209],
		[100, 208],
		[105, 207],
		[110, 206],
		[115, 204],
		[120, 203],
		[125, 202],
		[130, 200],
		[135, 199],
		[140, 197],
		[145, 196],
		[150, 194],
		[155, 192],
		[160, 191],
		[165, 189],
		[170, 186],
		[175, 184],
		[180, 181],
		[185, 178],
		[190, 176],
		[195, 173],
		[200, 170],
		[205, 167],
		[210, 164],
		[215, 160],
		[220, 155],
		[225, 153],
		[230, 147],
		[235, 142],
		[240, 137],
		[245, 131],
		[250, 125],
		[255, 118],
		[260, 109]
	]
};
//#endregion
//#region src/myths/art.js
var group = (markup) => {
	const node = document.createElementNS("http://www.w3.org/2000/svg", "g");
	node.innerHTML = markup;
	return node;
};
var path = (d, fill, extra = "") => `<path d="${d}" fill="${fill}" ${extra}/>`;
var line = (d, stroke, width = 4, extra = "") => path(d, "none", `stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}`);
var gold = (u) => `url(#${u}-gold)`;
var silver = (u) => `url(#${u}-silver)`;
var gem = (x, y, fill, size = 14) => `<path d="M${x} ${y - size}l${size * .75} ${size}l-${size * .75} ${size}l-${size * .75}-${size}Z" fill="${fill}"/>`;
var sparkle = (x, y, s, color) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0-16Q3-3 16 0Q3 3 0 16Q-3 3-16 0Q-3-3 0-16Z" fill="${color}"/>`;
var EYE_COLORS = {
	anubis: "#68441f",
	horus: "#1c4e84",
	athena: "#3b5347",
	hermes: "#634432",
	poseidon: "#145a66",
	artemis: "#3c5274",
	apollo: "#79501d",
	zeus: "#385983",
	medusa: "#80642a",
	hades: "#74506d"
};
function eyeTint(u, color) {
	return `<filter id="${u}-eye-tint" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer>${color.match(/[0-9a-f]{2}/gi).map((v) => parseInt(v, 16) / 255).map((v, i) => `<feFunc${[
		"R",
		"G",
		"B"
	][i]} type="linear" slope="${1 - v}" intercept="${v}"/>`).join("")}</feComponentTransfer></filter>`;
}
function defs(u) {
	return `<linearGradient id="${u}-gold" x1=".15" y1="0" x2=".85" y2="1"><stop stop-color="#fff0be"/><stop offset=".32" stop-color="#deb66c"/><stop offset=".68" stop-color="#ac793c"/><stop offset="1" stop-color="#f0d394"/></linearGradient>
  <linearGradient id="${u}-bronze" x2=".8" y2="1"><stop stop-color="#e7c997"/><stop offset=".42" stop-color="#b58a50"/><stop offset="1" stop-color="#79613c"/></linearGradient>
  <linearGradient id="${u}-obsidian" x2=".8" y2="1"><stop stop-color="#7d718f"/><stop offset=".4" stop-color="#393347"/><stop offset=".75" stop-color="#211e30"/><stop offset="1" stop-color="#72657e"/></linearGradient>
  <linearGradient id="${u}-silver" x2=".7" y2="1"><stop stop-color="#ffffff"/><stop offset=".4" stop-color="#e0e9ee"/><stop offset="1" stop-color="#8eabc3"/></linearGradient>
  <linearGradient id="${u}-ear" x2=".7" y2="1"><stop stop-color="#354157"/><stop offset=".5" stop-color="#1a243a"/><stop offset="1" stop-color="#485368"/></linearGradient>
  <linearGradient id="${u}-coral" x2=".8" y2="1"><stop stop-color="#ffe0bb"/><stop offset=".4" stop-color="#f0ae81"/><stop offset="1" stop-color="#c98364"/></linearGradient>
  <radialGradient id="${u}-sheen" cx=".35" cy=".2" r=".8"><stop stop-color="#fff9de" stop-opacity=".26"/><stop offset="1" stop-color="#fff9de" stop-opacity="0"/></radialGradient>`;
}
function band(u, fill = gold(u)) {
	return path("M-285 94C-260-10-120-40-20-40C120-40 240-5 285 94L278 123C235 20 120-12-20-12C-130-10-245 35-278 123Z", fill) + line("M-270 89C-237-5-115-32-20-32C116-32 229 3 270 88", "#fff1c7", 4, "opacity=\".65\"");
}
function wing(u, color = silver(u)) {
	return path("M0 0C-34-42-40-99-21-139C-11-146-9-124-3-110C5-148 20-167 27-158C35-146 15-105 24-103C49-131 65-135 66-123C67-110 46-79 35-61C59-75 75-78 76-65C75-42 40-10 0 0Z", color) + line("M3-17Q18-54 35-83M-2-29Q-10-67-11-96", "#b5bdc3", 3, "opacity=\".55\"");
}
function leafBranch(u, flip = false) {
	return `<g transform="${flip ? "scale(-1 1)" : ""}">${line("M0 0Q-105-21-149-119", gold(u), 8)}${[
		-100,
		-74,
		-46,
		-18
	].map((y, i) => `<ellipse cx="${-139 + i * 27}" cy="${y}" rx="13" ry="29" fill="${gold(u)}" transform="rotate(${-42 + i * 7} ${-139 + i * 27} ${y})"/><ellipse cx="${-109 + i * 26}" cy="${y + 3}" rx="11" ry="24" fill="${gold(u)}" transform="rotate(30 ${-109 + i * 26} ${y + 3})"/>`).join("")}</g>`;
}
var MEDUSA_CURLS = [
	{
		x: -244,
		angle: -28,
		flip: -1,
		scale: .82
	},
	{
		x: -124,
		angle: -14,
		flip: -1,
		scale: 1.04
	},
	{
		x: 0,
		angle: 5,
		flip: 1,
		scale: 1.13
	},
	{
		x: 124,
		angle: 16,
		flip: 1,
		scale: 1.02
	},
	{
		x: 244,
		angle: 30,
		flip: 1,
		scale: .82
	}
];
function littleSnake(index) {
	const skin = [
		"#408368",
		"#5b9b77",
		"#367b61",
		"#69a17c",
		"#458c70"
	][index];
	const neck = "M0-12C-51-24-66-66-38-103C-11-138 38-130 30-174";
	return `<g data-myth-motion="snake" data-index="${index}">
    ${line(neck, "#204f43", 58)}${line(neck, skin, 48)}
    ${line("M-5-17C-42-31-49-63-25-95C-5-120 22-124 27-148", "#a5c99a", 13)}
    ${[
		-1,
		0,
		1
	].map((i) => line(`M${-34 + i * 5} ${-51 - i * 17}l18-4`, "#4c8264", 3, "opacity=\".65\"")).join("")}
    ${path("M-9-190C-5-219 32-225 56-207C77-205 80-182 60-170C44-151 7-152-7-171Z", skin, "stroke=\"#204f43\" stroke-width=\"5\" stroke-linejoin=\"round\"")}
    ${path("M-3-174Q29-158 64-178Q49-153 18-159Q2-162-3-174Z", "#a5c99a")}
    ${line("M4-197Q16-210 34-207", "#a6cba1", 5, "opacity=\".75\"")}
    <ellipse cx="42" cy="-191" rx="10" ry="12" fill="#e9c978"/>
    <ellipse cx="44" cy="-190" rx="4" ry="7" fill="#1c3931"/><circle cx="40" cy="-195" r="3" fill="#fff8d9"/>
    <circle cx="66" cy="-184" r="2.5" fill="#204f43"/>
    ${line("M48-173q11 4 19-2", "#285747", 3)}
  </g>`;
}
function medusaIconCrown(u) {
	return [
		[
			38,
			77,
			.18
		],
		[
			80,
			64,
			.23
		],
		[
			128,
			60,
			.24
		],
		[
			176,
			64,
			.23
		],
		[
			218,
			77,
			.18
		]
	].map(([x, y, size], i) => `<g transform="translate(${x} ${y}) rotate(${MEDUSA_CURLS[i].angle}) scale(${MEDUSA_CURLS[i].flip * size} ${size})">${littleSnake(i)}</g>`).join("") + path("M25 85Q128 30 231 85L231 92Q128 43 25 92Z", "#316750") + line("M26 85Q128 31 230 85", "#d7c894", 1.5) + gem(128, 61, gold(u), 8) + gem(128, 61, "#b4d09b", 4);
}
function medusaScales(scale = 1) {
	return `<g transform="scale(${scale})">${[
		3,
		4,
		3
	].map((count, row) => Array.from({ length: count }, (_, i) => {
		return `<g transform="translate(${(i - (count - 1) / 2) * 49} ${row * 35})">${path("M-21-10Q0-1 21-10Q22 11 0 26Q-22 11-21-10Z", "#b6ce9c", "fill-opacity=\".2\"")}${line("M-21-10Q-22 11 0 26Q22 11 21-10", "#c4d6a7", 3, "opacity=\".65\"")}</g>`;
	}).join("")).join("")}</g>`;
}
function headpiece(id, u) {
	if (id === "hades") return `${[
		-2,
		-1,
		0,
		1,
		2
	].map((n) => `<g transform="translate(${n * 100} ${-25 + .0016 * (n * 100) ** 2})">${crownPoint(u, n)}</g>`).join("")}${band(u, `url(#${u}-obsidian)`)}${gem(0, -23, "#b3829b", 23)}`;
	if (id === "medusa") return `${MEDUSA_CURLS.map((c, i) => `<g transform="translate(${c.x} ${-25 + .0016 * c.x * c.x}) rotate(${c.angle}) scale(${c.flip * c.scale} ${c.scale * .82})">${littleSnake(i)}</g>`).join("")}${band(u, "#316750")}${gem(0, -23, gold(u), 29)}${gem(0, -23, "#b4d09b", 17)}`;
	if (id === "zeus") return `${[-1, 1].map((s) => [
		0,
		1,
		2,
		3
	].map((i) => {
		const x = s * (70 + i * 50);
		return `<g transform="translate(${x} ${-25 + .0016 * x * x}) rotate(${s * (28 + i * 7)}) scale(.78)">${path("M0 9C-30-14-34-58 0-92C34-58 30-14 0 9Z", gold(u))}${line("M0-8V-69", "#fff0c1", 4)}</g>`;
	}).join("")).join("")}${band(u)}${gem(0, -23, "#779cbe", 22)}`;
	if (id === "anubis") return `<g data-fitted="ears">${[-1, 1].map((s) => `<g transform="translate(${s * 190} 30) rotate(${s * 12})">${path("M-70 18C-79-62-58-195-12-253Q0-270 11-248C51-175 70-52 59 17Z", `url(#${u}-ear)`)}${path("M-40-5Q-47-108-7-205Q27-116 30-23Z", "#a78356")}${path("M-25-21Q-30-103-7-162Q7-84 13-31Z", "#dec391")}</g>`).join("")}${band(u)}${gem(0, -25, "#32678b", 24)}</g>`;
	if (id === "horus") return `${band(u)}<g>${[
		-2,
		-1,
		0,
		1,
		2
	].map((n) => `<g transform="translate(${n * 48} ${-20 + Math.abs(n) * 10}) rotate(${n * 16})">${path("M-20 0Q-29-71 0-123Q29-71 20 0Z", gold(u))}${line("M0-19V-98", "#816337", 3)}</g>`).join("")}${gem(0, -24, "#255a93", 25)}</g>`;
	if (id === "athena") return `<g>${path("M-285 94C-286-35-182-149-35-152C137-159 276-28 285 94L278 123C235 20 120-12-20-12C-130-10-245 35-278 123Z", `url(#${u}-bronze)`)}${path("M-174-104Q-80-200 64-187Q162-174 179-134Q12-164-99-87Z", "#6f3f3a")}${line("M-147-116Q-47-175 110-150", "#bd8373", 9)}${line("M-253 4Q-212-99-100-127", "#f9dfac", 6, "opacity=\".75\"")}${band(u, `url(#${u}-bronze)`)}${gem(0, -23, "#5a7563", 19)}${path("M-281 110L-275 168Q-240 178-220 136L-229 48Z", `url(#${u}-bronze)`)}${path("M280 110L273 160Q239 167 220 129L229 48Z", `url(#${u}-bronze)`)}</g>`;
	if (id === "hermes") return `<g>${path("M-285 94C-270-20-161-130-7-137C151-143 270-8 285 94L278 123C235 20 120-12-20-12C-130-10-245 35-278 123Z", "#bf8c60")}${band(u)}${line("M-154-35Q-62-112 53-91", "#f2cf9a", 6)}<g transform="translate(-226 30) rotate(-30)"><g data-myth-motion="wing-left">${wing(u)}</g></g><g transform="translate(226 30) scale(-1 1) rotate(-30)"><g data-myth-motion="wing-right">${wing(u)}</g></g>${line("M-156-2Q0-40 157-2", "#855439", 5)}</g>`;
	if (id === "poseidon") return `<g>${[-1, 1].map((s) => `<g transform="translate(${s * 174} 25) scale(${s} 1)">${line("M0 0Q-21-65-16-127M-13-76Q-52-86-61-124M-15-102Q15-118 22-149M-17-34Q-68-32-87-68", `url(#${u}-coral)`, 27)}${line("M-17-12Q-28-70-23-109", "#ffe0bd", 6, "opacity=\".8\"")}</g>`).join("")}${band(u, `url(#${u}-coral)`)}${gem(0, -23, "#468f8c", 26)}${[
		-113,
		-67,
		67,
		113
	].map((x) => `<circle cx="${x}" cy="${-21 + Math.abs(x) * .08}" r="8" fill="#fff1d3"/>`).join("")}</g>`;
	if (id === "artemis") return `<g>${band(u, silver(u))}<g transform="translate(35 -76) scale(.65)">${path("M30-101C-79-97-107 55-5 85C-148 95-176-102-52-133Q-4-144 30-101Z", silver(u))}</g>${gem(0, -23, "#6d91a8", 17)}${[
		-148,
		-88,
		88,
		148
	].map((x) => sparkle(x, -20 + Math.abs(x) * .08, .42, "#f0f6fa")).join("")}</g>`;
	return `<g data-fitted="sun"><g transform="translate(0 -28)">${Array.from({ length: 9 }, (_, i) => `<g transform="rotate(${-85 + i * 21.25})">${path("M-15-122L0-205L15-122Z", gold(u))}</g>`).join("")}${path("M-128 2A128 128 0 0 1 128 2L97 2A97 97 0 0 0-97 2Z", gold(u))}${leafBranch(u)}${leafBranch(u, true)}</g>${band(u)}${gem(0, -23, "#cf8d48", 22)}</g>`;
}
var frame = (markup) => `<g transform="translate(${fit.origin.join(" ")}) rotate(${fit.angle})">${markup}</g>`;
var round = (n) => Math.round(n * 100) / 100;
var curve = (points) => points.map(([x, y], i) => `${i ? "L" : "M"}${round(x)} ${round(y)}`).join("");
var bandY = (x, edge = 0) => fit.band.lowerCenter + 35 * ((x - fit.band.center) / fit.band.radius) ** 2 - edge * fit.band.thickness;
var bandPoints = (edge) => Array.from({ length: 101 }, (_, i) => {
	const x = fit.band.lo + (fit.band.hi - fit.band.lo) * i / 100;
	return [x, bandY(x, edge)];
});
var bandPath = (top = 1, bottom = 0) => curve(bandPoints(top)) + curve(bandPoints(bottom).reverse()).replace(/^M/, "L") + "Z";
var foreheadAnchor = (x) => [x, bandY(x, .5)];
var sourceTop = (x) => fit.profile.reduce((best, p) => p.top !== null && Math.abs(p.x - x) < Math.abs(best.x - x) ? p : best, fit.profile.find((p) => p.top !== null)).top;
var at = (point, markup, extra = "") => `<g transform="translate(${point.map(round).join(" ")}) ${extra}">${markup}</g>`;
function fittedBand(u, fill = gold(u)) {
	return `<g mask="url(#${u}-coat-silhouette)">${frame(line(curve(bandPoints(0).map(([x, y]) => [x, y + 4])), "#101e29", 12, "opacity=\".18\"") + path(bandPath(), fill) + line(curve(bandPoints(.82)), "#fff4cf", 4, "opacity=\".7\"") + line(curve(bandPoints(.08)), "#77552c", 3, "opacity=\".35\""))}</g>`;
}
function capShell(u, id) {
	const upper = fit.capHull.map(([x, y]) => [fit.band.center + (x - fit.band.center) * 1.025, y - 16]);
	let outline = `M${round(upper[0][0])} ${round(upper[0][1])}`;
	for (let i = 0; i < upper.length - 1; i++) {
		const p0 = upper[Math.max(0, i - 1)], p1 = upper[i], p2 = upper[i + 1], p3 = upper[Math.min(upper.length - 1, i + 2)];
		outline += `C${round(p1[0] + (p2[0] - p0[0]) / 6)} ${round(p1[1] + (p2[1] - p0[1]) / 6)} ${round(p2[0] - (p3[0] - p1[0]) / 6)} ${round(p2[1] - (p3[1] - p1[1]) / 6)} ${round(p2[0])} ${round(p2[1])}`;
	}
	const base = bandPoints(0).reverse();
	const material = id === "athena" ? `url(#${u}-bronze)` : "#bf8c60";
	return path(outline + curve(base).replace(/^M/, "L") + "Z", material) + line(curve(upper.slice(3, -5).map(([x, y]) => [x + 6, y + 14])), "#f9dfac", 5, "opacity=\".6\"");
}
function jackalEar(u) {
	return path("M-61 36C-72-36-48-183-9-232Q0-249 11-231C49-166 67-36 55 35Z", `url(#${u}-ear)`) + path("M-35 15Q-43-98-4-191Q26-104 30 12Z", "#c1a477") + path("M-20 0Q-25-89-4-155Q8-76 13 1Z", "#e5c992");
}
function crownPoint(u, n) {
	const height = n === 0 ? 146 : Math.abs(n) === 1 ? 112 : 88;
	return path(`M-54 3L-49-36L-21-${height - 22}L0-${height}L21-${height - 22}L49-36L54 3Z`, `url(#${u}-obsidian)`) + line(`M-31-32L0-${height - 16}L31-32`, "#a297b0", 4, "opacity=\".7\"");
}
function measuredHead(id, u) {
	const center = fit.band.center;
	const jewel = at(foreheadAnchor(center), gem(0, 0, id === "anubis" ? "#32678b" : id === "horus" ? "#255a93" : id === "poseidon" ? "#468f8c" : id === "artemis" ? "#6d91a8" : id === "athena" ? "#5a7563" : id === "medusa" ? "#b4d09b" : id === "hades" ? "#b3829b" : "#cf8d48", 18));
	let back = "", detail = "", cap = "";
	if (id === "anubis") back = frame([-220, 130].map((x, i) => at([x, sourceTop(x) + 57], jackalEar(u), `rotate(${i ? 10 : -10})`)).join(""));
	if (id === "horus") detail = [
		-2,
		-1,
		0,
		1,
		2
	].map((n) => {
		const x = center + n * 48, [, y] = foreheadAnchor(x);
		return at([x, y], path("M-20 12Q-30-74 0-153Q30-74 20 12Z", gold(u)) + line("M0-12V-126", "#816337", 3), `rotate(${n * 12})`);
	}).join("");
	if (id === "athena" || id === "hermes") cap = capShell(u, id);
	if (id === "athena") {
		const ridge = fit.capHull.filter(([x]) => x >= -230 && x <= 45).map(([x, y]) => [x, y - 28]);
		detail = path(curve(ridge) + curve(ridge.slice().reverse().map(([x, y]) => [x + 12, y - 36])).replace(/^M/, "L") + "Z", "#854b44") + line(curve(ridge.map(([x, y]) => [x + 4, y - 12])), "#bd8373", 6);
	}
	if (id === "hermes") detail = [-290, 195].map((x, i) => at([x, bandY(x, .5) - 12], `<g data-myth-motion="${i ? "wing-right" : "wing-left"}">${wing(u)}</g>`, `scale(${i ? -1 : 1} 1) rotate(-24)`)).join("");
	if (id === "poseidon") detail = [-225, 140].map((x, i) => at(foreheadAnchor(x), line("M0 6Q-21-65-16-127M-13-76Q-52-86-61-124M-15-102Q15-118 22-149M-17-34Q-68-32-87-68", `url(#${u}-coral)`, 25) + line("M-17-12Q-28-70-23-109", "#ffe0bd", 5, "opacity=\".7\""), `scale(${i ? 1 : -1} 1)`)).join("");
	if (id === "artemis") {
		const [, y] = foreheadAnchor(center);
		detail = at([center + 42, y - 60], path("M30-101C-79-97-107 55-5 85C-148 95-176-102-52-133Q-4-144 30-101Z", silver(u)), "scale(.7)");
	}
	if (id === "apollo") {
		const [, y] = foreheadAnchor(center);
		detail = at([center, y - 8], Array.from({ length: 9 }, (_, i) => `<g transform="rotate(${-76 + i * 19})">${path("M-12-119L0-189L12-119Z", gold(u))}</g>`).join("") + path("M-120 9A120 120 0 0 1 120 9L91 9A91 91 0 0 0-91 9Z", gold(u)));
	}
	if (id === "zeus") detail = [-1, 1].map((s) => [
		0,
		1,
		2,
		3
	].map((i) => {
		const x = center + s * (80 + i * 57), [, y] = foreheadAnchor(x);
		return at([x, y - 5], path("M0 9C-30-14-34-58 0-92C34-58 30-14 0 9Z", gold(u)) + line("M0-8V-69", "#fff0c1", 4), `rotate(${s * (28 + i * 7)}) scale(.78)`);
	}).join("")).join("");
	if (id === "medusa") detail = MEDUSA_CURLS.map((c, i) => at(foreheadAnchor(center + c.x), littleSnake(i), `rotate(${c.angle}) scale(${c.flip * c.scale} ${c.scale})`)).join("");
	if (id === "hades") detail = [
		-2,
		-1,
		0,
		1,
		2
	].map((n) => at(foreheadAnchor(center + n * 105), crownPoint(u, n))).join("");
	const metal = id === "hades" ? `url(#${u}-obsidian)` : id === "poseidon" ? `url(#${u}-coral)` : id === "artemis" ? silver(u) : id === "medusa" ? "#316750" : id === "athena" ? `url(#${u}-bronze)` : gold(u);
	return {
		back,
		front: frame(cap + detail) + fittedBand(u, metal) + frame(jewel)
	};
}
function collar(u, blue) {
	const upper = fit.collar.map(([x, y]) => [x, y + 12]);
	const lower = fit.collar.map(([x, y]) => [x, y + 63]);
	const ribbon = (a, b) => curve(fit.collar.map(([x, y]) => [x, y + a])) + curve(fit.collar.slice().reverse().map(([x, y]) => [x, y + b])).replace(/^M/, "L") + "Z";
	const inlays = fit.collar.filter((_, i) => i % 10 === 3).map(([x, y]) => line(`M${x} ${y + 21}V${y + 54}`, gold(u), 8)).join("");
	return `<g data-fitted="collar" mask="url(#${u}-coat-silhouette)">${frame(path(ribbon(12, 63), gold(u)) + path(ribbon(22, 53), blue) + inlays + line(curve(upper), "#fbe5ac", 3) + line(curve(lower), "#fff0ba", 3))}</g>`;
}
function ankh(u) {
	return `${path("M-18 7C-88-13-59-107-9-104C43-99 47-17 4 5L2 29H44V52H2V107H-22V52H-65V29H-23ZM-13-21C16-35 14-75-11-77C-36-79-47-36-13-21Z", gold(u))}${line("M-9 60V94", "#fff0b7", 4)}`;
}
function owl(u) {
	return `<g>${path("M-66 40Q-79-3-60-42L-66-70L-28-53Q0-64 28-53L65-70L60-40Q79-5 63 42Q0 85-66 40Z", "#8a6650")}${path("M-52 28Q-57-20-31-32Q0-16 32-32Q58-19 51 28Q0 65-52 28Z", "#e6d3aa")}${[-27, 27].map((x) => `<circle cx="${x}" cy="-11" r="20" fill="#fcf5df"/><g data-myth-motion="owl-eye"><circle cx="${x}" cy="-11" r="9" fill="#303e3d"/><circle cx="${x - 3}" cy="-15" r="3" fill="white"/></g>`).join("")}${path("M-8 9L0 22L9 9Z", gold(u))}${line("M-15 32l7 5M8 37l7-5", "#b19874", 4)}${line("M-32 63l-10 8M-23 65l-2 8M25 65l2 8M34 63l10 8", gold(u), 7)}</g>`;
}
function cerberusShadow(u) {
	const head = path("M-78 96Q-101 34-75-26L-90-101Q-53-92-23-59Q0-68 23-59Q53-92 90-101L75-26Q101 34 78 96L54 169H-54Z", "currentColor") + path("M-44-2Q-26-11-10-1L-14 7Q-31 10-44-2ZM44-2Q26-11 10-1L14 7Q31 10 44-2Z", "var(--hound-eyes, #dac5df)") + path("M-24 25Q0 9 24 25L30 58Q0 85-30 58Z", "var(--hound-eyes, #dac5df)", "opacity=\".38\"") + path("M-13 48Q0 40 13 48L0 61Z", "currentColor");
	const profile = path("M-64 155Q-85 60-60 10L-58-90L-16-58L20-91L27-34Q60-24 68 5L121 24Q132 31 124 45L94 65Q72 79 45 80L40 155Z", "currentColor") + path("M18-11Q34-16 45-6L32 1Q21 0 18-11Z", "var(--hound-eyes, #dac5df)");
	return `<defs><linearGradient id="${u}-hound-fade" gradientUnits="userSpaceOnUse" x1="0" y1="100" x2="0" y2="1050"><stop offset="0" stop-color="white"/><stop offset=".55" stop-color="white" stop-opacity=".8"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient><mask id="${u}-hound-mask" maskUnits="userSpaceOnUse" x="100" y="-35" width="1100" height="1210"><rect x="100" y="-35" width="1100" height="1210" fill="url(#${u}-hound-fade)"/></mask></defs><g data-cerberus-shadow mask="url(#${u}-hound-mask)" opacity=".3" style="color:var(--hound-shadow, #493251)"><g data-myth-motion="hound-shadow">${path("M227 382Q350 313 471 368Q650 219 826 369Q983 318 1089 387L1040 685Q1018 934 652 1050Q286 934 257 685Z", "currentColor")}${[
		[
			305,
			282,
			-12,
			1.12
		],
		[
			650,
			142,
			0,
			1.3
		],
		[
			1e3,
			282,
			12,
			1.12
		]
	].map(([x, y, r, scale], i) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${scale})"><g data-myth-motion="hound-head" data-index="${i}">${i === 1 ? head : `<g transform="scale(${i === 0 ? -1 : 1} 1)">${profile}</g>`}</g></g>`).join("")}</g></g>`;
}
function lyre(u) {
	return `${path("M-90-110Q-59-126-55-85L-46 51Q0 81 46 51L55-85Q59-126 90-110Q112-81 89-54L73 72Q0 124-73 72L-89-54Q-112-81-90-110Z", gold(u))}${line("M-69-69H69", "#f7dda0", 13)}${[
		-30,
		-15,
		0,
		15,
		30
	].map((x, i) => line(`M${x}-62V58`, "#fceac4", 3, `data-myth-motion="string" data-index="${i}"`)).join("")}${path("M-57 53Q0 80 57 53L52 77Q0 108-52 77Z", "#bd7b47")}${gem(0, 82, "#efce85", 10)}`;
}
function trident(u) {
	return `<rect x="-16" y="-218" width="32" height="439" rx="16" fill="${gold(u)}"/>${path("M-69-226L-92-168H-77V-110Q-77-60-7-54H7Q77-60 77-110V-168H92L69-226L47-168H61V-113Q59-83 7-80H-7Q-59-83-61-113V-168H-47Z", gold(u))}${path("M0-260L-26-200H26Z", gold(u))}${line("M-6-183V181", "#fff1c8", 6)}${gem(0, -68, "#4c9e97", 16)}`;
}
function thunderbolt(u) {
	return path("M12-197L-88 16H-20L-50 184L103-44H26L85-197Z", gold(u), "stroke=\"#aa7839\" stroke-width=\"5\" stroke-linejoin=\"round\"") + line("M27-174L-58-1H4L-17 110", "#fff3c9", 9) + `<g data-myth-motion="lightning-glint">${sparkle(62, -155, .65, "#fff9e6")}${sparkle(-34, 112, .38, "#fff9e6")}</g>`;
}
function bow(u) {
	return `${path("M-63-190C-15-178-31-91 9-31Q22 0 9 31C-31 91-15 178-63 190L-73 174C-40 160-51 83-15 25Q-5 0-15-25C-51-83-40-160-73-174Z", silver(u), "stroke=\"#6c8797\" stroke-width=\"5\" stroke-linejoin=\"round\"")}${line("M-62-168L28 0L-62 168", "#d2dbe0", 6, "data-bow-string")}<g data-bow-arrow>${line("M36 0H-156", "#d5b272", 10)}${path("M-185 0L-146-20L-154 0L-146 20Z", silver(u))}${path("M20 0L42-18L55-18L39 0L55 18H42Z", "#aec5c8")}</g><rect x="-14" y="-28" width="30" height="56" rx="9" fill="#58777c"/>${line("M-8-14H10M-8 0H10M-8 14H10", "#b4cfce", 4)}`;
}
function surface(f, u) {
	const sheen = `<rect width="1254" height="1254" fill="url(#${u}-sheen)"/>`;
	if (f.id === "medusa") return sheen + `<g transform="translate(620 893) rotate(-16.7)">${medusaScales()}</g>`;
	if (f.id === "horus") return sheen + Array.from({ length: 4 }, (_, i) => line(`M${340 + i * 125} 905q40 91 89-8`, gold(u), 8, "opacity=\".48\"")).join("");
	if (f.id === "poseidon") return sheen + [
		880,
		945,
		1010
	].map((y) => line(`M295 ${y}Q420 ${y - 60} 545 ${y}T805 ${y}T1065 ${y}`, "#e0f4dd", 9, "opacity=\".32\"")).join("");
	if (f.id === "artemis") return sheen + [
		[390, 905],
		[750, 987],
		[884, 865]
	].map(([x, y]) => sparkle(x, y, .65, "#dae9dc")).join("");
	return sheen;
}
var POWER_MS = 4600;
var clamp01 = (n) => Math.max(0, Math.min(1, n));
var smooth = (n) => {
	const x = clamp01(n);
	return x * x * (3 - 2 * x);
};
function powerStrength(ms) {
	if (ms === null || ms < 0 || ms >= 4600) return 0;
	const q = ms / POWER_MS;
	return smooth(q / .18) * (1 - smooth((q - .74) / .26));
}
var WARD_CENTER = {
	x: 634.5,
	y: 657.5
};
function makePower(svg, f, u, motion) {
	const layer = (key, art) => `<g data-power-part="${key}">${art}</g>`;
	const rings = (color) => [
		0,
		1,
		2
	].map((i) => `<ellipse cx="650" cy="700" rx="${340 + i * 70}" ry="${360 + i * 50}" fill="none" stroke="${color}" stroke-width="${10 - i * 2}" opacity="${.68 - i * .14}"/>`).join("");
	let back = "", front = "";
	if (f.id === "anubis") {
		svg.querySelector("defs").insertAdjacentHTML("beforeend", `<filter id="${u}-ward-glow" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="0" stdDeviation="14" flood-color="#ffe3a0" flood-opacity=".95"/></filter>`);
		back = layer("ward", `<ellipse cx="${WARD_CENTER.x}" cy="${WARD_CENTER.y}" rx="460" ry="465" fill="#d6ad54" fill-opacity=".1" stroke="#a8792e" stroke-width="25"/><ellipse cx="${WARD_CENTER.x}" cy="${WARD_CENTER.y}" rx="460" ry="465" fill="none" stroke="#ffe2a0" stroke-width="11"/><ellipse cx="${WARD_CENTER.x}" cy="${WARD_CENTER.y}" rx="418" ry="423" fill="none" stroke="#ce9d43" stroke-width="8"/>${Array.from({ length: 12 }, (_, i) => {
			const a = i * Math.PI / 6;
			return `<g transform="translate(${WARD_CENTER.x + 460 * Math.cos(a)} ${WARD_CENTER.y + 465 * Math.sin(a)}) rotate(${i * 30})">${gem(0, 0, "#ffe8ae", 27)}${gem(0, 0, "#b48636", 13)}</g>`;
		}).join("")}`);
		front = layer("ankh-light", [
			[190, 540],
			[1110, 545],
			[250, 870],
			[1040, 880]
		].map(([x, y]) => sparkle(x, y, 1.35, "#d4a13f")).join(""));
	}
	if (f.id === "horus") {
		back = [-1, 1].map((s) => layer(s < 0 ? "wing-l" : "wing-r", `<g transform="translate(650 700) scale(${s} 1)">${path("M0 80Q130-190 470-365Q432-198 345-143L440-219Q406-80 285-31L375-94Q302 70 115 133Z", "#d3a75d", "opacity=\".68\"")}${[
			0,
			1,
			2,
			3
		].map((i) => line(`M75 86Q${215 + i * 35} ${-30 - i * 55} ${340 + i * 28} ${-100 - i * 70}`, "#fff0b7", 6, "opacity=\".7\"")).join("")}</g>`)).join("");
		front = layer("feathers", [-1, 1].map((s) => [
			0,
			1,
			2
		].map((i) => `<g transform="translate(${650 + s * (360 + i * 45)} ${670 + i * 90}) rotate(${s * 35})">${path("M0-45Q37-9 0 46Q-27 2 0-45Z", gold(u))}</g>`).join("")).join(""));
	}
	if (f.id === "athena") {
		back = layer("shield", path("M650 215Q860 332 1030 333V660Q1015 925 650 1080Q285 925 270 660V333Q440 332 650 215Z", "#a5b888", "fill-opacity=\".12\" stroke=\"#a2b17a\" stroke-width=\"10\"") + line("M650 250Q840 360 995 362V657Q978 903 650 1042Q322 903 305 657V362Q460 360 650 250Z", "#d8dcae", 4));
		front = layer("olives", [-1, 1].map((s) => [
			0,
			1,
			2,
			3
		].map((i) => `<ellipse cx="${650 + s * (450 - i * 12)}" cy="${620 + i * 88}" rx="16" ry="38" fill="#a0b581" transform="rotate(${s * 30} ${650 + s * (450 - i * 12)} ${620 + i * 88})"/>`).join("")).join(""));
	}
	if (f.id === "poseidon") {
		back = layer("tide", path("M70 980Q230 740 453 890Q740 1055 1000 793Q1134 680 1188 834Q1204 916 1124 934Q1169 850 1096 845Q1000 855 911 976Q570 1215 70 1085Z", "#72bcb5", "fill-opacity=\".62\"") + line("M90 976Q260 798 455 914Q765 1093 1033 821Q1127 744 1168 828", "#d1f1e7", 13));
		front = layer("spray", [
			0,
			1,
			2,
			3,
			4,
			5
		].map((i) => `<circle cx="${230 + i * 155}" cy="${835 + i % 2 * 115}" r="${10 + i % 3 * 6}" fill="#c9f1e6"/>`).join(""));
	}
	if (f.id === "artemis") {
		back = layer("moon", `<g transform="translate(284 247)">${path("M36-107C-58-84-78 47 5 92C-131 72-141-91-34-125Q10-135 36-107Z", "#d4e4f1")}</g>`);
		front = layer("moon-trail", line("M273 790Q251 544 226 328", "#c5e7ef", 9, "stroke-dasharray=\"10 19\"") + [
			[226, 324],
			[246, 480],
			[261, 635]
		].map(([x, y]) => sparkle(x, y, .9, "#e4f5f8")).join(""));
	}
	if (f.id === "apollo") {
		back = layer("sun", `<circle cx="650" cy="525" r="340" fill="#efc678" fill-opacity=".12" stroke="#e1b360" stroke-width="8"/>${Array.from({ length: 12 }, (_, i) => `<g transform="translate(650 525) rotate(${i * 30})">${line("M0-364V-421", "#d4a04f", 11)}</g>`).join("")}`);
		front = layer("music", [
			[1070, 760],
			[1110, 610],
			[1050, 440],
			[960, 280]
		].map(([x, y], i) => `<g transform="translate(${x} ${y}) rotate(${-12 + i * 9})">${path("M0 5V-58L44-71V-9H33V-53L12-47V5Z", "#d5a24d")}<ellipse cx="0" cy="6" rx="17" ry="11" fill="#d5a24d"/><ellipse cx="33" cy="-7" rx="17" ry="11" fill="#d5a24d"/></g>`).join(""));
	}
	if (f.id === "zeus") {
		back = layer("cloud", path("M204 290Q180 226 249 213Q264 137 343 171Q385 117 442 173Q504 158 526 215Q588 218 574 280ZM735 225Q718 163 780 150Q797 91 861 122Q913 77 954 136Q1021 124 1038 180Q1106 183 1096 241Z", "#8298b1", "opacity=\".48\""));
		front = layer("lightning", line("M1020 257L1010 422L1120 399L1048 586L1148 554L1080 735", "#dfbd78", 24) + line("M1020 257L1010 422L1120 399L1048 586L1148 554L1080 735", "#fff1c5", 8) + line("M1080 422L1160 485L1131 545", "#e1bf7d", 9));
	}
	if (f.id === "medusa") {
		back = layer("gaze", rings("#91b188"));
		front = layer("stones", [-1, 1].map((s) => [
			0,
			1,
			2
		].map((i) => `<g transform="translate(${650 + s * (430 + i * 34)} ${780 + i * 95}) rotate(${s * (12 + i * 15)})">${path("M-24-28L15-38L36-5L20 26L-19 30L-36-1Z", "#94a08f", "stroke=\"#c5cdbb\" stroke-width=\"4\"")}</g>`).join("")).join(""));
	}
	if (f.id === "hades") {
		back = layer("gate", `<ellipse cx="650" cy="570" rx="470" ry="520" fill="#8f719f" fill-opacity=".08" stroke="#9e81ad" stroke-width="8"/>`);
		front = layer("embers", [
			0,
			1,
			2,
			3,
			4,
			5
		].map((i) => sparkle(220 + i * 170, 820 + i % 2 * 125, .55, "#ac8eba")).join(""));
	}
	const rear = group(back), fore = group(front);
	for (const node of [rear, fore]) {
		node.dataset.power = f.id;
		node.setAttribute("opacity", "0");
		node.setAttribute("pointer-events", "none");
	}
	motion.before(rear);
	svg.append(fore);
	const nodes = Object.fromEntries([...svg.querySelectorAll("[data-power-part]")].map((n) => [n.dataset.powerPart, n]));
	const set = (key, transform, opacity = 1) => {
		const n = nodes[key];
		if (n) {
			n.setAttribute("transform", transform);
			n.setAttribute("opacity", String(opacity));
		}
	};
	const bowFrame = svg.querySelector("[data-bow-frame]"), arrow = svg.querySelector("[data-bow-arrow]"), string = svg.querySelector("[data-bow-string]"), shadow = svg.querySelector("[data-cerberus-shadow]"), charm = svg.querySelector("[data-myth-motion=\"ankh\"]");
	return { render(ms) {
		const q = ms === null ? 0 : clamp01(ms / POWER_MS), e = powerStrength(ms);
		rear.setAttribute("opacity", String(e));
		fore.setAttribute("opacity", String(e));
		if (f.id === "anubis") rear.setAttribute("transform", motion.getAttribute("transform") || "");
		const reveal = smooth((q - .08) / .35);
		set("ward", `translate(${WARD_CENTER.x} ${WARD_CENTER.y}) scale(${.48 + reveal * .56}) rotate(${reveal * 12}) translate(${-WARD_CENTER.x} ${-WARD_CENTER.y})`, smooth((q - .06) / .15));
		set("ankh-light", `translate(0 ${-q * 95})`, .85);
		if (charm) if (e > 0) charm.setAttribute("filter", `url(#${u}-ward-glow)`);
		else charm.removeAttribute("filter");
		set("wing-l", `rotate(${-e * 8} 650 700)`);
		set("wing-r", `rotate(${e * 8} 650 700)`);
		set("feathers", `translate(0 ${q * 160 - 60})`, .7);
		set("shield", `translate(650 650) scale(${.92 + e * .08}) translate(-650 -650)`);
		set("olives", `translate(0 ${-q * 90})`, .85);
		set("tide", `translate(${(1 - e) * -220} ${55 * (1 - e)})`);
		set("spray", `translate(0 ${-Math.sin(q * Math.PI) * 180})`, .75);
		set("moon", `translate(0 ${-e * 28})`);
		set("moon-trail", "translate(0 0)", smooth((q - .34) / .12) * (1 - smooth((q - .72) / .18)));
		set("sun", `rotate(${q * 25} 650 525)`);
		set("music", `translate(0 ${-q * 100})`, .85);
		set("cloud", `translate(${e * 14} ${-e * 15})`);
		set("lightning", "translate(0 0)", smooth((q - .28) / .1) * (1 - smooth((q - .61) / .19)));
		set("gaze", `translate(650 700) scale(${.8 + q * .3}) translate(-650 -700)`);
		set("stones", `translate(0 ${-Math.sin(q * Math.PI) * 150})`);
		set("gate", `translate(650 570) scale(${.95 + e * .05}) translate(-650 -570)`);
		set("embers", `translate(0 ${-q * 190})`, .8);
		if (shadow) shadow.setAttribute("opacity", String(.3 + e * .23));
		if (bowFrame) bowFrame.setAttribute("transform", `translate(276 827) rotate(${22 + e * 63}) scale(1.08)`);
		if (arrow && string) {
			const draw = smooth(q / .32), shot = smooth((q - .36) / .28), reset = smooth((q - .8) / .2);
			const pull = ms === null ? 0 : draw * (1 - shot) * 46;
			string.setAttribute("d", `M-62-168L${28 + pull} 0L-62 168`);
			arrow.setAttribute("transform", `translate(${ms === null ? 0 : pull - shot * (1 - reset) * 620} 0)`);
			arrow.setAttribute("opacity", String(ms === null ? 1 : shot < .8 ? 1 : reset));
		}
	} };
}
function makeMyth(host, f, u, label = f.name, { tintedEyes = true } = {}) {
	const rig = createRig(host, _mythic_body_default, u, label);
	const svg = host.querySelector("svg");
	svg.setAttribute("viewBox", "100 -35 1100 1210");
	svg.dataset.myth = f.id;
	svg.querySelector("defs").insertAdjacentHTML("beforeend", defs(u));
	applyClassicCoat(svg, u, [f.colors[0], f.colors[2]], surface(f, u));
	if (tintedEyes) {
		svg.querySelector("defs").insertAdjacentHTML("beforeend", eyeTint(u, EYE_COLORS[f.id]));
		for (const side of ["left", "right"]) {
			svg.querySelector(`[data-part="${side}-eye"] use`).setAttribute("filter", `url(#${u}-eye-tint)`);
			svg.querySelector(`[data-part="${side}-lid"]`).setAttribute("stroke", EYE_COLORS[f.id]);
		}
	}
	const gradient = svg.querySelector(`[id="${u}-coat-gradient"]`);
	gradient.setAttribute("gradientUnits", "userSpaceOnUse");
	for (const [key, value] of Object.entries({
		x1: 450,
		y1: 220,
		x2: 700,
		y2: 1090
	})) gradient.setAttribute(key, String(value));
	gradient.innerHTML = f.colors.map((c, i) => `<stop offset="${i / 2}" stop-color="${c}"/>`).join("");
	const motion = svg.querySelector("[data-part=\"motion\"]");
	const fitted = measuredHead(f.id, u);
	if (fitted.back) motion.prepend(group(fitted.back));
	const head = group(fitted.front);
	head.dataset.mythHead = "";
	motion.append(head);
	const attachments = [];
	const attach = (part, markup, grip) => {
		const node = group(""), prop = group(markup);
		node.append(prop);
		node.dataset.heldBy = part;
		if (grip) {
			const [x, y, rx, ry] = grip, id = `${u}-${part}-grip`;
			svg.querySelector("defs").insertAdjacentHTML("beforeend", `<clipPath id="${id}"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/></clipPath>`);
			node.append(group(`<use href="#${u}-art" clip-path="url(#${id})"/>`));
		}
		motion.append(node);
		attachments.push({
			node,
			prop,
			part,
			pivot: grip?.slice(0, 2) || [278, 835],
			flipper: motion.querySelector(`[data-part="${part}"]`)
		});
	};
	let ornament = null, effects = null;
	if (f.id === "anubis" || f.id === "horus") motion.append(group(collar(u, f.id === "anubis" ? "#315f83" : "#34669b")));
	if (f.id === "anubis") {
		const chin = fit.collar.find(([x]) => x === 0)[1];
		ornament = group(frame(at([7.2, chin + 63 + 68], `<g data-myth-motion="ankh">${ankh(u)}</g>`, "scale(.6)")));
		motion.append(ornament);
	}
	if (f.id === "horus") {
		motion.append(group(`${path("M318 619Q310 682 360 718L378 699Q337 674 339 643Z", gold(u))}${path("M906 501Q943 538 933 587L914 599Q919 552 895 536Z", gold(u))}`));
		for (const [part, s] of [["left-flipper", -1], ["right-flipper", 1]]) {
			const feather = group(`<g transform="translate(${s < 0 ? 274 : 1e3} ${s < 0 ? 808 : 786}) rotate(${s * 25}) scale(.64)">${[
				-1,
				0,
				1
			].map((n) => path(`M${n * 40 - 13} 0Q${n * 40 - 37} 82 ${n * 40} ${142 - Math.abs(n) * 18}Q${n * 40 + 29} 72 ${n * 40 + 13} 0Z`, gold(u))).join("")}${line("M-39 15L-34 87M1 12V111M40 10L35 85", "#846a3e", 3)}</g>`);
			motion.querySelector(`[data-part="${part}"]`).append(feather);
		}
	}
	if (f.id === "athena" || f.id === "artemis" || f.id === "hades") {
		const c = f.id === "hades" ? "#49384e" : f.id === "athena" ? "#637a58" : "#3e675d";
		motion.prepend(group(`${path("M351 714Q307 864 355 1001Q617 1176 940 885L898 665Q646 959 351 714Z", c)}${line("M378 832Q472 1025 604 1038M870 807Q828 932 740 984", f.id === "hades" ? "#917890" : f.id === "athena" ? "#aeb58a" : "#8caaa0", 8, "opacity=\".5\"")}`));
		motion.append(group(`${path("M352 741Q452 801 560 801L398 953Q343 866 352 741Z", c)}${gem(387, 798, f.id === "hades" ? "#b3829b" : f.id === "athena" ? "#dcc18a" : "#cfdee1", 23)}`));
	}
	if (f.id === "athena") attach("left-flipper", `<g transform="translate(278 779) scale(.86)"><g data-myth-motion="owl">${owl(u)}</g></g>`);
	if (f.id === "hades") motion.before(group(cerberusShadow(u)));
	if (f.id === "hermes") {
		motion.append(group(`${line("M405 775Q638 854 854 898", "#8f5b3c", 31)}${line("M405 775Q638 854 854 898", "#e9bc80", 6)}<g transform="translate(799 954) rotate(-12)">${path("M-72-53Q0-80 75-53L72 46Q0 74-72 46Z", "#a86d44")}${path("M-72-53Q0-80 75-53L73-9Q0 23-72-9Z", "#d5a471")}${line("M-61 32Q0 52 61 32", "#eac08c", 4)}${path("M-15-22H16V7H-15Z", gold(u))}</g>`));
		motion.append(group(`<g transform="translate(431 1073) rotate(-7)">${path("M-45-12Q0-46 45-12L50 17Q0 40-52 17Z", "#a86d44")}${line("M-26-15L-4 13L22-20", gold(u), 10)}<g transform="translate(-40 1) rotate(-35) scale(.38)"><g data-myth-motion="sandal">${wing(u)}</g></g></g><g transform="translate(738 1058) rotate(-15)">${path("M-45-12Q0-46 45-12L50 17Q0 40-52 17Z", "#a86d44")}${line("M-26-15L-4 13L22-20", gold(u), 10)}<g transform="translate(40 1) scale(-.38 .38) rotate(-35)"><g data-myth-motion="sandal">${wing(u)}</g></g></g>`));
	}
	if (f.id === "poseidon") {
		attach("right-flipper", `<g transform="translate(1032 828) rotate(6) scale(.86)">${trident(u)}</g>`, [
			1031,
			828,
			28,
			17
		]);
		effects = group([
			0,
			1,
			2
		].map((i) => `<g data-myth-motion="bubble" data-index="${i}"><circle r="${13 + i * 7}" fill="#a0e0d7" fill-opacity=".2" stroke="#b5e9df" stroke-width="4"/>${line(`M${-5 - i * 2} ${-7 - i * 3}q5-6 11-5`, "#ffffff", 3)}</g>`).join(""));
		svg.append(effects);
	}
	if (f.id === "artemis") {
		attach("left-flipper", `<g data-bow-frame transform="translate(276 827) rotate(22) scale(1.08)">${bow(u)}</g>`, [
			276,
			827,
			19,
			18
		]);
		effects = group(`${line("M886 183L974 138L1035 240L1102 207", "#99b3c6", 3)}${[
			[886, 183],
			[974, 138],
			[1035, 240],
			[1102, 207]
		].map(([x, y], i) => `<g data-myth-motion="star" data-index="${i}">${sparkle(x, y, .55 + i * .07, "#c4d9e9")}</g>`).join("")}`);
		svg.prepend(effects);
	}
	if (f.id === "apollo") {
		attach("right-flipper", `<g transform="translate(1064 842) rotate(-8) scale(.86)">${lyre(u)}</g>`, [
			1008,
			853,
			26,
			18
		]);
		effects = group(`<g data-myth-motion="sunlight">${sparkle(1060, 394, .9, "#e9ba63")}${sparkle(278, 321, .6, "#e9ba63")}${sparkle(1001, 260, .45, "#e9ba63")}</g>`);
		svg.append(effects);
	}
	if (f.id === "zeus") {
		motion.append(group(`<g mask="url(#${u}-coat-silhouette)">${path("M329 750Q408 786 459 799Q524 936 849 1010L803 1082Q497 1018 329 750Z", silver(u))}${line("M380 798Q507 983 814 1050", "#b4c5d8", 7, "opacity=\".6\"")}</g>${gem(407, 817, "#c29b56", 28)}${gem(407, 817, "#7596ba", 16)}`));
		attach("right-flipper", `<g transform="translate(1034 825) rotate(9) scale(.92)">${thunderbolt(u)}</g>`, [
			1031,
			828,
			28,
			17
		]);
	}
	const power = makePower(svg, f, u, motion);
	const parts = [...svg.querySelectorAll("[data-myth-motion]")];
	return { render(pose = neutralPose(), time = 0, active = false, powerMs = null) {
		const p = { ...pose };
		const breath = Math.sin(time / 1100), flap = Math.sin(time / 340);
		if (active && f.id === "horus" && pose.happy === 0) {
			const stretch = Math.pow(Math.max(0, Math.sin(time / 1700)), 4);
			p.left += stretch * 18;
			p.right -= stretch * 18;
		}
		if (active && f.id === "hermes" && pose.happy === 0) {
			p.rotate += Math.sin(time / 420) * 1.3;
			p.y -= Math.max(0, Math.sin(time / 420)) * 6;
		}
		const strength = powerStrength(powerMs);
		if (strength) if (f.id === "anubis") {
			p.left += 16 * strength;
			p.right -= 16 * strength;
			p.y -= 18 * strength;
		} else if (f.id === "horus") {
			p.left += 28 * strength;
			p.right -= 28 * strength;
			p.y -= 32 * strength;
		} else if (f.id === "poseidon" || f.id === "zeus") {
			p.right -= 23 * strength;
			p.y -= 7 * strength;
		} else if (f.id === "artemis") {
			p.left += 12 * strength;
			p.rotate -= 3 * strength;
		} else if (f.id === "apollo") {
			p.right -= 12 * strength;
			p.left += 8 * strength;
		} else if (f.id === "hades") p.y -= 12 * strength;
		else {
			p.left += 7 * strength;
			p.right -= 7 * strength;
		}
		rig.render(p);
		for (const { node, prop, part, pivot, flipper } of attachments) {
			node.setAttribute("transform", flipper.getAttribute("transform"));
			const armAngle = part === "left-flipper" ? p.left : p.right;
			prop.setAttribute("transform", `rotate(${-armAngle * .9} ${pivot[0]} ${pivot[1]})`);
		}
		for (const node of parts) {
			const kind = node.dataset.mythMotion, index = Number(node.dataset.index || 0);
			if (kind === "ankh") node.setAttribute("transform", `rotate(${active ? breath * 5 : 0} -12 -100)`);
			if (kind === "wing-left" || kind === "wing-right" || kind === "sandal") node.setAttribute("transform", `rotate(${active ? flap * 8 : 0})`);
			if (kind === "owl") node.setAttribute("transform", `rotate(${active ? breath * 3 : 0} 0 65)`);
			if (kind === "owl-eye") node.setAttribute("opacity", active && time % 5700 > 5300 && time % 5700 < 5450 ? ".15" : "1");
			if (kind === "bubble") {
				const phase = (time / 4400 + index * .28) % 1;
				node.setAttribute("transform", `translate(${1060 + 22 * Math.sin(phase * 5 + index)} ${720 - 420 * phase})`);
				node.setAttribute("opacity", active ? String(Math.sin(phase * Math.PI) * .85) : String(.4 + index * .15));
			}
			if (kind === "star" || kind === "sunlight") node.setAttribute("opacity", active ? String(.48 + .5 * (.5 + .5 * Math.sin(time / 650 + index))) : ".8");
			if (kind === "string") node.setAttribute("opacity", active ? String(.48 + .52 * (.5 + .5 * Math.sin(time / 260 + index * .9))) : "1");
			if (kind === "snake") node.setAttribute("transform", `rotate(${active ? Math.sin(time / 1050 + index * 1.4) * (2.5 + strength * 4.5) : 0} 0 -12)`);
			if (kind === "hound-head") node.setAttribute("transform", `rotate(${active ? Math.sin(time / 1900 + index * 1.8) * 2 : 0} 0 145)`);
			if (kind === "hound-shadow") node.setAttribute("transform", `translate(0 ${active ? Math.sin(time / 2400) * 6 : 0}) translate(650 570) scale(${1 + strength * .045}) translate(-650 -570)`);
			if (kind === "lightning-glint") {
				const phase = time % 5600 / 5600;
				const glow = phase < .2 ? Math.sin(phase / .2 * Math.PI) ** 2 : 0;
				node.setAttribute("opacity", active ? String(.12 + .88 * glow) : ".45");
			}
		}
		power.render(powerMs);
	} };
}
function mythIcon(f, u, label = f.name, { tintedEyes = true } = {}) {
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="${label}"><defs>${defs(u)}
  <image id="${u}-source" href="${_mythic_icon_default}" width="256" height="256"/>
  ${tintedEyes ? `${eyeTint(u, EYE_COLORS[f.id])}<clipPath id="${u}-eye-windows"><ellipse cx="68" cy="121" rx="30" ry="35"/><ellipse cx="188" cy="121" rx="30" ry="35"/></clipPath>` : ""}
  <filter id="${u}-select" color-interpolation-filters="sRGB"><feColorMatrix values="-1 0 0 0 1 -1 0 0 0 1 -1 0 0 0 1 0 0 0 1 0"/></filter>
  <mask id="${u}-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="256" height="256" style="mask-type:luminance"><use href="#${u}-source" filter="url(#${u}-select)"/><ellipse cx="68" cy="121" rx="35" ry="39" fill="black"/><ellipse cx="188" cy="121" rx="35" ry="39" fill="black"/><path d="M91 146Q128 116 166 146L165 165Q126 197 94 164Z" fill="black"/></mask>
  <linearGradient id="${u}-coat" x2=".15" y2="1">${f.colors.map((c, i) => `<stop offset="${i / 2}" stop-color="${c}"/>`).join("")}</linearGradient></defs>
  <use href="#${u}-source"/><rect width="256" height="256" fill="url(#${u}-coat)" mask="url(#${u}-mask)"/>
  <rect width="256" height="256" fill="url(#${u}-sheen)" mask="url(#${u}-mask)"/>
  ${tintedEyes ? `<use href="#${u}-source" clip-path="url(#${u}-eye-windows)" filter="url(#${u}-eye-tint)"/>` : ""}
  ${f.id === "hades" ? `<g mask="url(#${u}-mask)"><g transform="scale(.204)" style="--hound-shadow:#bba1cb;--hound-eyes:#eadff0">${cerberusShadow(u)}</g></g>` : ""}
  ${f.id === "medusa" ? medusaIconCrown(u) : `<g transform="translate(128 54) scale(.405 .25)">${headpiece(f.id, u)}</g>`}
  ${iconDetails(f, u)}</svg>`;
}
function iconDetails(f, u) {
	if (f.id === "hades") return "";
	if (f.id === "medusa") return `<g transform="translate(128 217)">${medusaScales(.3)}</g>`;
	if (f.id === "zeus") return `${path("M25 188Q55 198 68 202Q105 232 181 241L166 256Q68 242 25 188Z", silver(u))}${gem(52, 208, "#c29b56", 9)}<g transform="translate(216 214) rotate(9) scale(.18)">${thunderbolt(u)}</g>`;
	if (f.id === "anubis" || f.id === "horus") return `${path("M26 187Q128 231 230 187L232 208Q128 253 24 208Z", gold(u))}${path("M30 199Q128 240 226 199L226 207Q128 248 30 207Z", f.id === "horus" ? "#396dab" : "#315f83")}${f.id === "anubis" ? `<g transform="translate(128 233) scale(.15)">${ankh(u)}</g>` : `${path("M17 129L21 163L35 175L38 165L27 152Z", gold(u))}${path("M239 129L235 163L221 175L218 165L229 152Z", gold(u))}`}`;
	if (f.id === "athena") return `<g transform="translate(48 228) scale(.25)">${owl(u)}</g>${line("M164 234Q199 230 221 211", gold(u), 3)}${[
		0,
		1,
		2
	].map((i) => `<ellipse cx="${183 + i * 13}" cy="${228 - i * 8}" rx="4" ry="9" fill="${gold(u)}" transform="rotate(35 ${183 + i * 13} ${228 - i * 8})"/>`).join("")}`;
	if (f.id === "hermes") return `${line("M28 201L221 245", "#e4b481", 8)}<g transform="translate(194 226) rotate(-9)">${path("M-24-19Q0-27 25-19V20Q0 28-24 20Z", "#a36a42")}${path("M-24-19Q0-27 25-19V-3Q0 12-24-3Z", "#e0b07c")}${path("M-5-7H6V3H-5Z", gold(u))}</g>`;
	if (f.id === "poseidon") return `<g transform="translate(222 193) scale(.15)">${trident(u)}</g>${line("M27 227Q57 207 87 227T147 227", "#c5ebd9", 4)}<circle cx="25" cy="58" r="6" fill="none" stroke="#c8eee2" stroke-width="2"/>`;
	if (f.id === "artemis") return `<g transform="translate(215 215) rotate(15) scale(.17)">${bow(u)}</g>${sparkle(36, 216, .5, "#deebeb")}${sparkle(60, 237, .25, "#deebeb")}`;
	return `<g transform="translate(205 219) scale(.25)">${lyre(u)}</g>${sparkle(35, 219, .5, "#ffeac0")}`;
}
//#endregion
export { POWER_MS, idleAt, makeMyth, mythIcon, neutralPose, sceneArt };
