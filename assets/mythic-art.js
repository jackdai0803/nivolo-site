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
			nodes.SparkleBurst.setAttribute("transform", nodes.motion.getAttribute("transform"));
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
 <!-- Clean only the outer alpha fringe; colour, face and accessories stay sharp. -->
 <filter id="${uid}-coat-edge" x="-2%" y="-2%" width="104%" height="104%"><feMorphology in="SourceAlpha" operator="erode" radius="2"/><feGaussianBlur stdDeviation=".65"/></filter>
 <mask id="${uid}-coat-silhouette" maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254" style="mask-type:alpha"><use href="#${uid}-classic-source" filter="url(#${uid}-coat-edge)"/></mask>
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
//#region src/myths/assets/classic-face-rest.png
var classic_face_rest_default = "data:image/png;base64,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";
//#endregion
//#region src/myths/assets/classic-left-eye.png
var classic_left_eye_default = "data:image/png;base64,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AQxgAAMYwAAGMIABoQAAAhIBBjCAAQxgAAMYwAAGMIABDGBAWAEAAhIBBjCAAQxgAAMYwAAGMIABDGBA2AIAAhIBBjCAAQxgAAMYwAAGMIABDAhtwBkAICARYAADGMAABjCAAQxgAAMYwICkoA2sXwBBG2AAAxjAAAYwgAEMYAADGMAABoQCAAhIBBjAAAYwgAEMYAADGMAABjCAAWEFAAhIBBjAAAYwgAEMYAADGMAABjCAAWELAAhIBBjAAAYwgAEMYAADGMAABjAgtAFnAICARIABDGAAAxjAAAYwgAEMYAADkoI2sH4BBG2AAQxgAAMYwAAGMIABDGAAAxgQCgAgIBFgAAMYwAAGMIABDGAAAxjAAAaEFQAgIBFgAAMYwAAGMIABDGAAAxjAAAaELQAgIBFgAAMYwAAGMIABDGAAAxjAgNAGnAEAAhIBBjCAAQxgAAMYwAAGMIABDEgK2sD6BRC0AQYwgAEMYAADGMAABjCAAQxgQCgAgIBEgAEMYAADGMAABjCAAQxgAAMYEFYAgIBEgAEMYAADGMAABjCAAQxgAAMYELYAgIBEgAEMYAADGMAABjCAAQxgAAMY4AwAEJAIMIABDGAAAxjAAAYwgAEMYECloQ2sXwBBG2AAAxjAAAYwgAEMYAADGMAABoQCAAhIBBjAAAYwgAEMYAADGMAABjCAAWEFAAhIBBjAAAYwgAEMYAADGMAABjCAAWELAAhIBBjAAAYwgAEMYAADGMAABjAgtAFnAICARIABDGAAAxjAAAYwgAEMYAADkoI2sH4BBG2AAQxgAAMYwAAGMIABDGAAAxgQCgAgIBFgAAMYwAAGMIABDGAAAxjAAAaEFQAgIBFgAAMYwAAGMIABDGAAAxjAAAaELQAgIBFgAAMYwAAGMIABDGAAAxjAgNAGnAEAAhIBBjCAAQxgAAMYwAAGMIABDEgK2sD6BRC0AQYwgAEMYAADGMAABjCAAQxgQCgAgIBEgAEMYAADGMAABjCAAQxgAAMYEFYAgIBEgAEMYAADGMAABjCAAQxgAAMYELYAgIBEgAEMYAADGMAABjCAAQxgAANCG3AGAAhIBBjAAAYwgAEMYAADGMAABjCQBgPWL4CgDTCAAQxgAAMYwAAGMIABDGAAA0IBAAQkAgxgAAMYwAAGMIABDGAAAxjAgLACAAQkAgxgAAMYwAAGMIABDGAAAxjAgLAFAAQkAgxgAAMYwAAGMIABDGAAAxgQ2oAzAEBAIsAABjCAAQxgAAMYwAAGMIABSUEbWL8AgjbAAAYwgAEMYAADGMAABjCAAQwIBQAQkAgwgAEMYAADGMAABjCAAQxgAAPCCgAQkAgwgAEMYAADGMAABjCAAQxgAAPCFgAQkAgwgAEMYAADGMAABjCAAQxgQGgDzgAAAYkAAxjAAAYwgAEMYAADGMAABiQFbWD9AgjaAAMYwAAGMIABDGAAAxjAAAYwIBQAQEAiwAAGMIABDGAAAxjAAAYwgAEMCCsAQEAiwAAGMIABDGAAAxjAAAYwgAEMCFsAQEAiwAAGMIABDGAAAxjAAAYwgAGhDTgDAAQkAgxgAAMYwAAGMIABDGAAAxiQFLSB9QsgaAMMYAADGMAABjCAAQxgAAMYwIBQAAABiQADGMAABjCAAQxgAAMYwAAGMCCsAAABiQADGMAABjCAAQxgAAMYwAAGMCBsAQABiQADGMAABjCAAQxgAAMYwAAGhDbgDAAQkAgwgAEMYAADGMAABjCAAQxgQFLQBtYvgKANMIABDGAAAxjAAAYwgAEMYAADQgEABCQCDGAAAxjAAAYwgAEMYAADGMCAsAIABCQCDGAAAxjAAAYwgAEMYAADGMCAsAUABCQCDGAAAxjAAAYwgAEMYAADGMAAZwCAgESAAQxgAAMYwAAGMIABDGAAAyoNbWD9AgjaAAMYwAAGMIABDGAAAxjAAAYwIBQAQEAiwAAGMIABDGAAAxjAAAYwgAEMCCsAQEAiwAAGMIABDGAAAxjAAAYwgAEMCFsAQEAiwAAGMIABDGAAAxjAAAYwgAGhDTgDAAQkAgxgAAMYwAAGMIABDGAAAxiQFLSB9QsgaAMMYAADGMAABjCAAQxgAAMYwIBQAAABiQADGMAABjCAAQxgAAMYwAAGMCCsAAABiQADGMAABjCAAQxgAAMYwAAGMCBsAQABiQADGMAABjCAAQxgAAMYwAAGhDbgDAAQkAgwgAEMYAADGMAABjCAAQxgQFLQBtYvgKANMIABDGAAAxjAAAYwgAEMYAADQgEABCQCDGAAAxjAAAYwgAEMYAADGMCAsAIABCQCDGAAAxjAAAYwgAEMYAADGMCAsAUABCQCDGAAAxjAAAYwgAEMYAADGBDagDMAQEAiwAAGMIABDGAAAxjAAAYwgIE0GLB+AQRtgAEMYAADGMAABjCAAQxgAAMYEAoAICARYAADGMAABjCAAQxgAAMYwAAGhBUAICARYAADGMAABjCAAQxgAAMYwAAGhC0AICARYAADGMAABjCAAQxgAAMYwIDQBpwBAAISAQYwgAEMYAADGMAABjCAAQxICtrA+gUQtAEGMIABDGAAAxjAAAYwgAEMYEAoAICARIABDGAAAxjAAAYwgAEMYAADGBBWAICARIABDGAAAxjAAAYwgAEMYAADGBC2AICARIABDGAAAxjAAAYwgAEMYAADQhtwBgAISAQYwAAGMIABDGAAAxjAAAYwICloA+sXQNAGGMAABjCAAQxgAAMYwAAGMIABoQAAAhIBBjCAAQxgAAMYwAAGMIABDGBAWAEAAhIBBjCAAQxgAAMYwAAGMIABDGBA2AIAAhIBBjCAAQxgAAMYwAAGMIABDAhtwBkAICARYAADGMAABjCAAQxgAAMYwICkoA2sXwBBG2AAAxjAAAYwgAEMYAADGMAABoQCAAhIBBjAAAYwgAEMYAADGMAABjCAAWEFAAhIBBjAAAYwgAEMYAADGMAABjCAAWELAAhIBBjAAAYwgAEMYAADGMAABjAgtAFnAICARIABDGAAAxjAAAYwgAEMYAADkoI2sH4BBG2AAQxgAAMYwAAGMIABDGAAAxgQCgAgIBFgAAMYwAAGMIABDGAAAxjAAAaEFQAgIBFgAAMYwAAGMIABDGAAAxjAAAaELQAgIBFgAAMYwAAGMIABDGAAAxjAAAY4AwAEJAIMYAADGMAABjCAAQxgAAMYUGloA+sXQNAGGMAABjCAAQxgAAMYwAAGMIABoQAAAhIBBjCAAQxgAAMYwAAGMIABDGBAWAEAAhIBBjCAAQxgAAMYwAAGMIABDGBA2AIAAhIBBjCAAQxgAAMYwAAGMIABDAhtwBkAICARYAADGMAABjCAAQxgAAMYwICkoA2sXwBBG2AAAxjAAAYwgAEMYAADGMAABoQCAAhIBBjAAAYwgAEMYAADGMAABjCAAWEFAAhIBBjAAAYwgAEMYAADGMAABjCAAWELAAhIBBjAAAYwgAEMYAADGMAABjAgtAFnAICARIABDGAAAxjAAAYwgAEMYAADkoI2sH4BBG2AAQxgAAMYwAAGMIABDGAAAxgQCgAgIBFgAAMYwAAGMIABDGAAAxjAAAaE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GD4BQwYMMMAAAwwwwAADDDDAAAMMZAMAAkXAAAMMMMAAAwwwwAADDDDAQE4AQKAIGGCAAQYYYIABBhhggAEGGMgVAAgUAQMMMMAAAwwwwAADDDDAQDLwBgAEioABBhhggAEGGGCAAQYYYKAJMhg+AUMGDDDAAAMMMMAAAwwwwAADDGQDAAJFwAADDDDAAAMMMMAAAwwwwEBOAECgCBhggAEGGGCAAQYYYIABBhjIFQAIFAEDDDDAAAMMMMAAAwwwwEAy8AYABIqAAQYYYIABBhhggAEGGGCgCTIYPgFDBgwwwAADDDDAAAMMMMAAAwxkAwACRcAAAwwwwAADDDDAAAMMMMBATgBAoAgYYIABBhhggAEGGGCAAQYYyBUACBQBAwwwwAADDDDAAAMMMMBAMvAGAASKgAEGGGCAAQYYYIABBhhgoAkyGD4BQwYMMMAAAwwwwAADDDDAAAMMZAMAAkXAAAMMMMAAAwwwwAADDDDAQE4AQKAIGGCAAQYYYIABBhhggAEGGMgVAAgUAQMMMMAAAwwwwAADDDDAQDLwBgAEioABBhhggAEGGGCAAQYYYKAJMhg+AUMGDDDAAAMMMMAAAwwwwAADDGQDAAJFwAADDDDAAAMMMMAAAwwwwEBOAECgCBhggAEGGGCAAQYYYIABBhjIFQAIFAEDDDDAAAMMMMAAAwwwwEAy8AYABIqAAQYYYIABBhhggAEGGGCgCTIYPgFDBgwwwAADDDDAAAMMMMAAAwxkAwACRcAAAwwwwAADDDDAAAMMMMBATgBAoAgYYIABBhhggAEGGGCAAQYYyBUACBQBAwwwwAADDDDAAAMMMMBAMvAGAASKgAEGGGCAAQYYYIABBhhgoAkyGD4BQwYMMMAAAwwwwAADDDDAAAMMZAMAAkXAAAMMMMAAAwwwwAADDDDAQE4AQKAIGGCAAQYYYIABBhhggAEGGMgVAAgUAQMMMMAAAwwwwAADDDDAQDLwBgAEioABBhhggAEGGGCAAQYYYKAJMhg+AUMGDDDAAAMMMMAAAwwwwAADDGQDAAJFwAADDDDAAAMMMMAAAwwwwEBOAECgCBhggAEGGGCAAQYYYIABBhjIFQAIFAEDDDDAAAMMMMAAAwwwwEAy8AYABIqAAQYYYIABBhhggAEGGGCgCTIYPgFDBgwwwAADDDDAAAMMMMAAAwxkAwACRcAAAwwwwAADDDDAAAMMMMBATgBAoAgYYIABBhhggAEGGGCAAQYYyBUACBQBAwwwwAADDDDAAAMMMMBAMvAGAASKgAEGGGCAAQYYYIABBhhgoAkyGD4BQwYMMMAAAwwwwAADDDDAAAMMZAMAAkXAAAMMMMAAAwwwwAADDDDAQE4AQKAIGGCAAQYYYIABBhhggAEGGMgVAAgUAQMMMMAAAwwwwAADDDDAQDLwBgAEioABBhhggAEGGGCAAQYYYKAJMhg+AUMGDDDAAAMMMMAAAwwwwAADDGQDAAJFwAADDDDAAAMMMMAAAwwwwEBOAECgCBhggAEGGGCAAQYYYIABBhjIFQAIFAEDDDDAAAMMMMAAAwwwwEAy8AYABIqAAQYYYIABBhhggAEGGGCgCTIYPgFDBgwwwAADDDDAAAMMMMAAAwxkAwACRcAAAwwwwAADDDDAAAMMMMBATgBAoAgYYIABBhhggAEGGGCAAQYYyBUACBQBAwwwwAADDDDAAAMMMMBAMvAGAASKgAEGGGCAAQYYYIABBhhgoAkyGD4BQwYMMMAAAwwwwAADDDDAAAMMZAMAAkXAAAMMMMAAAwwwwAADDDDAQE4AQKAIGGCAAQYYYIABBhhggAEGGMgVAAgUAQMMMMAAAwwwwAADDDDAQDLwBgAEioABBhhggAEGGGCAAQYYYKAJMhg+AUMGDDDAAAMMMMAAAwwwwAADDGQDAAJFwAADDDDAAAMMMMAAAwwwwEBOAECgCBhggAEGGGCAAQYYYIABBhjIFQAIFAEDDDDAAAMMMMAAAwwwwEAy8AYABIqAAQYYYIABBhhggAEGGGCgCTIYPgFDBgwwwAADDDDAAAMMMMAAAwxkAwACRcAAAwwwwAADDDDAAAMMMMBATgBAoAgYYIABBhhggAEGGGCAAQYYyBUACBQBAwwwwAADDDDAAAMMMMBAMvAGAASKgAEGGGCAAQYYYIABBhhgoAkyGD4BQwYMMMAAAwwwwAADDDDAAAMMZAMAAkXAAAMMMMAAAwwwwAADDDDAQE4AQKAIGGCAAQYYYIABBhhggAEGGMgVAAgUAQMMMMAAAwwwwAADDDDAQDLwBgAEioABBhhggAEGGGCAAQYYYKAJMhg+AUMGDDDAAAMMMMAAAwwwwAADDGQDAAJFwAADDDDAAAMMMMAAAwwwwEBOAECgCBhggAEGGGCAAQYYYIABBhjIFQAIFAEDDDDAAAMMMMAAAwwwwEAy8AYABIqAAQYYYIABBhhggAEGGGCgCTIYPgFDBgwwwAADDDDAAAMMMMAAAwxkAwACRcAAAwwwwAADDDDAAAMMMMBATgBAoAgYYIABBhhggAEGGGCAAQYYyBUACBQBAwwwwAADDDDAAAMMMMBAMvAGAASKgAEGGGCAAQYYYIABBhhgoAkyGD4BQwYMMMAAAwwwwAADDDDAAAMMZAMAAkXAAAMMMMAAAwwwwAADDDDAQE4AQKAIGGCAAQYYYIABBhhggAEGGMgVAAgUAQMMMMAAAwwwwAADDDDAQDLwBgAEioABBhhggAEGGGCAAQYYYKAJMhg+AUMGDDDAAAMMMMAAAwwwwAADDGQDAAJFwAADDDDAAAMMMMAAAwwwwEBOAECgCBhggAEGGGCAAQYYYIABBhjIFQAIFAEDDDDAAAMMMMAAAwwwwEAy8AYABIqAAQYYYIABBhhggAEGGGCgCTIYPgFDBgwwwAADDDDAAAMMMMAAAwxkAwACRcAAAwwwwAADDDDAAAMMMMBATgBAoAgYYIABBhhggAEGGGCAAQYYyBUACBQBAwwwwAADDDDAAAMMMMBAMvAGAASKgAEGGGCAAQYYYIABBhhgoAkyGD4BQwYMMMAAAwwwwAADDDDAAAMMZAMAAkXAAAMMMMAAAwwwwAADDDDAQE4AQKAIGGCAAQYYYIABBhhggAEGGMgVAAgUAQMMMMAAAwwwwAADDDDAQDLwBgAEioABBhhggAEGGGCAAQYYYKAJMhg+AUMGDDDAAAMMMMAAAwwwwAADDGQDAAJFwAADDDDAAAMMMMAAAwwwwEBOAECgCBhggAEGGGCAAQYYYIABBhjIFQAIFAEDDDDAAAMMMMAAAwwwwEAy8AYABIqAAQYYYIABBhhggAEGGGCgCTIYPgFDBgwwwAADDDDAAAMMMMAAAwxkAwACRcAAAwwwwAADDDDAAAMMMMBATgBAoAgYYIABBhhggAEGGGCAAQYYyBUACBQBAwwwwAADDDDAAAMMMMBAMvAGAASKgAEGGGCAAQYYYIABBhhgoAkyGD4BQwYMMMAAAwwwwAADDDDAAAMMZAMAAkXAAAMMMMAAAwwwwAADDDDAQE4AQKAIGGCAAQYYYIABBhhggAEGGMgVAAgUAQMMMMAAAwwwwAADDDDAQDLwBgAEioABBhhggAEGGGCAAQYYYKAJMhg+AUMGDDDAAAMMMMAAAwwwwAADDGQDAAJFwAADDDDAAAMMMMAAAwwwwEBOAECgCBhggAEGGGCAAQYYYIABBhjIFQAIFAEDDDDAAAMMMMAAAwwwwEAy8AYABIqAAQYYYIABBhhggAEGGGCgCTIYPgFDBgwwwAADDDDAAAMMMMAAAwxkAwACRcAAAwwwwAADDDDAAAMMMMBATgBAoAgYYIABBhhggAEGGGCAAQYYyBUACBQBAwwwwAADDDDAAAMMMMBAMvAGAASKgAEGGGCAAQYYYIABBhhgoAkyGD4BQwYMMMAAAwwwwAADDDDAAAMMZAMAAkXAAAMMMMAAAwwwwAADDDDAQE4AQKAIGGCAAQYYYIABBhhggAEGGMgVAAgUAQMMMMAAAwwwwAADDDDAQDLwBgAEioABBhhggAEGGGCAAQYYYKAJMhg+AUMGDDDAAAMMMMAAAwwwwAADDGQDAAJFwAADDDDAAAMMMMAAAwwwwEBOAECgCBhggAEGGGCAAQYYYIABBhjIFQAIFAEDDDDAAAMMMMAAAwwwwEAy8AYABIqAAQYYYIABBhhggAEGGGCgCTIYPgFDBgwwwAADDDDAAAMMMMAAAwxkAwACRcAAAwwwwAADDDDAAAMMMMBATgBAoAgYYIABBhhggAEGGGCAAQYYyBUACBQBAwwwwAADDDDAAAMMMMBAMvAGAASKgAEGGGCAAQYYYIABBhhgoAkyGD4BQwYMMMAAAwwwwAADDDDAAAMMZAMAAkXAAAMMMMAAAwwwwAADDDDAQE4AQKAIGGCAAQYYYIABBhhggAEGGMgVAAgUAQMMMMAAAwwwwAADDDDAQDLwBgAEioABBhhggAEGGGCAAQYYYKAJMhg+AUMGDDDAAAMMMMAAAwwwwAADDGQDAAJFwAADDDDAAAMMMMAAAwwwwEBOAECgCBhggAEGGGCAAQYYYIABBhjIFQAIFAEDDDDAAAMMMMAAAwwwwEAy8AYABIqAAQYYYIABBhhggAEGGGCgCTIYPgFDBgwwwAADDDDAAAMMMMAAAwxkAwACRcAAAwwwwAADDDDAAAMMMMBATgBAoAgYYIABBhhggAEGGGCAAQYYyBUACBQBAwwwwAADDDDAAAMMMMBAMvAGAASKgAEGGGCAAQYYYIABBhhgoAkyGD4BQwYMMMAAAwwwwAADDDDAAAMMZAMAAkXAAAMMMMAAAwwwwAADDDDAQE4AQKAIGGCAAQYYYIABBhhggAEGGMgVAAgUAQMMMMAAAwwwwAADDDDAQDLwBgAEioABBhhggAEGGGCAAQYYYKAJMhg+AUMGDDDAAAMMMMAAAwwwwAADDGQDAAJFwAADDDDAAAMMMMAAAwwwwEBOAECgCBhggAEGGGCAAQYYYIABBhjIFQAIFAEDDDDAAAMMMMAAAwwwwEAy8AYABIqAAQYYYIABBhhggAEGGGCgCTIYPgFDBgwwwAADDDDAAAMMMMAAAwxkAwACRcAAAwwwwAADDDDAAAMMMMBATgBAoAgYYIABBhhggAEGGGCAAQYYyBUACBQBAwwwwAADDDDAAAMMMMBAMvAGAASKgAEGGGCAAQYYYIABBhhgoAkyGD4BQwYMMMAAAwwwwAADDDDAAAMMZAMAAkXAAAMMMMAAAwwwwAADDDDAQE4AQKAIGGCAAQYYYIABBhhggAEGGMgVAAgUAQMMMMAAAwwwwAADDDDAQDLwBgAEioABBhhggAEGGGCAAQYYYKAJMhg+AUMGDDDAAAMMMMAAAwwwwAADDGQDAAJFwAADDDDAAAMMMMAAAwwwwEBOAECgCBhggAEGGGCAAQYYYIABBhjIFQAIFAEDDDDAAAMMMMAAAwwwwEAy8AYABIqAAQYYYIABBhhggAEGGGCgCTIYPgFDBgwwwAADDDDAAAMMMMAAAwxkAwACRcAAAwwwwAADDDDAAAMMMMBATgBAoAgYYIABBhhggAEGGGCAAQYYyBUACBQBAwwwwAADDDDAAAMMMMBAMvAGAASKgAEGGGCAAQYYYIABBhhgoAkyGD4BQwYMMMAAAwwwwAADDDDAAAMMZAMAAkXAAAMMMMAAAwwwwAADDDDAQE4AQKAIGGCAAQYYYIABBhhggAEGGMgVAAgUAQMMMMAAAwwwwAADDDDAQDLwBgAEioABBhhggAEGGGCAAQYYYKAJMhg+AUMGDDDAAAMMMMAAAwwwwAADDGQDAAJFwAADDDDAAAMMMMAAAwwwwEBHZ/A/mrVBuIarm18AAAAASUVORK5CYII=";
//#endregion
//#region src/myths/assets/classic-right-eye.png
var classic_right_eye_default = "data:image/png;base64,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YAADGMAABjCAAQxgAANCAQAEJAIMYAADGMAABjCAAQxgAAMYwICwAgAEJAIMYAADGMAABjCAAQxgAAMYwICwBQAEJAIMYAADGMAABjCAAQxgAAMYENqAMwBAQCLAAAYwgAEMYAADGMAABjCAAUlBG1i/AII2wAAGMIABDGAAAxjAAAYwgAEMCAUAEJAIMIABDGAAAxjAAAYwgAEMYAADwgoAEJAIMIABDGAAAxjAAAYwgAEMYAADwhYAEJAIMIABDGAAAxjAAAYwgAEMYEBoA84AAAGJAAMYwAAGMIABDGAAAxjAAAYkBW1g/QII2gADGMAABjCAAQxgAAMYwAAGMCAUAEBAIsAABjCAAQxgAAMYwAAGMIABDAgrAEBAIsAABjCAAQxgAAMYwAAGMIABDAhbAEBAIsAABjCAAQxgAAMYwAAGMIABoQ04AwAEJAIMYAADGMAABjCAAQxgAAMYkBS0gfULIGgDDGAAAxjAAAYwgAEMYAADGMCAUAAAAYkAAxjAAAYwgAEMYAADGMAABjAgrAAAAYkAAxjAAAYwgAEMYAADGMAABjAgbAEAAYkAAxjAAAYwgAEMYAADGMAABjDAGQAgIBFgAAMYwAAGMIABDGAAAxjAgEpDG1i/AII2wAAGMIABDGAAAxjAAAYwgAEMCAUAEJAIMIABDGAAAxjAAAYwgAEMYAADwgoAEJAIMIABDGAAAxjAAAYwgAEMYAADwhYAEJAIMIABDGAAAxjAAAYwgAEMYEBoA84AAAGJAAMYwAAGMIABDGAAAxjAAAYkBW1g/QII2gADGMAABjCAAQxgAAMYwAAGMCAUAEBAIsAABjCAAQxgAAMYwAAGMIABDAgrAEBAIsAABjCAAQxgAAMYwAAGMIABDAhbAEBAIsAABjCAAQxgAAMYwAAGMIABoQ04AwAEJAIMYAADGMAABjCAAQxgAAMYkBS0gfULIGgDDGAAAxjAAAYwgAEMYAADGMCAUAAAAYkAAxjAAAYwgAEMYAADGMAABjAgrAAAAYkAAxjAAAYwgAEMYAADGMAABjAgbAEAAYkAAxjAAAYwgAEMYAADGMAABoQ24AwAEJAIMIABDGAAAxjAAAYwgAEMYCANBqxfAEEbYAADGMAABjCAAQxgAAMYwAAGhAIACEgEGMAABjCAAQxgAAMYwAAGMIABYQUACEgEGMAABjCAAQxgAAMYwAAGMIABYQsACEgEGMAABjCAAQxgAAMYwAAGMCC0AWcAgIBEgAEMYAADGMAABjCAAQxgAAOSgjawfgEEbYABDGAAAxjAAAYwgAEMYAADGBAKACAgEWAAAxjAAAYwgAEMYAADGMAABoQVACAgEWAAAxjAAAYwgAEMYAADGMAABoQtACAgEWAAAxjAAAYwgAEMYAADGMCA0AacAQACEgEGMIABDGAAAxjAAAYwgAEMSArawPoFELQBBjCAAQxgAAMYwAAGMIABDGBAKACAgESAAQxgAAMYwAAGMIABDGAAAxgQVgCAgESAAQxgAAMYwAAGMIABDGAAAxgQtgCAgESAAQxgAAMYwAAGMIABDGAAA0IbcAYACEgEGMAABjCAAQxgAAMYwAAGMCApaAPrF0DQBhjAAAYwgAEMYAADGMAABjCAAaEAAAISAQYwgAEMYAADGMAABjCAAQxgQFgBAAISAQYwgAEMYAADGMAABjCAAQxgQNgCAAISAQYwgAEMYAADGMAABjCAAQwIbcAZACAgEWAAAxjAAAYwgAEMYAADGMCApKANrF8AQRtgAAMYwAAGMIABDGAAAxjAAAaEAgAISAQYwAAGMIABDGAAAxjAAAYwgAFhBQAISAQYwAAGMIABDGAAAxjAAAYwgAFhCwAISAQYwAAGMIABDGAAAxjAAAYwgAHOAAABiQADGMAABjCAAQxgAAMYwAAGVBrawPoFELQBBjCAAQxgAAMYwAAGMIABDGBAKACAgESAAQxgAAMYwAAGMIABDGAAAxgQVgCAgESAAQxgAAMYwAAGMIABDGAAAxgQtgCAgESAAQxgAAMYwAAGMIABDGAAA0IbcAYACEgEGMAABjCAAQxgAAMYwAAGMCApaAPrF0DQBhjAAAYwgAEMYAADGMAABjCAAaEAAAISAQYwgAEMYAADGMAABjCAAQxgQFgBAAISAQYwgAEMYAADGMAABjCAAQxgQNgCAAISAQYwgAEMYAADGMAABjCAAQwIbcAZACAgEWAAAxjAAAYwgAEMYAADGMCApKANrF8AQRtgAAMYwAAGMIABDGAAAxjAAAaEAgAISAQYwAAGMIABDGAAAxjAAAYwgAFhBQAISAQYwAAGMIABDGAAAxjAAAYwgAFhCwAISAQYwAAGMIABDGAAAxjAAAYwILQBZwCAgESAAQxgAAMYwAAGMIAB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";
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
var gem = (x, y, fill, size = 14) => `<g transform="translate(${x} ${y})"><path d="M0-${size}L${size * .78} 0L0 ${size}L-${size * .78} 0Z" fill="${fill}" stroke="#f4dca1" stroke-width="${size * .13}" stroke-linejoin="round"/><path d="M0-${size * .82}L0 ${size * .78}L-${size * .62} 0Z" fill="white" opacity=".3"/><path d="M0 ${size * .78}L${size * .62} 0L0-${size * .1}Z" fill="#182d42" opacity=".24"/></g>`;
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
	return `<linearGradient id="${u}-gold" x1=".15" y1="0" x2=".85" y2="1"><stop stop-color="#fff3bd"/><stop offset=".32" stop-color="#efbc59"/><stop offset=".68" stop-color="#b8782e"/><stop offset="1" stop-color="#f9db88"/></linearGradient>
  <linearGradient id="${u}-bronze" x2=".8" y2="1"><stop stop-color="#e7c997"/><stop offset=".42" stop-color="#b58a50"/><stop offset="1" stop-color="#79613c"/></linearGradient>
  <linearGradient id="${u}-obsidian" x2=".8" y2="1"><stop stop-color="#7d718f"/><stop offset=".4" stop-color="#393347"/><stop offset=".75" stop-color="#211e30"/><stop offset="1" stop-color="#72657e"/></linearGradient>
  <linearGradient id="${u}-silver" x2=".7" y2="1"><stop stop-color="#ffffff"/><stop offset=".4" stop-color="#e0e9ee"/><stop offset="1" stop-color="#8eabc3"/></linearGradient>
  <linearGradient id="${u}-ear" x2=".7" y2="1"><stop stop-color="#354157"/><stop offset=".5" stop-color="#1a243a"/><stop offset="1" stop-color="#485368"/></linearGradient>
  <linearGradient id="${u}-coral" x2=".8" y2="1"><stop stop-color="#ffe0bb"/><stop offset=".4" stop-color="#f0ae81"/><stop offset="1" stop-color="#c98364"/></linearGradient>
  <radialGradient id="${u}-sheen" cx=".35" cy=".2" r=".8"><stop stop-color="#fff9de" stop-opacity=".26"/><stop offset="1" stop-color="#fff9de" stop-opacity="0"/></radialGradient>`;
}
function wing(u, color = silver(u)) {
	return path("M0 0C-34-42-40-99-21-139C-11-146-9-124-3-110C5-148 20-167 27-158C35-146 15-105 24-103C49-131 65-135 66-123C67-110 46-79 35-61C59-75 75-78 76-65C75-42 40-10 0 0Z", color) + line("M3-17Q18-54 35-83M-2-29Q-10-67-11-96", "#b5bdc3", 3, "opacity=\".55\"");
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
function medusaScales(scale = 1) {
	return `<g transform="scale(${scale})">${[
		3,
		4,
		3
	].map((count, row) => Array.from({ length: count }, (_, i) => {
		return `<g transform="translate(${(i - (count - 1) / 2) * 49} ${row * 35})">${path("M-21-10Q0-1 21-10Q22 11 0 26Q-22 11-21-10Z", "#b6ce9c", "fill-opacity=\".2\"")}${line("M-21-10Q-22 11 0 26Q22 11 21-10", "#c4d6a7", 3, "opacity=\".65\"")}</g>`;
	}).join("")).join("")}</g>`;
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
	return path(`M-54 3L-49-36L-21-${height - 22}L0-${height}L21-${height - 22}L49-36L54 3Z`, `url(#${u}-obsidian)`) + path(`M0-${height - 14}L0-9L-38-30Z`, "#a191b7", "opacity=\".48\"") + line(`M-31-32L0-${height - 16}L31-32`, "#d3bedf", 4, "opacity=\".8\"");
}
function coralBranch(u) {
	return line("M0 8Q-17-45-7-123M-8-55Q-48-51-66-88M-9-87Q26-82 42-117M-7-113Q-31-119-40-145", "#b87058", 31) + line("M0 4Q-17-48-7-125M-8-58Q-48-54-64-90M-9-90Q26-85 40-118M-7-116Q-31-122-38-146", `url(#${u}-coral)`, 27) + line("M-6-3Q-18-61-13-111M-24-62Q-42-64-51-77", "#ffe2bf", 6) + "<circle cx=\"-7\" cy=\"-127\" r=\"10\" fill=\"#ffce9e\"/><circle cx=\"38\" cy=\"-119\" r=\"9\" fill=\"#ffce9e\"/>";
}
function moon(u) {
	return path("M34-112C-62-105-94 19-5 68C-127 58-144-95-49-128Q-6-145 34-112Z", silver(u), "stroke=\"#86a8ba\" stroke-width=\"4\"") + line("M-14-119C-88-105-106-29-66 23", "#fff", 7) + gem(-8, 79, "#80bad2", 14);
}
function feather(u) {
	return path("M-24 12C-51-39-23-127 0-153C26-125 48-38 24 12Z", gold(u), "stroke=\"#a27637\" stroke-width=\"4\"") + path("M0-133C-25-95-30-32-15 3L0-8Z", "#ffe9aa") + line("M0-5V-123", "#b2823e", 5) + line("M0-35L16-51M0-65L20-81M0-91L12-105", "#cc9646", 4);
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
		return at([x, y], feather(u), `rotate(${n * 12})`);
	}).join("");
	if (id === "athena" || id === "hermes") cap = capShell(u, id);
	if (id === "athena") {
		const ridge = fit.capHull.filter(([x]) => x >= -230 && x <= 45).map(([x, y]) => [x, y - 28]);
		detail = path(curve(ridge) + curve(ridge.slice().reverse().map(([x, y]) => [x + 12, y - 36])).replace(/^M/, "L") + "Z", "#854b44") + line(curve(ridge.map(([x, y]) => [x + 4, y - 12])), "#bd8373", 6);
	}
	if (id === "hermes") detail = [-290, 195].map((x, i) => at([x, bandY(x, .5) - 12], `<g data-myth-motion="${i ? "wing-right" : "wing-left"}">${wing(u)}</g>`, `scale(${i ? -1 : 1} 1) rotate(-24)`)).join("");
	if (id === "poseidon") detail = [-225, 140].map((x, i) => at(foreheadAnchor(x), coralBranch(u), `scale(${i ? 1 : -1} 1)`)).join("");
	if (id === "artemis") {
		const [, y] = foreheadAnchor(center);
		detail = at([center + 42, y - 60], moon(u), "scale(.7)");
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
	const d = "M-19 3C-75-21-65-96-14-110C39-111 68-39 22 3V23H63V55H22V119H-19V55H-60V23H-19ZM0-25C29-45 24-78 1-82C-23-78-30-45 0-25Z";
	return path(d, "#91602f", "transform=\"translate(0 5)\"") + path(d, gold(u), "fill-rule=\"evenodd\" stroke=\"#a67535\" stroke-width=\"4\"") + line("M-10 69V102M-47 34H-24M28 34H49", "#fff5c9", 6) + line("M-24-30C-44-55-28-85-8-91", "#fff5c9", 6) + `<circle cy="37" r="16" fill="#a27335"/><circle cy="34" r="12" fill="#1d6488"/><ellipse cx="-3" cy="30" rx="4" ry="5" fill="#85d8de"/>`;
}
function owl(u) {
	return `<g>${path("M-67 37Q-80-5-62-39L-68-75Q-38-73-24-55Q0-65 24-55Q42-74 68-75L62-39Q80-5 67 37Q54 79 0 80Q-54 79-67 37Z", `url(#${u}-bronze)`, "stroke=\"#765034\" stroke-width=\"5\"")}${path("M-58 17Q-66-36-30-40Q-9-41 0-23Q9-41 30-40Q66-36 58 17Q44 61 0 65Q-44 61-58 17Z", "#fff0ca")}${[-29, 29].map((x) => `<circle cx="${x}" cy="-5" r="23" fill="#fffdf0"/><g data-myth-motion="owl-eye"><ellipse cx="${x}" cy="-4" rx="12" ry="15" fill="#273b3e"/><circle cx="${x - 4}" cy="-10" r="5" fill="white"/></g>`).join("")}${path("M-10 14Q0 9 10 14L0 29Z", gold(u))}${line("M-18 42l8 7M10 49l8-7", "#cfab6d", 5)}${path("M-65-4Q-88 19-59 55L-43 41Z", "#9b6b42")}${path("M65-4Q88 19 59 55L43 41Z", "#9b6b42")}${line("M-38 78H-17M17 78H38", gold(u), 10)}</g>`;
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
	return `${path("M-91-106Q-106-142-68-139Q-40-129-44-99L-37 32Q0 51 37 32L44-99Q40-129 68-139Q106-142 91-106L77 49Q84 95 0 109Q-84 95-77 49Z", gold(u), "stroke=\"#9c682e\" stroke-width=\"6\"")}${line("M-70-111Q-78-117-73-123M70-111Q78-117 73-123", "#fff3bd", 8)}${line("M-62-89H62", "#b57630", 19)}${line("M-62-94H62", "#ffe8a6", 8)}${[
		-34,
		-17,
		0,
		17,
		34
	].map((x, i) => line(`M${x}-84V52`, "#fff3ce", 4, `data-myth-motion="string" data-index="${i}"`)).join("")}${path("M-56 39Q0 68 56 39L54 71Q0 111-54 71Z", `url(#${u}-bronze)`)}${line("M-47 55Q0 80 47 55", "#ffe6a3", 6)}<circle cy="78" r="17" fill="#c18536"/><circle cy="75" r="12" fill="#ffd776"/>${sparkle(0, 75, .55, "#fff4c2")}`;
}
function trident(u) {
	return `<rect x="-14" y="-134" width="28" height="341" rx="14" fill="#a76d32"/><rect x="-13" y="-137" width="24" height="338" rx="12" fill="${gold(u)}"/>${line("M-6-83V180", "#ffe9aa", 5)}
 ${path("M-14-83C-66-83-89-111-87-157L-99-155L-83-227Q-80-235-76-227L-44-167L-60-169Q-59-121-14-117L-14-193L-32-191L-4-262Q0-271 4-262L32-191L14-193V-117Q59-121 60-169L44-167L76-227Q80-235 83-227L99-155L87-157Q89-111 14-83Z", gold(u), "stroke=\"#a87936\" stroke-width=\"5\" stroke-linejoin=\"round\"")}
 ${path("M0-247L-18-199H0Z", "#fff4c5")}${path("M-79-214L-88-165L-74-168Z", "#fff4c5")}${path("M79-214L58-169L73-167Z", "#fff4c5")}
 ${line("M-69-155Q-67-108-22-104M69-155Q67-108 22-104", "#fff0b8", 6)}
 <circle cy="-102" r="28" fill="#bc873d"/><circle cy="-105" r="22" fill="#c8eee2"/>${gem(0, -105, "#299b98", 18)}
 <rect x="-19" y="-24" width="38" height="66" rx="11" fill="#287774"/>${[
		-13,
		2,
		17,
		32
	].map((y) => line(`M-14 ${y}l28-5`, "#8bd0bd", 5)).join("")}
 <rect x="-21" y="-32" width="42" height="12" rx="5" fill="${gold(u)}"/><rect x="-21" y="39" width="42" height="12" rx="5" fill="${gold(u)}"/>${gem(0, 192, "#4da99b", 16)}`;
}
function thunderbolt(u) {
	const d = "M20-201L-91 18Q-94 25-83 25H-23L-49 177Q-51 192-40 180L110-40Q116-51 102-51H38L91-189Q96-201 84-201Z";
	return path(d, "#af772c", "transform=\"translate(4 9)\"") + path(d, gold(u), "stroke=\"#b27a30\" stroke-width=\"5\" stroke-linejoin=\"round\"") + path("M22-182L-66 7H1L-22 125L71-25H17L66-182Z", "#ffe9a0") + line("M22-175L-58 0H8", "#fff8d5", 7) + `<g data-myth-motion="lightning-glint">${sparkle(69, -157, .65, "#fff9e6")}${sparkle(-26, 118, .38, "#fff9e6")}</g>`;
}
function bow(u) {
	return `${path("M-67-194C-6-184-28-103 14-43Q39 0 14 43C-28 103-6 184-67 194L-80 174C-38 148-57 88-17 28Q-2 0-17-28C-57-88-38-148-80-174Z", silver(u), "stroke=\"#64879d\" stroke-width=\"5\" stroke-linejoin=\"round\"")}
 ${line("M-66-175C-30-153-41-88-3-36M-66 175C-30 153-41 88-3 36", "#f8feff", 8)}
 ${path("M-73-191Q-43-191-36-167L-55-156Z", gold(u))}${path("M-73 191Q-43 191-36 167L-55 156Z", gold(u))}
 ${line("M-66-177L49 0L-66 177", "#eef9f7", 5, "data-bow-string")}
 <g data-bow-arrow>${line("M69 0H-163", "#916b3e", 11)}${line("M69-2H-163", "#f4d59b", 6)}${path("M-198 0L-153-23L-163 0L-153 23Z", silver(u), "stroke=\"#6b8c9e\" stroke-width=\"3\"")}${path("M-192 0L-160-15L-166 0Z", "#fff")}${path("M42 0L66-22H84L65 0L84 22H66Z", "#a6cbd0")}${line("M47 0H75", "#edfafa", 3)}</g>
 <rect x="-18" y="-33" width="39" height="66" rx="13" fill="#285e66"/>${[
		-19,
		-5,
		9,
		23
	].map((y) => line(`M-12 ${y}l26-6`, "#90beb9", 5)).join("")}${gem(1, -42, "#86bbd5", 14)}${gem(1, 42, "#86bbd5", 14)}`;
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
var BODY_CENTER = {
	x: 634.5,
	y: 657.5
};
function makePower(svg, f, u, motion) {
	const layer = (key, art) => `<g data-power-part="${key}">${art}</g>`;
	const trace = (d, color, width = 8) => line(d, color, width, "data-power-trace pathLength=\"1\" stroke-dasharray=\"1 1\"");
	const particle = (i, art) => `<g data-power-particle="${i}">${art}</g>`;
	const shield = "M650 215Q860 332 1030 333V660Q1015 925 650 1080Q285 925 270 660V333Q440 332 650 215Z";
	let back = "", front = "";
	svg.querySelector("defs").insertAdjacentHTML("beforeend", `<filter id="${u}-power-glow" x="-70%" y="-70%" width="240%" height="240%"><feDropShadow dx="0" dy="0" stdDeviation="11" flood-color="${f.id === "poseidon" ? "#b7f5e8" : f.id === "hades" ? "#c8a3e0" : "#ffe3a0"}" flood-opacity=".8"/></filter>`);
	if (f.id === "anubis") {
		back = layer("ward", `<ellipse cx="${BODY_CENTER.x}" cy="${BODY_CENTER.y}" rx="460" ry="465" fill="#d6ad54" fill-opacity=".06" stroke="#a8792e" stroke-width="19"/><ellipse data-power-trace pathLength="1" stroke-dasharray="1 1" cx="${BODY_CENTER.x}" cy="${BODY_CENTER.y}" rx="460" ry="465" fill="none" stroke="#ffe2a0" stroke-width="11"/><ellipse cx="${BODY_CENTER.x}" cy="${BODY_CENTER.y}" rx="418" ry="423" fill="none" stroke="#ce9d43" stroke-width="5" opacity=".6"/>${Array.from({ length: 12 }, (_, i) => {
			const a = i * Math.PI / 6;
			return particle(i, `<g transform="translate(${BODY_CENTER.x + 460 * Math.cos(a)} ${BODY_CENTER.y + 465 * Math.sin(a)}) rotate(${i * 30})">${gem(0, 0, "#ffe8ae", 27)}${line("M-9-42H9M0-50V-34", "#e9c574", 5)}</g>`);
		}).join("")}`);
		front = layer("ankh-light", [
			[190, 540],
			[1110, 545],
			[250, 870],
			[1040, 880]
		].map(([x, y]) => sparkle(x, y, 1.2, "#e5ba66")).join(""));
	}
	if (f.id === "horus") {
		back = [-1, 1].map((s) => layer(s < 0 ? "wing-l" : "wing-r", `<g transform="translate(${BODY_CENTER.x} 700) scale(${s} 1)">${path("M0 80Q130-190 470-365Q432-198 345-143L440-219Q406-80 285-31L375-94Q302 70 115 133Z", gold(u), "opacity=\".82\"")}${[
			0,
			1,
			2,
			3
		].map((i) => line(`M75 86Q${215 + i * 35} ${-30 - i * 55} ${340 + i * 28} ${-100 - i * 70}`, "#fff0b7", 6, "opacity=\".7\"")).join("")}</g>`)).join("");
		front = layer("feathers", Array.from({ length: 8 }, (_, i) => particle(i, path("M0-36Q25-8 0 37Q-20 2 0-36Z", gold(u)) + line("M0-22V24", "#fff2c7", 3))).join(""));
	}
	if (f.id === "athena") {
		back = layer("shield", `<g data-power-body-frame transform="translate(${BODY_CENTER.x} ${BODY_CENTER.y}) scale(1.24 1.14) translate(-650 -647.5)">` + path(shield, "#a5b888", "fill-opacity=\".12\" stroke=\"#a2b17a\" stroke-width=\"7\"") + trace(shield, "#e4e9be", 12) + line("M650 250Q840 360 995 362V657Q978 903 650 1042Q322 903 305 657V362Q460 360 650 250Z", "#c5d1a2", 4) + "</g>");
		front = layer("olives", Array.from({ length: 8 }, (_, i) => particle(i, "<ellipse rx=\"15\" ry=\"34\" fill=\"#a0b581\"/>" + line("M0-22V22", "#e1e7bd", 3))).join(""));
	}
	if (f.id === "poseidon") {
		back = layer("tide", path("M70 990Q245 710 475 884Q728 1045 979 728Q1073 598 1175 739Q1230 845 1120 914Q1171 800 1098 792Q1043 789 949 957Q658 1202 70 1085Z", "#64aaa7", "fill-opacity=\".78\"") + line("M92 980Q256 777 477 912Q743 1063 1008 754Q1080 671 1140 747Q1178 793 1141 838", "#c6f3e7", 15) + line("M230 1030Q478 1134 755 1039", "#aadfd2", 8));
		front = layer("foam", line("M185 1048Q300 1002 414 1051T677 1063T1005 1020", "#e0f8e9", 14, "opacity=\".8\"")) + layer("spray", Array.from({ length: 10 }, (_, i) => particle(i, `<ellipse rx="${8 + i % 3 * 3}" ry="${15 + i % 3 * 4}" fill="#c9f1e6"/>`)).join(""));
	}
	if (f.id === "artemis") {
		back = layer("moon", `<g transform="translate(216 200)">${path("M36-107C-58-84-78 47 5 92C-131 72-141-91-34-125Q10-135 36-107Z", "#d4e4f1")}</g>`);
		front = layer("moon-trail", trace("M276 800Q248 545 221 275", "#d3edf3", 8)) + layer("moon-impact", `<circle cx="216" cy="200" r="74" fill="none" stroke="#d0e9f1" stroke-width="6"/>${Array.from({ length: 6 }, (_, i) => particle(i, sparkle(0, 0, .8, "#edf7fa"))).join("")}`);
	}
	if (f.id === "apollo") {
		back = layer("sun", `<circle cx="${BODY_CENTER.x}" cy="525" r="340" fill="#efc678" fill-opacity=".12" stroke="#e1b360" stroke-width="7"/>${Array.from({ length: 12 }, (_, i) => `<g data-power-ray="${i}" transform="translate(${BODY_CENTER.x} 525) rotate(${i * 30})">${line("M0-364V-428", "#d4a04f", 11)}</g>`).join("")}`);
		front = layer("music", Array.from({ length: 5 }, (_, i) => particle(i, path("M0 5V-58L44-71V-9H33V-53L12-47V5Z", "#d5a24d") + "<ellipse cy=\"6\" rx=\"17\" ry=\"11\" fill=\"#d5a24d\"/><ellipse cx=\"33\" cy=\"-7\" rx=\"17\" ry=\"11\" fill=\"#d5a24d\"/>")).join(""));
	}
	if (f.id === "zeus") {
		back = [-1, 1].map((s) => layer(s < 0 ? "cloud-l" : "cloud-r", `<g transform="translate(${s < 0 ? 190 : 730} ${s < 0 ? 240 : 190})">${path("M0 48Q-18-16 49-27Q64-103 143-69Q185-123 242-67Q304-82 326-25Q388-22 374 40Z", "#8298b1", "opacity=\".58\"")}</g>`)).join("");
		const bolt = "M1020 257L1010 422L1120 399L1048 586L1148 554L1080 785";
		front = layer("lightning", trace(bolt, "#dfbd78", 29) + trace(bolt, "#fff5d7", 10) + trace("M1080 422L1160 485L1131 545", "#e1bf7d", 10)) + layer("strike-ground", "<ellipse cx=\"1055\" cy=\"1050\" rx=\"102\" ry=\"24\" fill=\"none\" stroke=\"#e8c988\" stroke-width=\"8\"/>") + layer("sparks", Array.from({ length: 6 }, (_, i) => particle(i, sparkle(0, 0, .7, "#edcf90"))).join(""));
	}
	if (f.id === "medusa") {
		back = layer("gaze", [
			0,
			1,
			2
		].map((i) => `<g data-power-ripple="${i}"><ellipse cx="${BODY_CENTER.x}" cy="${BODY_CENTER.y}" rx="440" ry="440" fill="none" stroke="#8cae83" stroke-width="${9 - i * 2}"/></g>`).join(""));
		front = layer("stones", Array.from({ length: 8 }, (_, i) => particle(i, path("M-24-28L15-38L36-5L20 26L-19 30L-36-1Z", "#94a08f", "stroke=\"#c5cdbb\" stroke-width=\"4\"") + line("M-24-28L-5-4L36-5M-5-4L-19 30", "#bdc6b2", 3))).join(""));
	}
	if (f.id === "hades") {
		back = layer("gate", path("M190 1090V515C190-65 1110-65 1110 515V1090Z", "#56365f", "fill-opacity=\".14\"") + trace("M190 1090V515C190-65 1110-65 1110 515V1090", "#aa89b8", 13) + line("M226 1080V515C226 3 1074 3 1074 515V1080", "#bda2c8", 4, "opacity=\".55\"") + line("M175 1090H345M955 1090H1125", "#8f719f", 15));
		front = layer("embers", Array.from({ length: 8 }, (_, i) => particle(i, path("M0 20C-30 3-17-14 1-39C-2-13 25-9 17 10Q12 23 0 20Z", "#b49ac6") + path("M0 16Q-11 6 2-12Q16 11 0 16Z", "#e5d8ec"))).join(""));
	}
	const rear = group(back), fore = group(front);
	for (const node of [rear, fore]) {
		node.dataset.power = f.id;
		node.setAttribute("opacity", "0");
		node.setAttribute("pointer-events", "none");
	}
	const hound = svg.querySelector("[data-cerberus-shadow]");
	(f.id === "hades" && hound ? hound.parentElement : motion).before(rear);
	svg.append(fore);
	const nodes = Object.fromEntries([...svg.querySelectorAll("[data-power-part]")].map((n) => [n.dataset.powerPart, n]));
	const particles = [...svg.querySelectorAll("[data-power-particle]")], traces = [...svg.querySelectorAll("[data-power-trace]")], rays = [...svg.querySelectorAll("[data-power-ray]")], ripples = [...svg.querySelectorAll("[data-power-ripple]")];
	const set = (key, transform = "", opacity = 1) => {
		const n = nodes[key];
		if (n) {
			n.setAttribute("transform", transform);
			n.setAttribute("opacity", String(opacity));
		}
	};
	const center = (x, y, s, angle = 0) => `translate(${x} ${y}) rotate(${angle}) scale(${s}) translate(${-x} ${-y})`;
	const bowFrame = svg.querySelector("[data-bow-frame]"), arrow = svg.querySelector("[data-bow-arrow]"), string = svg.querySelector("[data-bow-string]"), charm = svg.querySelector("[data-myth-motion=\"ankh\"]"), trident = svg.querySelector("[data-power-source=\"trident\"]");
	return { render(ms) {
		const q = ms === null ? 0 : clamp01(ms / POWER_MS), e = powerStrength(ms), charge = smooth(q / .3), release = smooth((q - .3) / .18), settle = 1 - smooth((q - .72) / .28);
		rear.setAttribute("opacity", String(e));
		fore.setAttribute("opacity", String(e));
		const poseTransform = motion.getAttribute("transform") || "";
		rear.setAttribute("transform", poseTransform);
		fore.setAttribute("transform", poseTransform);
		const traced = f.id === "zeus" ? smooth((q - .3) / .12) : f.id === "artemis" ? smooth((q - .35) / .17) : smooth((q - .05) / .42);
		for (const node of traces) node.setAttribute("stroke-dashoffset", String(1 - traced));
		set("ward", center(BODY_CENTER.x, BODY_CENTER.y, .78 + charge * .22 + release * .015));
		set("ankh-light", `translate(0 ${-release * 55})`, release * .8);
		for (const source of [charm, trident]) if (source) if (e > .2) source.setAttribute("filter", `url(#${u}-power-glow)`);
		else source.removeAttribute("filter");
		const spread = .3 + .7 * smooth((q - .08) / .36);
		set("wing-l", `translate(${BODY_CENTER.x} 700) rotate(${18 * (1 - spread)}) scale(${spread} ${.74 + .26 * spread}) translate(${-BODY_CENTER.x} -700)`);
		set("wing-r", `translate(${BODY_CENTER.x} 700) rotate(${-18 * (1 - spread)}) scale(${spread} ${.74 + .26 * spread}) translate(${-BODY_CENTER.x} -700)`);
		set("shield", center(BODY_CENTER.x, BODY_CENTER.y, .84 + .16 * charge));
		set("tide", `translate(${-190 * (1 - release)} ${80 * (1 - release) + 30 * (1 - settle)})`);
		set("foam", `translate(${(release - .5) * 85} ${15 * (1 - settle)})`, release * .8);
		set("moon", `translate(0 ${-charge * 10})`, .6 + .4 * release);
		set("moon-trail", "", smooth((q - .34) / .07) * (1 - smooth((q - .53) / .15)));
		const impact = smooth((q - .48) / .22);
		set("moon-impact", center(216, 200, .4 + impact * .9), smooth((q - .48) / .05) * (1 - smooth((q - .64) / .16)));
		set("sun", center(BODY_CENTER.x, 525, .8 + .2 * charge, release * 12));
		rays.forEach((n, i) => n.setAttribute("opacity", String(smooth((q - .12 - i * .018) / .16))));
		set("cloud-l", `translate(${-105 * (1 - charge)} ${-18 * charge})`);
		set("cloud-r", `translate(${100 * (1 - charge)} ${-18 * charge})`);
		set("lightning", "", smooth((q - .29) / .04) * (1 - smooth((q - .55) / .22)));
		set("strike-ground", center(1055, 1050, .5 + release * .7), smooth((q - .42) / .08) * (1 - smooth((q - .63) / .2)));
		ripples.forEach((n, i) => {
			const r = clamp01((q - .18 - i * .11) / .48);
			n.setAttribute("transform", center(BODY_CENTER.x, BODY_CENTER.y, .65 + r * .5));
			n.setAttribute("opacity", String(Math.sin(r * Math.PI) * .65));
		});
		set("gate", `translate(650 1090) scale(${.72 + .28 * charge} 1) translate(-650 -1090)`);
		if (hound) hound.setAttribute("opacity", String(.3 + e * release * .38));
		particles.forEach((node, i) => {
			let x = 0, y = 0, a = 0, s = 1, opacity = 1;
			const side = i % 2 ? 1 : -1, index = Math.floor(i / 2);
			if (f.id === "anubis") opacity = smooth((q - .08 - i * .023) / .12);
			if (f.id === "horus") {
				const p = clamp01((q - .3 - index * .035) / .6);
				x = BODY_CENTER.x + side * (325 + index * 44 + Math.sin(p * Math.PI) * 45);
				y = 545 + index * 92 + p * 215;
				a = side * (20 + Math.sin(p * 5 + index) * 18);
				opacity = Math.sin(p * Math.PI) * .85;
			}
			if (f.id === "athena") {
				const p = smooth((q - .18 - index * .055) / .27);
				x = BODY_CENTER.x + side * (500 - index * 15);
				y = 925 - index * 88 - p * 55;
				a = side * (28 + 10 * p);
				s = .6 + .4 * p;
				opacity = p;
			}
			if (f.id === "poseidon") {
				const p = clamp01((q - .33 - index * .025) / .47);
				x = 650 + side * (280 + index * 43 + p * 55);
				y = 970 - Math.sin(p * Math.PI) * (180 + index * 36);
				a = side * p * 40;
				opacity = Math.sin(p * Math.PI) * .9;
			}
			if (f.id === "artemis") {
				const a0 = i * Math.PI / 3;
				x = 216 + Math.cos(a0) * (75 + impact * 60);
				y = 200 + Math.sin(a0) * (75 + impact * 60);
				s = .5 + .6 * impact;
			}
			if (f.id === "apollo") {
				const p = clamp01((q - .18 - i * .065) / .52);
				x = 1050 + Math.sin(p * 4 + i * .7) * 65;
				y = 770 - p * 560;
				a = Math.sin(p * 4 + i) * 14;
				s = .75 + .25 * p;
				opacity = Math.sin(p * Math.PI);
			}
			if (f.id === "zeus") {
				const p = clamp01((q - .4 - i * .012) / .32);
				x = 1070 + Math.cos(i * Math.PI / 3) * p * 100;
				y = 800 + Math.sin(i * Math.PI / 3) * p * 150;
				s = 1 - p * .6;
				opacity = Math.sin(p * Math.PI);
			}
			if (f.id === "medusa") {
				const lift = smooth((q - .16 - index * .04) / .24) * settle;
				x = BODY_CENTER.x + side * (432 + index * 24 + Math.sin(q * 6 + index) * 15 * lift);
				y = 1010 - index * 92 - lift * (150 + index * 10);
				a = side * (12 + index * 15 + release * 42) * lift;
				s = .65 + index * .13;
				opacity = smooth((q - .1 - index * .04) / .12);
			}
			if (f.id === "hades") {
				const p = clamp01((q - .17 - index * .04) / .66);
				x = 650 + side * (420 + Math.sin(p * 6 + index) * 32);
				y = 1055 - p * (380 + index * 40);
				a = side * Math.sin(p * 5) * 12;
				s = .6 + .5 * Math.sin(p * Math.PI);
				opacity = Math.sin(p * Math.PI) * .9;
			}
			node.setAttribute("transform", `translate(${x} ${y}) rotate(${a}) scale(${s})`);
			node.setAttribute("opacity", String(opacity));
		});
		if (bowFrame) bowFrame.setAttribute("transform", `translate(276 827) rotate(${22 + e * 63}) scale(1.08)`);
		if (arrow && string) {
			const draw = smooth(q / .31), shot = smooth((q - .35) / .14), reset = smooth((q - .85) / .15), pull = ms === null ? 0 : draw * (1 - shot) * 65;
			string.setAttribute("d", `M-66-177L${49 + pull} 0L-66 177`);
			arrow.setAttribute("transform", `translate(${ms === null ? 0 : pull - shot * (1 - reset) * 660} 0)`);
			arrow.setAttribute("opacity", String(ms === null ? 1 : shot < .96 ? 1 : reset));
		}
	} };
}
function makeMyth(host, f, u, label = f.name, { tintedEyes = true } = {}) {
	const rig = createRig(host, _mythic_body_default, u, label);
	const svg = host.querySelector("svg");
	svg.setAttribute("viewBox", "30 -75 1200 1280");
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
	let ornament = null, effects = null, companion = null;
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
	if (f.id === "hades") {
		companion = group(cerberusShadow(u));
		motion.before(companion);
	}
	if (f.id === "hermes") {
		motion.append(group(`${line("M405 775Q638 854 854 898", "#8f5b3c", 31)}${line("M405 775Q638 854 854 898", "#e9bc80", 6)}<g transform="translate(799 954) rotate(-12)">${path("M-72-53Q0-80 75-53L72 46Q0 74-72 46Z", "#a86d44")}${path("M-72-53Q0-80 75-53L73-9Q0 23-72-9Z", "#d5a471")}${line("M-61 32Q0 52 61 32", "#eac08c", 4)}${path("M-15-22H16V7H-15Z", gold(u))}</g>`));
		motion.append(group(`<g transform="translate(431 1073) rotate(-7)">${path("M-45-12Q0-46 45-12L50 17Q0 40-52 17Z", "#a86d44")}${line("M-26-15L-4 13L22-20", gold(u), 10)}<g transform="translate(-40 1) rotate(-35) scale(.38)"><g data-myth-motion="sandal">${wing(u)}</g></g></g><g transform="translate(738 1058) rotate(-15)">${path("M-45-12Q0-46 45-12L50 17Q0 40-52 17Z", "#a86d44")}${line("M-26-15L-4 13L22-20", gold(u), 10)}<g transform="translate(40 1) scale(-.38 .38) rotate(-35)"><g data-myth-motion="sandal">${wing(u)}</g></g></g>`));
	}
	if (f.id === "poseidon") {
		attach("right-flipper", `<g data-power-source="trident" transform="translate(1032 828) rotate(6) scale(.86)">${trident(u)}</g>`, [
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
		const powerQ = powerMs === null ? 0 : clamp01(powerMs / POWER_MS), release = smooth((powerQ - .3) / .18);
		if (strength) if (f.id === "anubis") {
			p.left += (7 + release * 14) * strength;
			p.right -= (7 + release * 14) * strength;
			p.y -= 18 * strength;
		} else if (f.id === "horus") {
			p.left += (10 + release * 25) * strength;
			p.right -= (10 + release * 25) * strength;
			p.y -= (14 + release * 35) * strength;
		} else if (f.id === "poseidon" || f.id === "zeus") {
			p.right -= (12 + release * 15) * strength;
			p.y += (8 - 20 * release) * strength;
			p.rotate += (f.id === "zeus" ? 2 : -2) * Math.sin(powerQ * Math.PI) * strength;
		} else if (f.id === "artemis") {
			p.left += 12 * strength;
			p.rotate -= 3 * strength;
			p.x += Math.sin(clamp01((powerQ - .35) / .17) * Math.PI) * 9 * strength;
		} else if (f.id === "apollo") {
			p.right -= 12 * strength;
			p.left += 8 * strength;
		} else if (f.id === "hades") p.y -= 12 * strength;
		else {
			p.left += 7 * strength;
			p.right -= 7 * strength;
		}
		rig.render(p);
		const poseTransform = motion.getAttribute("transform") || "";
		effects?.setAttribute("transform", poseTransform);
		companion?.setAttribute("transform", poseTransform);
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
			if (kind === "string") {
				const pluck = clamp01((powerQ - .18 - index * .065) / .15), vibration = Math.sin(pluck * Math.PI * 6) * (1 - pluck) * strength;
				node.setAttribute("transform", `translate(${vibration * 4} 0)`);
				node.setAttribute("opacity", String(strength ? .7 + .3 * Math.abs(vibration) : active ? .48 + .52 * (.5 + .5 * Math.sin(time / 260 + index * .9)) : 1));
			}
			if (kind === "snake") node.setAttribute("transform", `rotate(${active ? Math.sin(time / 1050 + index * 1.4) * 2.5 + Math.sin(clamp01((powerQ - .08 - index * .035) / .4) * Math.PI) * strength * 9 : 0} 0 -12)`);
			if (kind === "hound-head") node.setAttribute("transform", `rotate(${active ? Math.sin(time / 1900 + index * 1.8) * 2 : 0} 0 145)`);
			if (kind === "hound-shadow") node.setAttribute("transform", `translate(0 ${active ? Math.sin(time / 2400) * 6 : 0}) translate(650 570) scale(${1 + strength * release * .09}) translate(-650 -570)`);
			if (kind === "lightning-glint") {
				const phase = time % 5600 / 5600;
				const glow = phase < .2 ? Math.sin(phase / .2 * Math.PI) ** 2 : 0;
				node.setAttribute("opacity", active ? String(.12 + .88 * glow) : ".45");
			}
		}
		power.render(powerMs);
	} };
}
function iconHeadpiece(id, u) {
	const rim = "M16 87C29 52 76 51 128 51C180 51 227 52 240 87L237 93C223 60 179 59 128 59C77 59 33 60 19 93Z";
	const metal = id === "hades" ? `url(#${u}-obsidian)` : id === "poseidon" ? `url(#${u}-coral)` : id === "artemis" ? silver(u) : id === "athena" ? `url(#${u}-bronze)` : id === "medusa" ? "#316750" : gold(u);
	const band = path(rim, metal) + line("M19 87C32 55 77 53 128 53C179 53 224 55 237 87", id === "artemis" ? "#f4fcff" : "#fff0c6", 1.2, "opacity=\".8\"");
	const jewel = gem(128, 55, id === "artemis" ? "#83bbd4" : id === "poseidon" ? "#369d99" : id === "hades" ? "#b3829b" : id === "medusa" ? "#b4d09b" : id === "anubis" ? "#286d94" : id === "horus" ? "#255a93" : id === "athena" ? "#5a7563" : id === "zeus" ? "#779cbe" : "#cf8d48", 4.6);
	let ornament = "";
	if (id === "anubis") ornament = [-1, 1].map((sign) => `<g transform="translate(${128 + sign * 75} 63) rotate(${sign * 10}) scale(.2)">${jackalEar(u)}</g>`).join("");
	if (id === "horus") ornament = [
		-2,
		-1,
		0,
		1,
		2
	].map((n) => `<g transform="translate(${128 + n * 13} ${54 + Math.abs(n) * 2}) rotate(${n * 13}) scale(.25)">${feather(u)}</g>`).join("");
	if (id === "athena") ornament = path("M16 87C19 49 68 23 120 24C177 22 231 49 240 87L237 93C223 60 179 59 128 59C77 59 33 60 19 93Z", metal) + path("M64 40Q96 9 155 17Q181 19 194 30Q129 19 76 46Z", "#854b44") + line("M74 36Q112 13 171 24", "#cf9a7f", 2) + line("M26 77Q50 39 99 32", "#f9dfac", 2, "opacity=\".75\"");
	if (id === "poseidon") ornament = [-1, 1].map((sign) => `<g transform="translate(${128 + sign * 66} 58) scale(${sign * .22} .22)">${coralBranch(u)}</g>`).join("");
	if (id === "artemis") ornament = `<g transform="translate(136 43) scale(.23)">${moon(u)}</g>`;
	if (id === "apollo") ornament = `<g transform="translate(128 55) scale(.21)">${Array.from({ length: 9 }, (_, i) => `<g transform="rotate(${-76 + i * 19})">${path("M-12-119L0-189L12-119Z", gold(u))}</g>`).join("")}${path("M-120 9A120 120 0 0 1 120 9L91 9A91 91 0 0 0-91 9Z", gold(u))}</g>`;
	if (id === "zeus") ornament = [-1, 1].map((sign) => [
		0,
		1,
		2,
		3
	].map((i) => {
		const dx = sign * (28 + i * 15);
		return `<g transform="translate(${128 + dx} ${54 + .002 * dx * dx}) rotate(${sign * (28 + i * 7)}) scale(.22)">${path("M0 9C-30-14-34-58 0-92C34-58 30-14 0 9Z", gold(u))}${line("M0-8V-69", "#fff0c1", 4)}</g>`;
	}).join("")).join("");
	if (id === "medusa") ornament = [
		[
			40,
			72,
			.17
		],
		[
			84,
			58,
			.19
		],
		[
			128,
			55,
			.2
		],
		[
			172,
			58,
			.19
		],
		[
			216,
			72,
			.17
		]
	].map(([x, y, size], i) => `<g transform="translate(${x} ${y}) rotate(${MEDUSA_CURLS[i].angle}) scale(${MEDUSA_CURLS[i].flip * size} ${size})">${littleSnake(i)}</g>`).join("");
	if (id === "hades") ornament = [
		-2,
		-1,
		0,
		1,
		2
	].map((n) => `<g transform="translate(${128 + n * 34} ${54 + .0018 * (n * 34) ** 2}) scale(.26)">${crownPoint(u, n)}</g>`).join("");
	const pearls = id === "poseidon" ? [
		-40,
		-25,
		25,
		40
	].map((dx) => `<circle cx="${128 + dx}" cy="${55 + .0018 * dx * dx}" r="1.8" fill="#fff1d3"/>`).join("") : "";
	return `<g data-icon-head transform="translate(0 -3)">${ornament}${band}${pearls}${jewel}</g>`;
}
function mythIcon(f, u, label = f.name, { tintedEyes = true, splash = false, layer = "complete" } = {}) {
	const offset = splash ? 146 : 0, height = splash ? 554 : 256;
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 ${height}" role="img" aria-label="${label}" data-icon="${f.id}"><defs>${defs(u)}
 <linearGradient id="${u}-coat" x1="0" y1="0" x2=".18" y2="1">${f.colors.map((c, i) => `<stop offset="${i / 2}" stop-color="${c}"/>`).join("")}</linearGradient>
 <image id="${u}-face" href="${classic_face_rest_default}" width="256" height="256"/>
 ${eyeTint(u, EYE_COLORS[f.id])}

 </defs>${layer === "foreground" ? "" : `<rect width="256" height="${height}" fill="url(#${u}-coat)"/><rect width="256" height="${height}" fill="url(#${u}-sheen)"/>`}
 ${layer === "background" ? "" : `<g data-icon-art transform="translate(0 ${offset})">${f.id === "hades" ? `<g transform="translate(0 45) scale(.204)" opacity=".45">${cerberusShadow(u)}</g>` : ""}<use href="#${u}-face"/>
 ${[[
		67.5,
		119.5,
		classic_left_eye_default
	], [
		188.5,
		119.5,
		classic_right_eye_default
	]].map(([x, y, href]) => `<g data-icon-eye data-pivot="${x},${y}"><image href="${href}" width="256" height="256" ${tintedEyes ? `filter="url(#${u}-eye-tint)"` : ""}/></g>`).join("")}

 ${iconHeadpiece(f.id, u)}
 ${iconDetails(f, u)}</g>`}</svg>`;
}
function iconDetails(f, u) {
	if (f.id === "hades") return "";
	if (f.id === "medusa") return `<g data-icon-prop transform="translate(128 217)">${medusaScales(.3)}</g>`;
	if (f.id === "zeus") return `${path("M25 188Q55 198 68 202Q105 232 181 241L166 256Q68 242 25 188Z", silver(u))}${gem(52, 208, "#c29b56", 9)}<g data-icon-prop transform="translate(218 214) rotate(12) scale(.16)">${thunderbolt(u)}</g>`;
	if (f.id === "anubis" || f.id === "horus") return `${path("M26 187Q128 231 230 187L232 208Q128 253 24 208Z", gold(u))}${path("M30 199Q128 240 226 199L226 207Q128 248 30 207Z", f.id === "horus" ? "#396dab" : "#315f83")}${f.id === "anubis" ? `<g data-icon-prop transform="translate(128 224) scale(.18)">${ankh(u)}</g>` : `${path("M17 129L21 163L35 175L38 165L27 152Z", gold(u))}${path("M239 129L235 163L221 175L218 165L229 152Z", gold(u))}`}`;
	if (f.id === "athena") return `<g data-icon-prop transform="translate(56 221) scale(.28)">${owl(u)}</g>${line("M164 234Q199 230 221 211", gold(u), 3)}${[
		0,
		1,
		2
	].map((i) => `<ellipse cx="${183 + i * 13}" cy="${228 - i * 8}" rx="4" ry="9" fill="${gold(u)}" transform="rotate(35 ${183 + i * 13} ${228 - i * 8})"/>`).join("")}`;
	if (f.id === "hermes") return `${line("M28 201L221 245", "#e4b481", 8)}<g data-icon-prop transform="translate(194 226) rotate(-9)">${path("M-24-19Q0-27 25-19V20Q0 28-24 20Z", "#a36a42")}${path("M-24-19Q0-27 25-19V-3Q0 12-24-3Z", "#e0b07c")}${path("M-5-7H6V3H-5Z", gold(u))}</g>`;
	if (f.id === "poseidon") return `<g data-icon-prop transform="translate(216 213) rotate(12) scale(.16)">${trident(u)}</g><circle cx="36" cy="225" r="7" fill="none" stroke="#c5ebd9" stroke-width="2"/><circle cx="53" cy="240" r="4" fill="#c5ebd9" opacity=".6"/><circle cx="25" cy="58" r="6" fill="none" stroke="#c8eee2" stroke-width="2"/>`;
	if (f.id === "artemis") return `<g data-icon-prop transform="translate(214 210) rotate(12) scale(.17)">${bow(u)}</g>${sparkle(36, 216, .5, "#deebeb")}${sparkle(60, 237, .25, "#deebeb")}`;
	return `<g data-icon-prop transform="translate(210 223) scale(.18)">${lyre(u)}</g>${sparkle(35, 219, .5, "#ffeac0")}`;
}
//#endregion
export { POWER_MS, idleAt, makeMyth, mythIcon, neutralPose, sceneArt };
