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
//#region src/series/jade-details.js
var NS = "http://www.w3.org/2000/svg";
function jadeHorns(uid) {
	return `<defs><linearGradient id="${uid}-horn" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="#f1f2cb"/><stop offset=".55" stop-color="#c6dbad"/><stop offset="1" stop-color="#74a78a"/></linearGradient></defs>
    <path d="M-24 17C-25-6-31-22-45-39C-53-49-61-60-55-67C-49-74-39-67-32-59L-22-47C-25-68-23-90-12-92C1-95 2-81 1-69C-2-41 9-27 22-8L26 17Z" fill="url(#${uid}-horn)"/>
    <path d="M-13-76Q-18-48-5-23" fill="none" stroke="#f8f8df" stroke-width="5" stroke-linecap="round" opacity=".65"/>`;
}
function applyJade(svg, uid) {
	svg.querySelector(`#${uid}-coat-gradient`).innerHTML = "<stop stop-color=\"#165c4a\"/><stop offset=\".5\" stop-color=\"#418d70\"/><stop offset=\"1\" stop-color=\"#99c4a4\"/>";
	const markings = svg.querySelector(`[id="${uid}-art"] > g`).querySelector("g");
	markings.innerHTML = `<defs>
    <radialGradient id="${uid}-cloud"><stop stop-color="#e1f2cf" stop-opacity=".57"/><stop offset="1" stop-color="#c6e6c3" stop-opacity="0"/></radialGradient>
    <filter id="${uid}-soft"><feGaussianBlur stdDeviation="13"/></filter>
  </defs>
  <ellipse cx="405" cy="354" rx="300" ry="180" fill="url(#${uid}-cloud)" transform="rotate(-24 405 354)"/>
  <ellipse cx="770" cy="994" rx="350" ry="150" fill="url(#${uid}-cloud)" transform="rotate(-22 770 994)"/>
  <g fill="none" stroke="#dcf0cd" filter="url(#${uid}-soft)" opacity=".3">
    <path d="M250 400C465 255 530 412 720 280M260 1040C470 925 681 1140 946 820" stroke-width="42"/>
  </g>
  <g fill="none" stroke="#e3f4d3" stroke-linecap="round">
    <path d="M340 399C433 318 488 355 550 358M685 1021C778 1015 864 961 900 907" stroke-width="3" opacity=".36"/>
    <path d="M350 448Q380 392 423 371" stroke-width="13" opacity=".53"/>
    <path d="M339 471l-4 10" stroke-width="8" opacity=".42"/>
    <path d="M735 985q14 19 30-3M776 964q14 19 29-4M807 940q13 17 27-5" stroke-width="4" opacity=".23"/>
  </g>`;
	const motion = svg.querySelector("[data-part=\"motion\"]");
	motion.querySelector("[data-series-accessories=\"jade\"]")?.remove();
	const horns = document.createElementNS(NS, "g");
	horns.dataset.jadeHorns = "";
	horns.innerHTML = `<g transform="translate(414 369) rotate(-27) scale(1.22)">${jadeHorns(uid + "-left")}</g>
    <g transform="translate(833 315) rotate(32) scale(1.22)">${jadeHorns(uid + "-right")}</g>`;
	const tailPath = (bend) => `M344 905
    C359 931 356 950 332 966
    C296 990 238 998 210 979
    C189 965 180 ${945 + bend} 195 ${938 + bend}
    C208 ${931 + bend} 220 ${947 + bend} 211 ${960 + bend}
    C241 ${946 + bend} 228 ${913 + bend} 202 ${913 + bend}
    C160 ${910 + bend} 139 ${946 + bend} 153 987
    C171 1043 254 1065 360 1083
    C466 1101 582 1115 688 1084
    C794 1053 897 981 938 905Z`;
	const clip = document.createElementNS(NS, "clipPath");
	clip.id = `${uid}-upper-outline`;
	clip.innerHTML = "<rect width=\"1254\" height=\"907\"/>";
	svg.querySelector("defs").append(clip);
	svg.querySelector(`[id="${uid}-coat-silhouette"] use`).setAttribute("clip-path", `url(#${clip.id})`);
	const paths = [];
	for (const suffix of [
		"coat-silhouette",
		"plumage-mask",
		"body-mask"
	]) {
		const path = document.createElementNS(NS, "path");
		path.setAttribute("fill", "white");
		path.setAttribute("d", tailPath(0));
		path.dataset.jadeTail = suffix;
		svg.querySelector(`[id="${uid}-${suffix}"]`).append(path);
		paths.push(path);
	}
	markings.insertAdjacentHTML("beforeend", `<ellipse cx="255" cy="1020" rx="150" ry="82" fill="url(#${uid}-cloud)" opacity=".45"/>
    <path d="M180 1001Q209 1031 253 1038M264 1040l13 2" fill="none" stroke="#e4efcc" stroke-width="6" stroke-linecap="round" opacity=".58"/>
    <g fill="none" stroke="#d9e8ba" stroke-width="5" stroke-linecap="round" opacity=".75"><path d="M269 996q10 13 22 2M300 1004q11 14 24 1M333 1011q11 14 24 1"/></g>`);
	motion.prepend(horns);
	return (time, active) => {
		const bend = active ? Math.sin(time / 1100) * 9 : 0;
		for (const path of paths) path.setAttribute("d", tailPath(bend));
	};
}
//#endregion
//#region \0nivo-body
var _nivo_body_default = new URL("./nivo-body.png", "" + import.meta.url).href;
//#endregion
//#region src/series/detective-details.js
function detectiveCap(uid) {
	const crown = "M293 480C277 351 368 228 527 185C687 139 843 207 905 329Q927 377 931 440Q575 260 293 480Z";
	return `<g data-accessory="detective-cap">
  <defs>
   <linearGradient id="${uid}-tweed" x1="0" y1="0" x2=".3" y2="1"><stop stop-color="#d9b98a"/><stop offset="1" stop-color="#a57a50"/></linearGradient>
   <pattern id="${uid}-check" width="58" height="58" patternUnits="userSpaceOnUse" patternTransform="rotate(-15)">
    <path d="M0 0H58V58" fill="none" stroke="#694d38" stroke-opacity=".24" stroke-width="13"/>
    <path d="M20 0V58M0 20H58" stroke="#ffdda7" stroke-opacity=".32" stroke-width="3"/>
   </pattern>
  </defs>
  <path d="${crown}" fill="url(#${uid}-tweed)" stroke="#77553e" stroke-width="7" stroke-linejoin="round"/>
  <path d="${crown}" fill="url(#${uid}-check)"/>
  <path d="M575 183Q655 240 657 355" fill="none" stroke="#77553e" stroke-opacity=".6" stroke-width="6"/>
  <path d="M293 480Q575 260 931 440L947 460Q598 303 314 514Q278 535 248 515Q228 500 250 493Z" fill="#8a6044" stroke="#684c38" stroke-width="7" stroke-linejoin="round"/>
  <path d="M297 479Q575 267 930 443" fill="none" stroke="#e5c28b" stroke-width="8" stroke-linecap="round"/>
  <path d="M379 314Q389 234 530 205L586 214Q546 280 379 314Z" fill="#c6a075" stroke="#8b6548" stroke-width="5"/>
  <path d="M586 214Q678 168 798 239Q764 299 586 214Z" fill="#c6a075" stroke="#8b6548" stroke-width="5"/>
  <path d="M411 288Q473 266 548 226M630 216Q701 217 757 244" fill="none" stroke="#ecd1a1" stroke-opacity=".65" stroke-width="5" stroke-linecap="round"/>
  <g transform="translate(584 211) rotate(-12)" fill="#72513d" stroke="#634633" stroke-width="4" stroke-linejoin="round">
   <path d="M-5 0Q-70-51-68-9Q-71 28-5 5M5 0Q68-51 68-9Q71 28 5 5"/>
   <ellipse rx="15" ry="12" fill="#9a714d"/>
  </g>
 </g>`;
}
//#endregion
//#region src/series/porcelain-details.js
function blossom(uid, x, y, scale, angle, petalGradient) {
	const highlight = "#ffe4ef";
	return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})">
  ${[
		0,
		72,
		144,
		216,
		288
	].map((rotation, index) => `
  <g transform="rotate(${rotation}) scale(${index % 2 ? ".96 1.03" : "1 1"})">
   <path d="M-9-10C-29-23-42-44-32-60C-25-73-9-75 0-67C12-79 31-69 33-55C37-34 20-19 9-10Z" fill="url(#${uid}-${petalGradient})"/>
   <path d="M-20-54Q-18-38-8-27" fill="none" stroke="${highlight}" stroke-opacity=".55" stroke-width="4" stroke-linecap="round"/>
  </g>`).join("")}${[
		0,
		72,
		144,
		216,
		288
	].map((rotation) => `
  <g transform="rotate(${rotation})">
   <path d="M0-5V-18" stroke="#e6f0ff" stroke-width="2.5" stroke-linecap="round"/>
   <circle cy="-20" r="3.7" fill="#e6f0ff"/>
  </g>`).join("")}<circle r="6" fill="#f1f6ff"/>
 </g>`;
}
function porcelainDetails(uid) {
	return `<g data-art="porcelain">
  <defs>
    <radialGradient id="${uid}-sheen" gradientUnits="userSpaceOnUse" cx="442" cy="443" r="455">
      <stop stop-color="#d7ebff" stop-opacity=".58"/>
      <stop offset=".53" stop-color="#b4d3f2" stop-opacity=".22"/>
      <stop offset="1" stop-color="#b4d3f2" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${uid}-ink" gradientUnits="userSpaceOnUse" x1="585" y1="1000" x2="850" y2="812">
      <stop stop-color="#244a87"/>
      <stop offset="1" stop-color="#3d70ad"/>
    </linearGradient>
    <g id="${uid}-flower">
      ${[
		0,
		72,
		144,
		216,
		288
	].map((angle) => `
        <path transform="rotate(${angle})" fill="#2c5c9c"
          d="M0-8C-15-14-28-35-20-48C-16-56-5-56 0-50C7-58 20-54 22-44C26-31 12-14 0-8Z"/>
        <path transform="rotate(${angle})" d="M0-18Q-3-28-10-36" fill="none" stroke="#92b7dd"
          stroke-opacity=".73" stroke-width="3.6" stroke-linecap="round"/>
      `).join("")}
      <circle r="7" fill="#d9e9f5"/>
    </g>
  </defs>
  <rect width="1254" height="1254" fill="url(#${uid}-sheen)"/>
  <g fill="none" stroke="#f1f7fc" stroke-linecap="round">
    <path d="M366 437Q405 372 462 352" stroke-width="13" opacity=".66"/>
    <path d="M349 466l6-13" stroke-width="9" opacity=".52"/>
    <path d="M400 975q22 36 59 49" stroke-width="10" opacity=".65"/>
  </g>
  <g data-porcelain-branch>
    <g fill="url(#${uid}-ink)">
      <path d="M560 1009Q687 996 789 911Q829 876 850 819Q827 886 789 923Q685 1011 560 1009Z"/>
      <path d="M656 987Q623 990 611 952Q646 954 663 981Z"/>
      <path d="M755 946Q790 920 819 950Q789 964 755 946Z"/>
      <path d="M810 892Q797 874 805 847Q823 863 818 883Z"/>
      <path d="M827 869Q848 841 879 858Q858 879 827 869Z"/>
      <path d="M709 970Q710 939 695 912L700 912Q717 939 715 970Z"/>
    </g>
    <use href="#${uid}-flower" transform="translate(707 912) rotate(-11) scale(1.21)"/>
    <use href="#${uid}-flower" transform="translate(849 811) rotate(16) scale(.66)"/>
  </g> </g>`;
}
function porcelainHairpin(uid) {
	return `<g data-accessory="porcelain-hairpin" transform="translate(-245 -15)">

  <defs>
   <linearGradient id="${uid}-lotus-petal" gradientUnits="userSpaceOnUse" x1="-22" y1="-72" x2="15" y2="-8">
    <stop stop-color="#f9b6d1"/><stop offset=".5" stop-color="#e981b0"/><stop offset="1" stop-color="#c7528e"/>
   </linearGradient>
   <linearGradient id="${uid}-pendant-gem" x1="0" y1="0" x2="1" y2=".65">
    <stop stop-color="#f2fbff"/><stop offset=".48" stop-color="#d1eaff"/><stop offset="1" stop-color="#9dbbde"/>
   </linearGradient>
  </defs>
  <g transform="translate(790 315) rotate(-25)">
   <path d="M112-7C78-30 83-59 108-55Q127-51 118-37M124 12Q155 39 167 17Q175 2 162-4" fill="none" stroke="#9eb4cc" stroke-width="6" stroke-linecap="round"/>
   <path d="M112-10C86-29 89-53 108-52" fill="none" stroke="#f6fbff" stroke-width="2.5" stroke-linecap="round"/>
   ${blossom(uid, 129, 0, .62, 8, "lotus-petal")}
   <circle cx="129" r="9" fill="#fff0c6" stroke="#d7b988" stroke-width="2"/>
  </g>
  <g data-effect="hairpin-drop" data-x="930" data-y="285">
   <circle cx="930" cy="285" r="7" fill="#edf5ff" stroke="#8ba6c2" stroke-width="3"/>
   <path d="M930 292Q935 333 948 366" fill="none" stroke="#92aac5" stroke-width="4" stroke-linecap="round"/>
   <circle cx="935" cy="319" r="7" fill="#eff9ff" stroke="#a8bed4" stroke-width="2"/>
   <circle cx="943" cy="348" r="6" fill="#b8d2ec"/>
   <path d="M950 367C937 384 936 401 950 405C966 402 963 383 950 367Z" fill="url(#${uid}-pendant-gem)" stroke="#7d9fc2" stroke-width="3"/>
   <path d="M950 370 945 389 950 403 956 389Z" fill="#f4fbff" fill-opacity=".48"/>
   <g data-effect="twinkle" data-x="949" data-y="384" data-phase="1.1" data-accessory="pendant-glint">
    <path d="M949 376 951 382 957 384 951 386 949 392 947 386 941 384 947 382Z" fill="#fff"/>
   </g>
   <path d="M947 383Q943 392 947 395" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
  </g>
 </g>`;
}
function porcelainHairpinBack(uid) {
	return `<g data-accessory="porcelain-hairpin-shaft" transform="translate(-245 -15)">
  <defs>
   <linearGradient id="${uid}-pin-silver" x1="0" y1="0" x2=".2" y2="1">
    <stop stop-color="#fbffff"/><stop offset=".45" stop-color="#cfdeeb"/><stop offset="1" stop-color="#8aa4bd"/>
   </linearGradient>
  </defs>
  <g transform="translate(790 315) rotate(-25)">
   <path d="M-320 0Q-65-9 138-5Q146 0 138 5Q-65 10-320 0Z" fill="url(#${uid}-pin-silver)" stroke="#7894b2" stroke-width="3"/>
   <path d="M-280-1 106-2" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
  </g>
 </g>`;
}
//#endregion
//#region src/series/pearl-details.js
function pearlStone(uid) {
	return `<radialGradient id="${uid}-pearl-stone" cx=".32" cy=".25" r=".75">
  <stop stop-color="#fffefa"/><stop offset=".35" stop-color="#fff2e7"/>
  <stop offset=".65" stop-color="#eadceb"/><stop offset=".86" stop-color="#b9c4e4"/><stop offset="1" stop-color="#8c9bc1"/>
 </radialGradient>`;
}
function pearlSurface(uid) {
	return `<g data-art="pearl">
  <defs>
   <radialGradient id="${uid}-pearl-blush"><stop stop-color="#f6bddd" stop-opacity=".6"/><stop offset="1" stop-color="#f6bddd" stop-opacity="0"/></radialGradient>
   <radialGradient id="${uid}-pearl-blue"><stop stop-color="#b9edf1" stop-opacity=".8"/><stop offset="1" stop-color="#b9edf1" stop-opacity="0"/></radialGradient>
   <radialGradient id="${uid}-pearl-light"><stop stop-color="#fffdf4" stop-opacity=".9"/><stop offset="1" stop-color="#fffdf4" stop-opacity="0"/></radialGradient>
  </defs>
  <ellipse cx="370" cy="850" rx="360" ry="400" fill="url(#${uid}-pearl-blush)"/>
  <ellipse cx="880" cy="590" rx="310" ry="510" fill="url(#${uid}-pearl-blue)"/>
  <ellipse cx="530" cy="300" rx="330" ry="280" fill="url(#${uid}-pearl-light)"/>
  <path d="M364 444Q411 354 498 309" fill="none" stroke="#fffdf7" stroke-opacity=".85" stroke-width="15" stroke-linecap="round"/>
  <path d="M336 927C408 1066 675 1131 856 972C705 1084 442 1058 336 927Z" fill="#fff2fb" opacity=".38"/>
  <path d="M365 953Q405 1002 462 1020" fill="none" stroke="#fffaf4" stroke-width="8" stroke-linecap="round" opacity=".75"/>
 </g>`;
}
function pearlAccessories(uid) {
	return `<g data-accessory="pearl-lustre">
  <defs>${pearlStone(uid)}</defs>
  <g data-effect="twinkle" data-x="839" data-y="925" data-phase="2.4"><path d="M839 909 843 921 855 925 843 929 839 941 835 929 823 925 835 921Z" fill="#fff9f2"/></g>
 </g>`;
}
function shellDefinitions(uid) {
	return `<defs>
  <linearGradient id="${uid}-shell-lid" x1="0" y1="0" x2=".4" y2="1"><stop stop-color="#fbe1eb"/><stop offset=".55" stop-color="#f8edf0"/><stop offset="1" stop-color="#d5bfdc"/></linearGradient>
  <linearGradient id="${uid}-shell-base" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f2d7e7"/><stop offset="1" stop-color="#bda6d0"/></linearGradient>
 </defs>`;
}
function shellArt(uid) {
	return `<path d="M-70-7C-103-30-103-59-78-65C-88-88-60-105-44-93C-47-119-17-126 0-108C17-126 47-119 44-93C60-105 88-88 78-65C103-59 103-30 70-7Q0 24-70-7Z" fill="url(#${uid}-shell-lid)" stroke="#aa8fb5" stroke-width="4" stroke-linejoin="round"/>
  <g fill="none" stroke="#fff8f4" stroke-width="5" stroke-linecap="round">
   <path d="M-73-51Q-44-25-18-9M-42-84Q-29-40-10-13M0-99V-17M42-84Q29-40 10-13M73-51Q44-25 18-9"/>
  </g>
  <path d="M-88 3Q-66 43 0 46Q66 43 88 3Z" fill="url(#${uid}-shell-base)" stroke="#aa8fb5" stroke-width="4"/>
  <ellipse cy="3" rx="88" ry="27" fill="#fff4ef" stroke="#b59bc2" stroke-width="4"/>
  <ellipse cy="5" rx="65" ry="17" fill="#e7d6e8"/>
  <ellipse cy="12" rx="31" ry="9" fill="#bda6c9" opacity=".55"/>
  <circle cy="-13" r="29" fill="url(#${uid}-pearl-stone)" stroke="#aaa2bd" stroke-width="2.5"/>
  <ellipse cx="-9" cy="-24" rx="10" ry="6" fill="#fffefa" opacity=".95"/>
  <path d="M-84 8Q0 51 84 8" fill="none" stroke="#fff3f1" stroke-width="7" stroke-linecap="round"/>
  <path d="M-44 33Q0 53 44 33" fill="none" stroke="#d1badc" stroke-width="3" stroke-linecap="round"/>`;
}
function pearlSeashell(uid) {
	return `<g data-accessory="pearl-seashell" transform="translate(1060 815) rotate(12)">
  ${shellDefinitions(uid)}${shellArt(uid)}
  <g data-effect="twinkle" data-x="-11" data-y="-27" data-phase=".7"><path d="M-11-37-8-30-1-27-8-24-11-17-14-24-21-27-14-30Z" fill="#fffef7"/></g>
 </g>`;
}
//#endregion
//#region src/series/extra-skin-details.js
var effect$1 = (kind, artwork, x, y, phase = 0) => `<g data-effect="${kind}" data-x="${x}" data-y="${y}" data-phase="${phase}">${artwork}</g>`;
var EXTRA_SIGNATURES = {
	grumpy: ["A little anger mark and a puff of steam", "小小生气符号与一团气鼓鼓的蒸汽"],
	snowy: ["Carrot nose, red scarf and coal buttons", "胡萝卜鼻子、红围巾和煤炭纽扣"],
	gold: ["Pearlescent sheen · 50-day streak", "珍珠光泽 · 连续坚持 50 天"],
	glitch: ["A pixel antenna and drifting fragments", "像素天线与漂移碎片"],
	repair: ["A larger bandage and little mending stitches", "更清晰的创可贴与小修补针脚"]
};
function extraSkinDetails(id, uid = "pearl-preview") {
	switch (id) {
		case "grumpy": return `<g data-accessory="grumpy-brows" fill="none" stroke="#4d1024" stroke-width="18" stroke-linecap="round">
        <path d="M397 480Q452 480 514 500M749 414Q803 386 862 385"/>
      </g>
      ${effect$1("anger-mark", `<path d="M807 294Q833 297 832 323M851 294Q831 297 833 276M852 345Q831 343 833 323M807 344Q812 324 792 324" fill="none" stroke="#f0a0a8" stroke-width="13" stroke-linecap="round"/>`, 833, 320)}
      ${effect$1("huff", `<path d="M1012 552Q1030 541 1040 548C1033 521 1059 508 1074 526C1099 511 1121 536 1108 555C1125 580 1097 598 1078 583Q1061 601 1044 581Q1021 582 1028 567Z" fill="#edc6cc"/><path d="M1014 589l23-7" stroke="#d895a3" stroke-width="8" stroke-linecap="round"/>`, 1060, 555)}`;
		case "gold": return pearlAccessories(uid);
		case "glitch": return `<g data-accessory="pixel-antenna">
        <path d="M592 243V203H638V156" fill="none" stroke="#b6389c" stroke-width="10" stroke-linejoin="miter"/>
        <path d="M586 239V197H632V150" fill="none" stroke="#80e8ed" stroke-width="8" stroke-linejoin="miter"/>
        <rect x="621" y="127" width="30" height="30" fill="#dc58b3"/>
        <rect x="615" y="121" width="30" height="30" fill="#80e8ed"/>
        <rect x="621" y="127" width="11" height="11" fill="#d4fcff"/>
      </g><g data-accessory="digital-fragments">
        ${effect$1("digital-fragment", "<path d=\"M265 404h27v27h-27zM292 431h27v27h-27zM241 439h15v15h-15zM312 404h12v12h-12z\" fill=\"#6fe6eb\"/><path d=\"M274 413h15v15h-15zM307 446h27v13h-27z\" fill=\"#ec6cba\"/>", 285, 433)}
        ${effect$1("digital-fragment", "<path d=\"M997 691h28v28h-28zM1025 719h28v28h-28zM982 737h14v14h-14zM1066 714h12v12h-12z\" fill=\"#ec6cba\"/><path d=\"M1007 701h15v15h-15zM1039 737h26v12h-26z\" fill=\"#6fe6eb\"/>", 1032, 723, 2)}
        ${effect$1("digital-fragment", "<path d=\"M903 318h40v13h-40zM951 318h12v13h-12zM916 341h25v10h-25z\" fill=\"#6fe6eb\"/>", 935, 331, 4)}
      </g>`;
		case "repair": return `<g fill="#f2a6b2"><ellipse cx="410" cy="715" rx="29" ry="12" transform="rotate(-17 410 715)"/><ellipse cx="880" cy="624" rx="28" ry="12" transform="rotate(-17 880 624)"/></g><g data-accessory="bandage" transform="translate(760 355) rotate(-12)">
        <rect x="-68" y="-27" width="136" height="54" rx="22" fill="#d7a680" stroke="#b28565" stroke-width="4"/>
        <rect x="-22" y="-24" width="44" height="48" rx="8" fill="#f3cfae"/>
        <path d="M-48-8v16M48-8v16M-7-12v24M7-12v24" stroke="#b88c6c" stroke-width="4"/>
      </g>
      <g data-accessory="mending-stitches" fill="none" stroke-linecap="round">
        <path d="M758 846Q808 897 790 965" stroke="#5b94a8" stroke-width="6"/>
        <path d="M749 866l30-17M766 895l33-10M774 927l34-1M772 957l32 8" stroke="#f3d6b4" stroke-width="10"/>
        <path d="M749 866l30-17M766 895l33-10M774 927l34-1M772 957l32 8" stroke="#fff1d9" stroke-width="3"/>
      </g>`;
		default: return null;
	}
}
//#endregion
//#region src/series/focused-details.js
var notebook = `<g data-accessory="focus-notebook"><g><g data-back-cover>
 <rect x="-120" y="-132" width="246" height="276" rx="22" fill="#5489b4"/>
 <rect x="-123" y="-137" width="240" height="272" rx="21" fill="#97c6e4"/>
 <path d="M-108-114V109Q-108 119-98 119H93" fill="none" stroke="#b7dbef" stroke-width="4" stroke-linecap="round"/>
 <path d="M-102-136V132" stroke="#80b3d5" stroke-width="5"/>
 <path d="M-74-145V-124M-29-145V-124M16-145V-124M61-145V-124" fill="none" stroke="#d2e3ee" stroke-width="7" stroke-linecap="round"/>
 </g></g></g>`;
var pencil = `<g data-accessory="focus-pencil"><g transform="translate(268 789) rotate(-23)">
 <path d="M-18 61V-104L0-157 18-104V61Z" fill="#f8c65e"/>
 <path d="M0-104H18V61H0Z" fill="#dc9c3c"/>
 <path d="M-18-104 0-157 18-104Z" fill="#f4dfb2"/>
 <path d="M-6-139 0-157 6-139Z" fill="#34435b"/>
 <path d="M-10-96V40" stroke="#ffe39a" stroke-width="5" stroke-linecap="round"/>
 <rect x="-18" y="51" width="36" height="15" rx="3" fill="#c4d7df"/>
 <path d="M-18 66H18V84Q18 94 8 94H-8Q-18 94-18 84Z" fill="#edb0a3"/>
 </g></g>`;
var glasses = `<g data-accessory="focus-glasses" fill="none" stroke-linecap="round" stroke-linejoin="round">

 <g transform="translate(644 557) rotate(-17)">
  <path d="M-290-45Q-330-54-360-85M290-45Q307-37 314-22" stroke="#91b8db" stroke-width="17"/>
  <path d="M-36-12Q0-38 36-12" stroke="#99bad5" stroke-width="20"/>
  <rect x="-290" y="-124" width="254" height="246" rx="67" stroke="#8caed0" stroke-width="23"/>
  <rect x="36" y="-124" width="254" height="246" rx="67" stroke="#8caed0" stroke-width="23"/>
  <path d="M-36-15Q0-41 36-15" stroke="#eef5fc" stroke-width="12"/>
  <rect x="-290" y="-127" width="254" height="246" rx="67" stroke="#eef5fc" stroke-width="14"/>
  <rect x="36" y="-127" width="254" height="246" rx="67" stroke="#eef5fc" stroke-width="14"/>
  <path d="M-267-69Q-267-102-235-102M59-69Q59-102 91-102" stroke="white" stroke-width="6"/>
 </g></g>`;
var focusedAccessories = () => notebook + pencil + glasses;
function mountFocusedWriting(svg, uid) {
	const revised = svg;
	const book = revised.querySelector("[data-accessory=\"focus-notebook\"]");
	const bookArt = book.firstElementChild;
	const pen = revised.querySelector("[data-accessory=\"focus-pencil\"]");
	const penArt = pen.firstElementChild;
	bookArt.insertAdjacentHTML("beforeend", ["M-16 11q5-12 10 0t10 0q5-11 9-2l6 2q5-9 9-2l8 1q5-10 10 0", "M-16 67q5-13 10 0t10 0l6-3q5-10 9 0t9 0l10-2"].map((d) => `<path data-writing opacity="0" d="${d}" fill="none" stroke="#567087" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`).join(""));
	const ink = [...bookArt.querySelectorAll("[data-writing]")];
	const lengths = ink.map((p) => p.getTotalLength());
	const handLayers = {};
	for (const [part, d] of Object.entries({
		"left-flipper": "M283 770C263 780 244 790 229 803C204 828 192 853 211 875C231 900 275 902 310 884C330 873 343 853 345 831",
		"right-flipper": "M990 736C1012 751 1032 773 1045 795C1065 828 1075 852 1057 871C1036 892 995 882 964 866C942 854 931 833 932 809"
	})) {
		const flipper = revised.querySelector(`[data-part="${part}"]`);
		flipper.insertAdjacentHTML("beforeend", `<path data-hand-edge d="${d}" fill="none" stroke="#073f9a" stroke-opacity=".72" stroke-width="1.6" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>`);
		const layer = document.createElementNS("http://www.w3.org/2000/svg", "g");
		layer.dataset.handLayer = part;
		layer.setAttribute("mask", `url(#${uid}-plumage-mask)`);
		handLayers[part] = layer;
		book.before(layer);
		layer.append(flipper);
	}
	book.before(handLayers["right-flipper"], handLayers["left-flipper"], pen);
	const gazeEyes = ["left", "right"].map((side) => {
		const eye = revised.querySelector(`[data-part="${side}-eye"]`), art = eye.querySelector("use");
		const window = document.createElementNS("http://www.w3.org/2000/svg", "g");
		window.dataset.gazeWindow = side;
		window.setAttribute("clip-path", art.getAttribute("clip-path"));
		eye.append(window);
		window.append(art);
		art.dataset.gazeArt = side;
		return {
			art,
			dx: side === "left" ? 13 : -9
		};
	});
	const clamp = (v) => Math.max(0, Math.min(1, v));
	const ease = (v) => {
		const x = clamp(v);
		return x * x * (3 - 2 * x);
	};
	const mix = (a, b, p) => a + (b - a) * p;
	function reachFromShoulder(node, root, restGrip, grip) {
		const ux = restGrip[0] - root[0], uy = restGrip[1] - root[1], length = Math.hypot(ux, uy);
		const vx = grip[0] - root[0], vy = grip[1] - root[1], reach = Math.hypot(vx, vy);
		const u = [ux / length, uy / length], v = [vx / reach, vy / reach], scale = reach / length;
		const a = scale * v[0] * u[0] + v[1] * u[1], c = scale * v[0] * u[1] - v[1] * u[0];
		const b = scale * v[1] * u[0] - v[0] * u[1], d = scale * v[1] * u[1] + v[0] * u[0];
		node.setAttribute("transform", `matrix(${a} ${b} ${c} ${d} ${root[0] - a * root[0] - c * root[1]} ${root[1] - b * root[0] - d * root[1]})`);
	}
	const left = revised.querySelector("[data-part=\"left-flipper\"]");
	const right = revised.querySelector("[data-part=\"right-flipper\"]");
	return {
		pose(pose, time = 0, active = false) {
			const special = !!(pose.peek || pose.reacting || pose.happy || pose.sparkle);
			const phase = active && !special ? time % 8e3 : 0;
			const lift = ease(phase / 1e3) * (1 - ease((phase - 4600) / 1e3));
			return {
				...pose,
				rotate: pose.rotate + 3 * lift,
				y: pose.y + 9 * lift
			};
		},
		render(pose, time = 0, active = false) {
			const special = !!(pose.peek || pose.reacting || pose.happy || pose.sparkle);
			const phase = active && !special ? time % 8e3 : 0;
			const lift = ease(phase / 1e3) * (1 - ease((phase - 4600) / 1e3));
			const gaze = ease((phase - 400) / 700) * (1 - ease((phase - 4200) / 850));
			for (const { art, dx } of gazeEyes) art.setAttribute("transform", `translate(${dx * gaze} ${32 * gaze})`);
			book.setAttribute("opacity", pose.peek ? "0" : "1");
			pen.setAttribute("opacity", pose.peek ? "0" : "1");
			if (special) {
				bookArt.setAttribute("transform", "translate(829 882) rotate(9) scale(.98 .92)");
				penArt.setAttribute("transform", "translate(268 789) rotate(-23)");
				book.setAttribute("transform", right.getAttribute("transform") || "");
				pen.setAttribute("transform", left.getAttribute("transform") || "");
				for (const path of ink) path.setAttribute("stroke-dashoffset", "1");
				return;
			}
			const bx = mix(829, 710, lift), by = mix(882, 885, lift), br = mix(9, -9, lift), rad = br * Math.PI / 180;
			const pageX = .98, pageY = .92;
			const onPage = (x, y) => ({
				x: bx + x * pageX * Math.cos(rad) - y * pageY * Math.sin(rad),
				y: by + x * pageX * Math.sin(rad) + y * pageY * Math.cos(rad)
			});
			book.setAttribute("transform", "");
			bookArt.setAttribute("transform", `translate(${bx} ${by}) rotate(${br}) scale(${pageX} ${pageY})`);
			const hold = onPage(112, -18), holdX = hold.x, holdY = hold.y;
			reachFromShoulder(right, [969, 716], [1035, 850], [mix(1035, holdX, lift), mix(850, holdY, lift)]);
			const a = clamp((phase - 1200) / 1200), b = clamp((phase - 2800) / 1200);
			ink[0].setAttribute("stroke-dashoffset", String(1 - a));
			ink[1].setAttribute("stroke-dashoffset", String(1 - b));
			const row = phase < 2600 ? 0 : 1, progress = row === 0 ? a : b;
			const point = ink[row].getPointAtLength(lengths[row] * progress);
			let py = point.y;
			if (phase >= 2400 && phase < 2800) {
				const k = ease((phase - 2400) / 400);
				const end = ink[0].getPointAtLength(lengths[0]);
				const start = ink[1].getPointAtLength(0);
				point.x = mix(end.x, start.x, k);
				py = mix(end.y, start.y, k) - 24 * Math.sin(k * Math.PI);
			}
			const tip = onPage(point.x, py), tipX = tip.x, tipY = tip.y;
			const angle = mix(-23, 125, lift), pr = angle * Math.PI / 180, penScale = 1;
			const px = mix(268, tipX - 157 * penScale * Math.sin(pr), lift), penY = mix(789, tipY + 157 * penScale * Math.cos(pr), lift);
			pen.setAttribute("transform", "");
			penArt.setAttribute("transform", `translate(${px} ${penY}) rotate(${angle}) scale(${penScale})`);
			const gripX = px - 40 * penScale * Math.sin(pr), gripY = penY + 40 * penScale * Math.cos(pr);
			reachFromShoulder(left, [310, 755], [268, 850], [gripX - 15.63 * (1 - lift), gripY + 24.18 * (1 - lift)]);
		}
	};
}
//#endregion
//#region src/series/turbo-details.js
var fx$3 = (kind, art, x, y) => `<g data-effect="${kind}" data-x="${x}" data-y="${y}">${art}</g>`;
function turboFlash(uid, icon = false) {
	const glow = `${uid}-turbo-glow`, bolt = `${uid}-turbo-bolt`;
	const halo = `<ellipse rx="48" ry="43" fill="url(#${glow})"/>`;
	return `<g data-accessory="turbo-flash" transform="${icon ? "translate(50 86) scale(.33)" : "translate(624 945) scale(2.2)"}">
  <defs>
   <radialGradient id="${glow}">
    <stop stop-color="#fff4ad" stop-opacity=".92"/>
    <stop offset=".42" stop-color="#ffc15c" stop-opacity=".57"/>
    <stop offset=".74" stop-color="#ff7599" stop-opacity=".28"/>
    <stop offset="1" stop-color="#ff7599" stop-opacity="0"/>
   </radialGradient>
   <linearGradient id="${bolt}" x1="0" y1="0" x2="0" y2="1">
    <stop stop-color="#fffdf1"/><stop offset=".58" stop-color="#fff3a5"/><stop offset="1" stop-color="#ffc454"/>
   </linearGradient>
  </defs>
  ${icon ? halo : fx$3("turbo-breath", halo, 0, 0)}
  <g ${icon ? "" : "data-effect=\"turbo-core\""}>
  <path d="M15-33-22 5-3 3-14 34 25-10 5-7Z" fill="url(#${bolt})" stroke="#fff4b8" stroke-width="1.5" stroke-linejoin="round"/>
  </g>
 </g>`;
}
function electricArc(uid, path, transform) {
	return `<g data-accessory="electric-arc" transform="${transform}" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path d="${path}" stroke="#ffc64c" stroke-width="17" opacity=".55" filter="url(#${uid}-electric-glow)"/>
  <path d="${path}" stroke="#ffd56a" stroke-width="6.5"/>
  <path d="${path}" stroke="#fff9d5" stroke-width="2.3"/>
 </g>`;
}
function arcGlow(uid) {
	return `<defs><filter id="${uid}-electric-glow" x="-100%" y="-50%" width="300%" height="200%"><feGaussianBlur stdDeviation="5"/></filter></defs>`;
}
var leftArc = "M235 495 209 551 246 542 229 589 263 576 249 626";
var rightArc = "M1015 337 993 385 1023 379 1008 426 1040 410 1024 464";
function turboDetails(uid) {
	return `${arcGlow(uid)}
  <g data-effect="turbo-discharge" data-x="235" data-y="560" data-phase="0">${electricArc(uid, leftArc, "translate(-22 0)")}</g>
  <g data-effect="turbo-discharge" data-x="1015" data-y="400" data-phase=".9">${electricArc(uid, rightArc, "translate(0 0)")}</g>
  ${turboFlash(uid)}`;
}
//#endregion
//#region src/series/ghost-veil.js
function ghostVeilPath(ripple = 0) {
	return `M285 805C225 664 256 469 407 304C477 225 552 182 615 199Q643 206 618 244C803 205 963 327 992 536Q1015 705 1030 863L1050 1025
    Q1005 ${995 + ripple} 955 1050Q909 ${1110 - ripple} 853 1060
    Q803 ${1023 + ripple} 752 1080Q701 ${1134 - ripple} 650 1084
    Q601 ${1041 + ripple} 551 1092Q503 ${1144 - ripple} 452 1088
    Q404 ${1049 + ripple} 367 1094Q322 1124 298 1036Q285 1005 310 954Z`;
}
function ghostVeil(uid) {
	return `<g data-accessory="ghost-veil">
    <defs>
      <linearGradient id="${uid}-veil-light" x2=".3" y2="1">
        <stop stop-color="#edf7fc" stop-opacity=".88"/>
        <stop offset=".55" stop-color="#dceef7" stop-opacity=".7"/>
        <stop offset="1" stop-color="#d5eafa" stop-opacity=".28"/>
      </linearGradient>
      <mask id="${uid}-veil-opening" maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254" style="mask-type:luminance">
        <rect width="1254" height="1254" fill="white"/>
        <ellipse cx="644" cy="580" rx="345" ry="238" transform="rotate(-17 644 580)" fill="black"/>
      </mask>
    </defs>
    <g mask="url(#${uid}-veil-opening)">
      <path data-effect="ghost-veil" d="${ghostVeilPath()}" fill="url(#${uid}-veil-light)" stroke="#d8edf8" stroke-width="5" stroke-opacity=".65" stroke-linejoin="round"/>
      <path d="M336 485Q398 310 552 247M888 397Q949 463 961 566" fill="none" stroke="#f4fbff" stroke-width="10" stroke-linecap="round" opacity=".58"/>
      <path d="M371 825Q334 933 367 1016M477 874Q442 981 461 1046M826 840Q861 929 852 1005M932 780Q975 872 964 966" fill="none" stroke="#f0f9ff" stroke-width="7" stroke-linecap="round" opacity=".27"/>
    </g>
    <g data-effect="ghost-mote" data-x="211" data-y="586" data-phase="0">
      <path d="M210 630C158 615 171 570 222 545Q203 570 225 585Q250 610 210 630Z" fill="#c9e8ff" opacity=".65"/>
      <path d="M203 607Q185 593 209 573" fill="none" stroke="#effaff" stroke-width="5" stroke-linecap="round"/>
    </g>
    <g data-effect="ghost-mote" data-x="1082" data-y="429" data-phase="2">
      <path d="M1083 463C1040 449 1055 414 1095 394Q1080 417 1097 428Q1114 450 1083 463Z" fill="#d4edff" opacity=".6"/>
    </g>
  </g>`;
}
//#endregion
//#region src/series/peek-accessory-options.js
function peekAccessoryOption(option, uid) {
	switch (option) {
		case "cap": return `<g data-accessory="sideways-cap">
  <defs><linearGradient id="${uid}-cap" x2=".7" y2="1"><stop stop-color="#b1d4bc"/><stop offset="1" stop-color="#79a68c"/></linearGradient></defs>
  <path d="M293 480C297 340 409 220 568 203C748 166 895 274 931 440Q575 260 293 480Z" fill="url(#${uid}-cap)" stroke="#628b73" stroke-width="6"/>
  <path d="M293 448Q229 438 181 482Q236 533 377 476Z" fill="#8ab197" stroke="#628b73" stroke-width="6" stroke-linejoin="round"/>
  <path d="M293 480Q575 260 931 440L934 461Q575 286 296 501Z" fill="#628b73"/>
  <path d="M573 209Q498 265 497 368" fill="none" stroke="#d0e3cb" stroke-width="7" opacity=".65"/>
  <ellipse cx="576" cy="205" rx="24" ry="13" fill="#5d896e"/>
  <path d="M339 402l34-25M846 353l26 20" stroke="#d0e3cb" stroke-width="7" stroke-linecap="round"/>
 </g>`;
		case "goggles": return `<g data-accessory="peek-goggles">
  <defs><linearGradient id="${uid}-goggle-lens" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="#e6f6e8"/><stop offset=".5" stop-color="#b4d8c5"/><stop offset="1" stop-color="#8ab9a6"/></linearGradient><linearGradient id="${uid}-goggle-rim" x2="0" y2="1"><stop stop-color="#f0d79d"/><stop offset="1" stop-color="#c2a269"/></linearGradient></defs>
  <defs><mask id="${uid}-goggle-band-mask" x="0" y="0" width="1254" height="1254" maskUnits="userSpaceOnUse" style="mask-type:alpha"><use href="#${uid}-classic-source"/></mask></defs>
  <g mask="url(#${uid}-goggle-band-mask)"><g transform="translate(625 402) rotate(-17)" data-accessory="woven-goggle-band">
   <path d="M-341-49C-279-67-234-38-166-23L-166 23C-234 7-282-17-338 1ZM166-23C228-25 271 38 300 105L264 128C239 63 206 24 166 23Z" fill="#94aa77"/>
   <path d="M-338-5C-282-23-234 1-166 17V23C-234 7-282-17-338 1ZM166 17C210 18 244 60 270 124L264 128C239 63 206 24 166 23Z" fill="#6e8657"/>
   <path d="M-333-39C-277-54-231-29-177-17M179-13C227-10 261 46 287 107" fill="none" stroke="#cad6b0" stroke-width="3" stroke-dasharray="7 10" stroke-linecap="round" opacity=".6"/>
  </g></g>
  <g transform="translate(625 402) rotate(-17)">
   <rect x="-201" y="-24" width="29" height="48" rx="7" fill="url(#${uid}-goggle-rim)" stroke="#9a8154" stroke-width="4"/>
   <rect x="172" y="-24" width="29" height="48" rx="7" fill="url(#${uid}-goggle-rim)" stroke="#9a8154" stroke-width="4"/>
   <path d="M-31 6Q0-9 31 6" fill="none" stroke="#7c704d" stroke-width="19" stroke-linecap="round"/>
   <path d="M-31 1Q0-13 31 1" fill="none" stroke="#dec38a" stroke-width="12" stroke-linecap="round"/>
   <rect x="-189" y="-37" width="160" height="99" rx="41" fill="#5e6945"/>
   <rect x="29" y="-37" width="160" height="99" rx="41" fill="#5e6945"/>
   <rect x="-186" y="-48" width="157" height="99" rx="39" fill="url(#${uid}-goggle-rim)" stroke="#9a8154" stroke-width="5"/>
   <rect x="29" y="-48" width="157" height="99" rx="39" fill="url(#${uid}-goggle-rim)" stroke="#9a8154" stroke-width="5"/>
   <rect x="-173" y="-35" width="131" height="73" rx="29" fill="url(#${uid}-goggle-lens)" stroke="#829b7c" stroke-width="4"/>
   <rect x="42" y="-35" width="131" height="73" rx="29" fill="url(#${uid}-goggle-lens)" stroke="#829b7c" stroke-width="4"/>
   <path d="M-156 10Q-159-20-132-20H-109M59 10Q56-20 83-20H106" fill="none" stroke="#f8fff3" stroke-width="8" stroke-linecap="round" opacity=".9"/>
   <path d="M-78-20-96 21M137-20 119 21" stroke="#e6f5df" stroke-width="6" stroke-linecap="round" opacity=".55"/>
  </g>
 </g>`;
		case "bow": return `<g data-accessory="little-bow">
  <path d="M421 799Q623 862 865 749" fill="none" stroke="#9d8953" stroke-width="16"/>
  <g transform="translate(637 814) rotate(-15)">
   <path d="M-13 0C-50-39-96-63-109-40Q-125-5-106 42C-92 63-48 37-13 12Z" fill="#e8ca80" stroke="#b49656" stroke-width="5"/>
   <path d="M13 0C50-39 96-63 109-40Q125-5 106 42C92 63 48 37 13 12Z" fill="#f0d79c" stroke="#b49656" stroke-width="5"/>
   <path d="M-84-27Q-44-10-20 4M83 28Q44 16 20 5" fill="none" stroke="#fff0bd" stroke-width="7" stroke-linecap="round"/>
   <rect x="-22" y="-29" width="44" height="66" rx="15" fill="#c9a965"/>
   <path d="M-8-19V24" stroke="#f2d99b" stroke-width="6" stroke-linecap="round"/>
  </g>
 </g>`;
		default: return "";
	}
}
//#endregion
//#region src/series/party-details.js
var frameArt = `<path d="M-119-60Q-120-83-93-86H91Q119-83 119-61L108 26Q103 81 58 86H-52Q-103 84-110 34Z" fill="#251b3f"/>
  <path d="M-99-59Q-99-67-87-67H85Q99-66 98-55L88 25Q83 65 53 67H-48Q-83 66-90 28Z" fill="#493566" fill-opacity=".83"/>
  <path d="M-92-56H-21L-75 12-86 8Z" fill="#b2b3ee" fill-opacity=".26"/>
  <path d="M-69 53Q-52 59-32 58H45" fill="none" stroke="#8878ae" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/>
  <path d="M-106-63h9M97-63h9" stroke="#f4d58f" stroke-width="5" stroke-linecap="round"/>`;
var partySunglasses = `<g data-accessory="party-sunglasses" transform="translate(644 558) rotate(-16.7)">
  <path d="M-277-48l-42-13M277-48l28-6M-51-35Q0-58 51-35" fill="none" stroke="#251b3f" stroke-width="18" stroke-linecap="round"/>
  ${[-162, 162].map((x) => `<g transform="translate(${x} 0)">${frameArt}</g>`).join("")}
</g>`;
var partyWineGlass = `<g data-accessory="party-wine-glass" transform="translate(1012 806) rotate(21)">
  <path d="M-46-187C-55-159-65-125-54-96C-45-70-24-57 0-57S45-70 54-96C65-125 55-159 46-187Z" fill="#efe8ff" fill-opacity=".82" stroke="#71558d" stroke-width="5" stroke-linejoin="round"/>
  <path d="M-52-121C-55-91-32-64 0-64S55-91 52-121Z" fill="#a92d62"/>
  <path d="M-45-104Q-35-72-4-71" fill="none" stroke="#e96991" stroke-width="6" stroke-linecap="round"/>
  <ellipse cy="-121" rx="52" ry="9" fill="#d64a7f"/>
  <ellipse cy="-187" rx="46" ry="8" fill="#f7f0ff" fill-opacity=".65" stroke="#71558d" stroke-width="5"/>
  <path d="M-34-171Q-44-148-43-132" fill="none" stroke="#fff" stroke-opacity=".95" stroke-width="8" stroke-linecap="round"/>
  <path d="M40-157Q48-134 43-116" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="4" stroke-linecap="round"/>
  <ellipse cy="42" rx="37" ry="9" fill="#ddd0ed" stroke="#71558d" stroke-width="5"/>
  <path d="M0-55V-11m0 21v30" fill="none" stroke="#71558d" stroke-width="11" stroke-linecap="round"/>
  <path d="M-1-55V-11m0 21v29" fill="none" stroke="#fcf5ff" stroke-width="5" stroke-linecap="round"/>
  <path d="M-25 41Q-10 45 9 44" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
</g>`;
`${[26.5, 73.5].map((x) => `<g transform="translate(${x} 49) scale(.16)">${frameArt}</g>`).join("")}`;
//#endregion
//#region src/series/signature-details.js
var fx$2 = (kind, art, x, y, phase = 0) => `<g data-effect="${kind}" data-x="${x}" data-y="${y}" data-phase="${phase}">${art}</g>`;
({ ...EXTRA_SIGNATURES });
function signatureDetails(id, uid) {
	switch (id) {
		case "peekaboo": return peekAccessoryOption("goggles", uid);
		case "waiting": return `<path d="M924 730Q883 714 847 738" fill="none" stroke="#e4c06e" stroke-width="8" stroke-linecap="round"/><g data-accessory="hourglass" transform="translate(847 816) rotate(-9)">
  <path d="M-55-75H55Q58-24 20 0Q58 25 55 78H-55Q-58 25-20 0Q-58-24-55-75Z" fill="#bff3ee" stroke="#327e80" stroke-width="8"/>
  <path d="M-41-59H41Q38-32 0-13Q-38-32-41-59M-42 65Q-25 31 0 20Q25 31 42 65Z" fill="#edc875"/>
  <path d="M0-11V22" stroke="#edc875" stroke-width="5" stroke-linecap="round"/>
  <path d="M-66-80H66M-66 84H66" stroke="#235f67" stroke-width="15" stroke-linecap="round"/>
  <path d="M-42-66Q-47-38-25-21" stroke="#efffff" stroke-width="6" fill="none" stroke-linecap="round"/>
 </g>`;
		case "relieved": return `<g data-accessory="warm-mug" transform="translate(621 881) rotate(-8)">
  <path d="M69-35Q133-48 130-2Q127 45 74 34" fill="none" stroke="#d9ece4" stroke-width="22"/>
  <path d="M-86-54H84L74 44Q69 75 0 78Q-69 75-75 44Z" fill="#e2f0df"/>
  <ellipse cy="-52" rx="85" ry="22" fill="#bdd6c8"/><ellipse cy="-51" rx="69" ry="13" fill="#a57b4a"/>
  <path d="M-61-21L-54 32Q-51 48-33 52" fill="none" stroke="#f7fff1" stroke-width="9" stroke-linecap="round"/>
 </g>${fx$2("steam", "<path d=\"M574 785Q551 762 573 745M632 776Q611 750 634 726\" fill=\"none\" stroke=\"#d2eee0\" stroke-width=\"9\" stroke-linecap=\"round\"/>", 605, 780)}`;
		case "focused": return focusedAccessories();
		case "turbo": return turboDetails(uid);
		case "starstruck": return `<g data-accessory="star-orbit">
  <ellipse cx="640" cy="239" rx="241" ry="63" transform="rotate(-13 640 239)" fill="none" stroke="#ddb4dd" stroke-width="7" opacity=".8"/>
  ${[
			[
				414,
				285,
				1
			],
			[
				797,
				171,
				.8
			],
			[
				857,
				250,
				.55
			]
		].map(([x, y, s], i) => fx$2("orbit-star", `<path transform="translate(${x} ${y}) scale(${s})" d="M0-49 15-16 51-12 25 13 30 49 0 32-30 49-25 13-51-12-15-16Z" fill="#ffe295" stroke="#d9a65b" stroke-width="3"/>`, x, y, i / 3)).join("")}
 </g>`;
		case "squished": return `<g data-accessory="soft-cushion">
  <path d="M365 947Q625 1009 874 920L891 958 856 985 891 1021Q634 1153 345 1043L374 1009 341 978Z" fill="#dec9e8" stroke="#b595c4" stroke-width="7" stroke-linejoin="round"/>
  <path d="M389 990Q621 1066 845 966" fill="none" stroke="#f0e2f5" stroke-width="9" stroke-linecap="round"/>
  <path d="M371 979 401 997M361 1030 398 1016M870 958 842 982M874 1016 842 1003" stroke="#b595c4" stroke-width="6" stroke-linecap="round"/>
 </g>`;
		case "bored": return `<g data-accessory="ellipsis" data-effect="thought" data-x="933" data-y="276">
  <path d="M838 239Q838 212 866 210H1030Q1060 210 1060 239V292Q1060 319 1030 319H911L875 345 878 319H866Q838 319 838 292Z" fill="#e1d6c8" stroke="#a8947d" stroke-width="5"/>
  <g fill="#8e7c68"><circle cx="890" cy="265" r="10"/><circle cx="949" cy="265" r="10"/><circle cx="1008" cy="265" r="10"/></g>
 </g>`;
		case "revived": return `<g data-accessory="fresh-sprout" data-effect="sprout" data-x="599" data-y="292">
  <path d="M598 301Q606 228 616 181" fill="none" stroke="#a0d879" stroke-width="15" stroke-linecap="round"/>
  <path d="M609 244C528 253 480 195 488 150C569 144 610 183 609 244Z" fill="#a3dc7d"/>
  <path d="M611 216C624 136 682 116 739 131C729 200 674 227 611 216Z" fill="#c3ed98"/>
  <path d="M601 232 512 173M623 205 713 148" fill="none" stroke="#e4f9bd" stroke-width="6" stroke-linecap="round"/>
 </g>`;
		case "ghost": return ghostVeil(uid);
		default: return null;
	}
}
//#endregion
//#region src/series/classic-accessories.js
var fx$1 = (kind, art, x = 0, y = 0, phase = 0) => `<g data-effect="${kind}" data-x="${x}" data-y="${y}" data-phase="${phase}">${art}</g>`;
var star = (x, y, s = 1, color = "#ffdc83") => fx$1("twinkle", `<path transform="translate(${x} ${y}) scale(${s})" d="M0-22 7-7 22 0 7 7 0 22-7 7-22 0-7-7Z" fill="${color}"/>`, x, y, (x + y) % 7 / 7);
var heart = (x, y, s = 1) => fx$1("heart", `<path transform="translate(${x} ${y}) scale(${s})" d="M0 24C-48-6-35-38-13-30Q0-27 0-15Q0-27 13-30C35-38 48-6 0 24Z" fill="#ec85bb"/>`, x, y, x % 11 / 11);
var cheeks = (color = "#f2a6b2") => `<g fill="${color}" data-accessory="cheeks"><ellipse cx="410" cy="715" rx="29" ry="12" transform="rotate(-17 410 715)"/><ellipse cx="880" cy="624" rx="28" ry="12" transform="rotate(-17 880 624)"/></g>`;
function classicAccessories(id, uid) {
	const extra = extraSkinDetails(id, uid);
	if (extra !== null) return extra;
	const signature = signatureDetails(id, uid);
	if (signature !== null) return signature;
	switch (id) {
		case "sleepy": return `<g data-accessory="sleeping-cap">
  <path d="M293 480C275 346 373 209 531 166C700 111 843 168 889 286Q912 343 961 378Q994 393 1012 421Q960 452 931 440Q575 260 293 480Z" fill="#a4aae7" stroke="#737dbb" stroke-width="7" stroke-linejoin="round"/>
  <path d="M351 355Q403 248 535 208Q683 163 786 221" fill="none" stroke="#bec4f4" stroke-width="12" stroke-linecap="round"/>
  <path d="M293 480Q575 260 931 440L934 467Q577 289 296 508Z" fill="#e1e7ff" stroke="#b9c3eb" stroke-width="4" stroke-linejoin="round"/>
  ${fx$1("pom", "<circle cx=\"1008\" cy=\"423\" r=\"32\" fill=\"#edf1ff\"/><circle cx=\"997\" cy=\"410\" r=\"10\" fill=\"#fff\" opacity=\".6\"/>", 1008, 423)}
 </g>${fx$1("sleep", "<path d=\"M1016 353h32l-32 32h32\" fill=\"none\" stroke=\"#a5afe8\" stroke-width=\"8\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/>", 1032, 369, .2)}${fx$1("sleep", "<path d=\"M1071 287h24l-24 24h24\" fill=\"none\" stroke=\"#b4b9ee\" stroke-width=\"7\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/>", 1083, 299, .68)}`;
		case "party": return `<g data-accessory="party-hat" transform="translate(352 330) rotate(-38) scale(.68)">
  <defs>
   <path id="${uid}-party-shape" d="M-132 30L-12-171Q0-188 12-171L132 30Q0 69-132 30Z"/>
   <clipPath id="${uid}-party-cone"><use href="#${uid}-party-shape"/></clipPath>
   <linearGradient id="${uid}-party-fabric"><stop stop-color="#87e9df"/><stop offset=".45" stop-color="#44cfc9"/><stop offset="1" stop-color="#1699a9"/></linearGradient>
   <linearGradient id="${uid}-party-ribbon"><stop stop-color="#fff0b5"/><stop offset=".5" stop-color="#ffe19a"/><stop offset="1" stop-color="#e9b94e"/></linearGradient>
  </defs>
  <use href="#${uid}-party-shape" fill="url(#${uid}-party-fabric)"/>
  <g clip-path="url(#${uid}-party-cone)">
   <path d="M0-180Q25-60 132 30L163 60V-190Z" fill="#087f96" opacity=".16"/>
   <path d="M-65-105Q0-80 65-105L81-78Q0-45-81-78Z" fill="url(#${uid}-party-ribbon)"/>
   <path d="M-105-37Q0 2 105-37L123-8Q0 36-123-8Z" fill="url(#${uid}-party-ribbon)"/>
   <path d="M-65-104Q0-79 65-104M-105-36Q0 3 105-36" fill="none" stroke="#fff7d5" stroke-width="3" opacity=".8"/>
  </g>
  <path d="M-132 30Q0 69 132 30L136 49Q0 91-136 49Z" fill="url(#${uid}-party-ribbon)"/>
  <path d="M-131 31Q0 70 131 31" fill="none" stroke="#fff5cb" stroke-width="4" stroke-linecap="round"/>
  ${fx$1("pom", "<circle cy=\"-177\" r=\"15\" fill=\"#edbd53\"/><circle cx=\"-3\" cy=\"-180\" r=\"12\" fill=\"#ffe393\"/><ellipse cx=\"-7\" cy=\"-185\" rx=\"4\" ry=\"3\" fill=\"#fff4c7\"/>", 0, -177)}
 </g>${star(1030, 513, .75, "#dda3f2")}${star(238, 596, .65, "#70dce5")}${fx$1("confetti", "<path d=\"m1027 354 17-14\" stroke=\"#ffd86b\" stroke-width=\"12\" stroke-linecap=\"round\"/>", 1035, 347, .2)}${fx$1("confetti", "<path d=\"m249 459-11-20\" stroke=\"#ffd86b\" stroke-width=\"12\" stroke-linecap=\"round\"/>", 243, 449, .65)}`;
		case "champion": return `<g data-accessory="crown">
  <defs>
   <linearGradient id="${uid}-crown-ice" x2="0" y2="1"><stop stop-color="#f0fcff"/><stop offset=".55" stop-color="#cef1fb"/><stop offset="1" stop-color="#a0dce9"/></linearGradient>
   <linearGradient id="${uid}-crown-band" x2="0" y2="1"><stop stop-color="#b4e5f2"/><stop offset="1" stop-color="#81c4da"/></linearGradient>
  </defs>
  <path d="M297 428Q345 213 598 223Q830 212 927 398L931 440Q575 260 293 480Z" fill="#83bed2" stroke="#69a8c2" stroke-width="6"/>
  <path d="M293 480L280 301Q278 281 296 291L431 351Q444 357 452 345L559 201Q575 180 589 202L706 328Q715 339 730 330L895 275Q916 266 919 287L931 440Q575 260 293 480Z" fill="url(#${uid}-crown-ice)" stroke="#6daec5" stroke-width="7" stroke-linejoin="round"/>
  <path d="M297 307L431 365Q449 373 461 357L571 213M595 219L701 344Q717 359 735 347L900 292" fill="none" stroke="#fff" stroke-opacity=".67" stroke-width="7" stroke-linecap="round"/>
  <path d="M293 463Q575 243 931 423L934 465Q577 289 296 506Z" fill="url(#${uid}-crown-band)"/>
  <path d="M296 466Q575 248 929 426" fill="none" stroke="#e6faff" stroke-width="7" stroke-linecap="round"/>
  <path d="M299 499Q576 281 931 459" fill="none" stroke="#6ba9c3" stroke-width="6" stroke-linecap="round"/>
  <path d="M600 345Q603 345 607 351L617 366Q620 371 616 376L604 390Q600 395 596 389L584 374Q580 370 584 365L596 350Q598 345 600 345Z" fill="#55a9ce" stroke="#e6faff" stroke-width="4"/>
  <path d="m600 350-13 20 13 3Z" fill="#b4edff"/>
  <ellipse cx="416" cy="418" rx="11" ry="15" transform="rotate(24 416 418)" fill="#d7f5ff"/><ellipse cx="817" cy="391" rx="11" ry="15" transform="rotate(-22 817 391)" fill="#d7f5ff"/>
  ${star(600, 367, .3, "#f4fcff")}${star(821, 388, .28, "#e7faff")}
 </g>${cheeks()}`;
		case "early-supporter": return `<g data-accessory="halo" data-effect="halo" data-x="630" data-y="151"><ellipse cx="630" cy="151" rx="146" ry="30" transform="rotate(-10 630 151)" fill="none" stroke="#ffdc64" stroke-width="12"/>${star(823, 105, .75)}</g>`;
		case "blaze": return `<g data-accessory="flame-crest" data-effect="flame" data-x="590" data-y="370">
  <path d="M365 421C340 365 366 300 424 255C406 275 432 270 455 242C498 201 527 180 554 153Q580 128 567 114C651 169 685 231 659 282C704 270 730 225 719 190C785 242 819 300 800 353Q575 285 365 421Z" fill="#ffb51c"/>
  <path d="M435 387Q412 347 454 312Q446 352 485 335C525 311 566 273 563 224Q630 268 606 321Q652 318 674 279Q706 316 690 344Q552 320 435 387Z" fill="#ffeb87"/>
 </g>${fx$1("ember", "<circle cx=\"790\" cy=\"226\" r=\"8\" fill=\"#ffd769\"/>", 790, 226, .2)}${fx$1("ember", "<circle cx=\"405\" cy=\"228\" r=\"6\" fill=\"#ffd769\"/>", 405, 228, .7)}`;
		case "sick": return `${cheeks("#efa0a3")}<g data-accessory="thermometer" transform="translate(713 665) rotate(-48)"><rect x="-10" y="0" width="21" height="129" rx="10" fill="#fff8ed" stroke="#b5b29d" stroke-width="4"/>${fx$1("liquid", "<path d=\"M0 67v44\" stroke=\"#df6875\" stroke-width=\"7\" stroke-linecap=\"round\"/>", 0, 111)}<circle cy="118" r="8" fill="#df6875"/></g>`;
		case "detective": return `${detectiveCap(uid)}<g data-accessory="monocle"><ellipse cx="799" cy="511" rx="112" ry="116" fill="none" stroke="#d0b995" stroke-width="9"/><circle cx="909" cy="534" r="8" fill="#b69a76"/><path data-effect="chain" d="M909 540Q951 698 918 792" fill="none" stroke="#d0b995" stroke-width="6"/>${star(899, 457, .5, "#fff0b7")}</g>`;
		case "repair": return `${cheeks()}<g data-accessory="bandage" transform="translate(760 366) rotate(-12)"><rect x="-55" y="-22" width="110" height="44" rx="19" fill="#d7a680" stroke="#b28565" stroke-width="3"/><rect x="-17" y="-20" width="34" height="40" rx="6" fill="#efc6a4"/><path d="M-39-7v14M39-7v14M-6-9v18M6-9v18" stroke="#b88c6c" stroke-width="3"/></g>${star(885, 343, .4, "#d5edf4")}`;
		case "rainy": return `<g data-accessory="rain-cloud" data-effect="cloud" data-x="398" data-y="254" fill="#b5d2dd"><circle cx="354" cy="259" r="33"/><circle cx="398" cy="234" r="44"/><circle cx="444" cy="257" r="32"/><rect x="350" y="248" width="99" height="37" rx="18"/></g><g fill="#68bce5">${fx$1("rain", "<path d=\"M364 306q-22 32 0 32t0-32\"/>", 364, 322, .16)}${fx$1("rain", "<path d=\"M416 301q-19 28 0 28t0-28\"/>", 416, 315, .66)}<path d="M906 628q-18 27 0 27t0-27"/></g>`;
		case "love": return `${cheeks("#f2a9ce")}${heart(1013, 451, .62)}${heart(268, 604, .43)}`;
		case "revived": return `${cheeks("#f5a1b1")}${star(1014, 435, .72, "#8be8b6")}${star(253, 606, .45, "#8be8b6")}`;
		case "starstruck": return `${star(1020, 450, .95, "#e8b4ec")}${star(256, 609, .7, "#e8b4ec")}${star(911, 300, .48)}`;
		case "turbo": return `<path d="m984 397 28-39-3 30 28-8-32 43 5-32Z" fill="#ffc547"/>${fx$1("speed", "<path d=\"M171 668h86M172 713h68\" stroke=\"#eda5ca\" stroke-width=\"9\" stroke-linecap=\"round\"/>", 215, 691, .2)}${fx$1("speed", "<path d=\"M1020 562h64\" stroke=\"#eda5ca\" stroke-width=\"9\" stroke-linecap=\"round\"/>", 1052, 562, .65)}`;
		case "peekaboo": return fx$1("twinkle", "<path d=\"m265 458-12-22M238 489l-21-7M1030 407l15-19M1044 439l21-5\" stroke=\"#e3ec9c\" stroke-width=\"10\" stroke-linecap=\"round\"/>", 640, 470, .3);
		case "ghost": return `${star(1034, 475, .75, "#9bc5ff")}${star(257, 640, .55, "#9bc5ff")}`;
		case "melting": return fx$1("drop", "<path d=\"M439 923q-25 37 0 37t0-37\" fill=\"#ed8eb9\"/>", 439, 923, .2) + fx$1("drop", "<path d=\"M845 916q-20 31 0 31t0-31\" fill=\"#ed8eb9\"/>", 845, 916, .65);
		case "grumpy": return "<path d=\"M386 461Q443 447 510 467M747 386Q806 356 861 357\" fill=\"none\" stroke=\"#4d1024\" stroke-width=\"18\" stroke-linecap=\"round\"/>" + fx$1("sigh", "<path d=\"M998 648q22-15 40-2M1008 666q18-9 32 1\" fill=\"none\" stroke=\"#ca91a6\" stroke-width=\"7\" stroke-linecap=\"round\"/>", 1e3, 650, .4);
		case "snowy": return fx$1("confetti", "<circle cx=\"1032\" cy=\"500\" r=\"10\" fill=\"#b9e9ff\"/>", 1032, 500, .2) + fx$1("confetti", "<circle cx=\"253\" cy=\"626\" r=\"8\" fill=\"#b9e9ff\"/>", 253, 626, .7);
		case "gold": return star(462, 902, .65, "#fff0b1") + star(831, 952, .42, "#fff0b1");
		case "porcelain": return porcelainHairpin(uid) + star(839, 962, .45, "#fff") + star(406, 415, .32, "#fff");
		case "jade": return star(430, 921, .45, "#dcffe4") + star(755, 343, .35, "#dcffe4");
		case "kintsugi": return star(842, 816, .42, "#ffe4a2") + star(719, 338, .36, "#ffe4a2");
		case "deepsea": return "<g fill=\"none\" stroke=\"#7fd6ff\" stroke-width=\"5\">" + fx$1("bubbles", "<circle cx=\"1022\" cy=\"645\" r=\"12\"/>", 1022, 645, .2) + fx$1("bubbles", "<circle cx=\"268\" cy=\"737\" r=\"9\"/>", 268, 737, .7) + "</g>";
		case "glitch": return fx$1("glitch", "<path d=\"M1018 590h40M249 692h32\" stroke=\"#64dbe5\" stroke-width=\"6\"/>", 650, 600, .1);
		case "relieved": return fx$1("sigh", "<path d=\"M992 662q29-13 48 1M1004 681q24-9 40 2\" stroke=\"#c6e5d8\" stroke-width=\"7\" fill=\"none\" stroke-linecap=\"round\"/>", 1e3, 665, .2);
		case "bored": return fx$1("sigh", "<path d=\"M1000 650q24-8 44 2\" stroke=\"#c4b6a7\" stroke-width=\"7\" fill=\"none\" stroke-linecap=\"round\"/>", 1e3, 650, .4);
		case "waiting": return star(1007, 494, .5, "#8de4df");
		case "focused": return star(1006, 470, .42, "#96bcff");
		case "squished": return fx$1("twinkle", "<path d=\"M333 405l29-21M855 337l23 22\" fill=\"none\" stroke=\"#cfc5df\" stroke-width=\"10\" stroke-linecap=\"round\"/>", 600, 370, .3);
		default: return "";
	}
}
//#endregion
//#region src/nivoSnowy.js
var element = (markup) => {
	const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
	group.innerHTML = markup;
	return group;
};
var effect = (kind, artwork, x, y, phase = 0) => `<g data-effect="${kind}" data-x="${x}" data-y="${y}" data-phase="${phase}">${artwork}</g>`;
var fleck$1 = (x, y, r, color, opacity = 1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${opacity}"/>`;
var snow = (x, y, r) => `<path transform="translate(${x} ${y})" d="M0-${r}V${r}M-${r * .87}-${r * .5}L${r * .87} ${r * .5}M-${r * .87} ${r * .5}L${r * .87}-${r * .5}" fill="none" stroke="#ecfbff" stroke-width="3.5" stroke-linecap="round" opacity=".8"/>`;
var snowyMarkings = `<path d="M327 961Q430 1045 577 1029Q736 1024 891 925L910 1135H300Z" fill="#d6f5ff" opacity=".13"/>
  ${snow(443, 903, 14)}${snow(769, 969, 12)}${snow(879, 798, 9)}${fleck$1(549, 1005, 4, "#effcff")}${fleck$1(703, 885, 4, "#effcff", .7)}${fleck$1(398, 1008, 3, "#effcff", .6)}`;
var accessories = `<g data-accessory="snowman-scarf">
        ${effect("scarf-tail", `<path d="M393 816Q404 909 371 982Q414 1002 457 984Q479 913 458 834Z" fill="#bf4352"/>
          <path d="M391 929Q425 944 467 935L461 961Q421 970 382 953Z" fill="#f5ced0"/>
          <path d="M378 979l-4 19M396 986l-3 20M416 989v20M437 987l2 20M455 982l4 18" stroke="#a33246" stroke-width="7" stroke-linecap="round"/>`, 430, 835)}
        <path d="M304 751C446 858 759 816 939 657L962 728C805 903 493 932 319 824Z" fill="#cc4d5b"/>
        <path d="M317 766C466 869 770 814 942 675" fill="none" stroke="#ed8790" stroke-width="11" stroke-linecap="round"/>
        <path d="M332 818Q407 857 476 859M831 795Q897 757 950 708" fill="none" stroke="#a73648" stroke-width="7" stroke-linecap="round"/>
        <path d="M394 809Q420 805 457 824L462 870Q427 885 400 863Z" fill="#dd626e"/>
        <path d="M406 820Q422 829 450 833" fill="none" stroke="#ed8790" stroke-width="6" stroke-linecap="round"/>
      </g>
      <g data-accessory="coal-buttons" fill="#35444d">
        <path d="M653 896l17-5 15 10 3 16-13 12-18-3-9-14Z"/>
        <path d="M634 963l15-7 17 7 4 17-12 13-18-2-10-13Z"/>
        <path d="M609 1022l14-6 15 8 1 15-12 10-16-4-7-12Z"/>
        <path d="m658 902 9-2m-27 67 8-3m-34 63 7-2" fill="none" stroke="#687983" stroke-width="5" stroke-linecap="round"/>
      </g>
      ${effect("confetti", "<path d=\"M1034 564v36m-16-27 32 18m-32 0 32-18\" fill=\"none\" stroke=\"#a9d3e5\" stroke-width=\"5\" stroke-linecap=\"round\"/>", 1034, 582, .2)}
      ${effect("confetti", "<path d=\"M230 480v26m-11-20 22 13m-22 0 22-13\" fill=\"none\" stroke=\"#a9d3e5\" stroke-width=\"4\" stroke-linecap=\"round\"/>", 230, 493, .7)}`;
function replaceSnowyBeak(svg, defs, uid) {
	defs.append(element(`<filter id="${uid}-snowy-beak-removal" filterUnits="userSpaceOnUse"
   x="565" y="560" width="185" height="156" color-interpolation-filters="sRGB">
   <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  20 0 -20 0 -.15" result="warm-pixels"/>
   <feFlood flood-color="#fdfdfd"/>
   <feComposite in2="warm-pixels" operator="in"/>
 </filter>`));
	defs.querySelector(`[id="${uid}-art"]`).append(element(`<use href="#${uid}-classic-source" filter="url(#${uid}-snowy-beak-removal)"/>`));
	svg.querySelector("[data-part=\"beak\"]").innerHTML = `<g data-accessory="carrot-nose">
   <path d="M629 602C657 596 706 605 762 617C775 620 775 627 763 631C710 645 660 655 633 657C608 659 604 607 629 602Z" fill="#ff972f"/>
   <path d="M614 632C653 646 710 627 769 621C774 625 770 629 763 631C710 645 660 655 633 657C623 658 616 645 614 632Z" fill="#e96b21"/>
   <path d="M631 611Q642 607 654 609" fill="none" stroke="#ffd083" stroke-width="6" stroke-linecap="round"/>
   <path d="M672 604Q668 612 669 621M710 609Q707 615 708 621M639 648Q639 642 636 636" fill="none" stroke="#c7551b" stroke-opacity=".7" stroke-width="4" stroke-linecap="round"/>
 </g>`;
}
function applySnowyArtwork(svg, uid, { carrot = true } = {}) {
	applyClassicCoat(svg, uid, ["#62bdeb", "#97d8f9"], snowyMarkings);
	if (carrot) replaceSnowyBeak(svg, svg.querySelector("defs"), uid);
	svg.querySelector("[data-part=\"body\"]").insertAdjacentHTML("beforeend", accessories);
}
function createSnowyMotion(svg) {
	const scarf = svg.querySelector("[data-effect=\"scarf-tail\"]");
	const flakes = [...svg.querySelectorAll("[data-effect=\"confetti\"]")];
	return (time, active) => {
		const seconds = time / 1e3;
		const angle = active ? 3 * Math.sin(seconds * Math.PI * 2 / 3.6) : 0;
		scarf.setAttribute("transform", `rotate(${angle} 430 835)`);
		for (const flake of flakes) {
			const p = (seconds / 5.6 + Number(flake.dataset.phase)) % 1;
			const x = Math.sin(p * Math.PI * 2) * 12;
			flake.setAttribute("transform", active ? `translate(${x} ${p * 42})` : "");
			flake.setAttribute("opacity", active ? .8 * Math.min(1, p / .2, (1 - p) / .25) : 1);
		}
	};
}
function snowyShiver(pose, time) {
	const phase = time % 9750;
	if (phase > 1100) return pose;
	const progress = phase / 1100;
	const strength = Math.sin(Math.PI * progress) ** 2;
	return {
		...pose,
		x: pose.x + 4 * Math.sin(progress * Math.PI * 6) * strength,
		left: pose.left - 3 * strength,
		right: pose.right + 3 * strength
	};
}
//#endregion
//#region src/series/surface-patterns.js
var fleck = (x, y, r, color, opacity = 1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${opacity}"/>`;
function surfaceArt(id, uid) {
	switch (id) {
		case "snowy": return snowyMarkings;
		case "blaze": return `<defs><linearGradient id="${uid}-ember-sweep" x1=".15" y1="0" x2=".8" y2="1"><stop stop-color="#ffbc36"/><stop offset="1" stop-color="#ff7310"/></linearGradient><linearGradient id="${uid}-ember-core" x2=".4" y2="1"><stop stop-color="#ffe08a"/><stop offset="1" stop-color="#ffc03c" stop-opacity=".25"/></linearGradient></defs>
  <path d="M268 1160L289 900C318 975 370 999 419 988C368 941 374 888 414 845C407 918 476 953 513 924C551 895 560 853 545 817C634 865 662 934 620 985C702 977 760 913 774 854C813 936 797 995 755 1036C854 1022 930 952 957 876L1009 1160Z" fill="url(#${uid}-ember-sweep)" opacity=".88"/>
  <path d="M355 1160L350 1025Q419 1081 500 1044C550 1021 570 980 561 943C612 985 625 1048 589 1081C680 1077 744 1048 802 1001Q789 1079 724 1110L830 1160Z" fill="url(#${uid}-ember-core)"/>
  <path d="M428 925Q447 958 475 966M727 980Q755 959 766 936" fill="none" stroke="#ffda76" stroke-width="6" stroke-linecap="round" opacity=".55"/>`;
		case "ghost": return `<defs><linearGradient id="${uid}-mist" x2="0" y2="1"><stop stop-color="#d5e8ff" stop-opacity="0"/><stop offset="1" stop-color="#d5e8ff" stop-opacity=".32"/></linearGradient></defs>
  <path d="M300 962C443 1104 519 906 661 984C746 1030 859 999 976 864L1000 1140H280Z" fill="url(#${uid}-mist)"/>
  <path d="M350 970C468 1052 522 936 639 982C733 1019 802 995 870 949" fill="none" stroke="#d5e8ff" stroke-width="8" stroke-linecap="round" opacity=".32"/>
  ${fleck(418, 897, 6, "#d5e8ff", .55)}${fleck(806, 909, 4, "#d5e8ff", .5)}`;
		case "gold": return pearlSurface(uid);
		case "glitch": return `<g fill="#42dce8" opacity=".8"><path d="M324 398h68v9h-68zM406 398h19v9h-19zM890 725h90v10h-90zM340 901h44v8h-44zM683 1010h71v8h-71z"/></g><g fill="#f45bb4" opacity=".75"><path d="M339 412h44v7h-44zM903 713h51v6h-51zM330 911h30v6h-30zM705 1022h30v6h-30z"/></g><g fill="#b6f8ff" opacity=".6"><path d="M395 398h5v9h-5zM970 739h9v5h-9zM671 1010h5v8h-5z"/></g>`;
		case "porcelain": return porcelainDetails(uid);
		case "jade": return `<defs><linearGradient id="${uid}-mineral" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b6e1bd"/><stop offset=".55" stop-color="#6fbc98"/><stop offset="1" stop-color="#4e9e7e"/></linearGradient></defs>
  <g><path d="M325 310C429 244 478 327 559 338C622 347 654 313 707 294L748 306C686 343 651 384 578 376C482 368 447 295 360 345Z" fill="url(#${uid}-mineral)"/>
  <path d="M278 940C372 876 476 897 539 950C570 975 597 1013 648 1028C701 1046 752 1013 771 975C795 923 825 900 875 892C850 930 849 971 820 1015C770 1089 688 1129 607 1086C552 1058 536 1015 487 994C410 950 354 962 307 1006Z" fill="url(#${uid}-mineral)"/>
  <path d="M335 300C431 252 484 326 558 330Q637 353 697 297M310 954C399 904 479 935 528 976C574 1015 599 1058 657 1067Q753 1100 808 1005" fill="none" stroke="#c2e8c8" stroke-width="6" opacity=".7"/>
  <path d="M356 927Q373 888 424 874M511 960Q525 924 514 901M741 1081Q793 1089 838 1051M604 370Q603 344 627 320" fill="none" stroke="#89cfa9" stroke-width="4" opacity=".55"/>
  <path d="M870 330Q914 358 930 399L905 427Q908 370 870 330Z" fill="#a6dcb5" opacity=".5"/></g>`;
		case "kintsugi": return `<defs><linearGradient id="${uid}-seam" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fae09a"/><stop offset=".55" stop-color="#c49339"/><stop offset="1" stop-color="#edc979"/></linearGradient><filter id="${uid}-seam-soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="6"/></filter></defs>
  <g stroke="url(#${uid}-seam)"><g id="${uid}-seam-lines" fill="none" stroke-linejoin="round" stroke-linecap="round"><path d="M733 260C728.8 268.2 709.2 295.2 708 309C706.8 322.8 726.5 333.5 726 343C725.5 352.5 707.2 358 705 366C702.8 374 715.7 382.3 713 391C710.3 399.7 693 413.5 689 418M958 768C947.8 774.2 912.2 790.8 897 805C881.8 819.2 870.2 839.2 867 853C863.8 866.8 882.3 876.3 878 888C873.7 899.7 850.5 908.5 841 923C831.5 937.5 822.3 957.8 821 975C819.7 992.2 834.5 1004.2 833 1026C831.5 1047.8 815.5 1092.7 812 1106M327 870C336.2 877.3 370 900.2 382 914C394 927.8 398.2 938.2 399 953C399.8 967.8 384.8 981.2 387 1003C389.2 1024.8 407.8 1070.5 412 1084" stroke-width="8"/><path d="M708 309C701 307.8 677 307.2 666 302C655 296.8 646 282 642 278M726 343C732.7 344.7 756 345.8 766 353C776 360.2 782.7 380.5 786 386M867 853C860.2 851 837.7 839.8 826 841C814.3 842.2 801.8 856.8 797 860M841 923C833.3 921.8 808 912.7 795 916C782 919.3 768.3 938.5 763 943M821 975C829.2 978.8 858.7 987.7 870 998C881.3 1008.3 885.8 1030.5 889 1037M382 914C389 910.8 412.5 897.3 424 895C435.5 892.7 446.5 899.2 451 900" stroke-width="4"/></g></g>
  <g data-effect="kintsugi-glow" opacity="0" fill="none" stroke="#ffe4a0"><use href="#${uid}-seam-lines" filter="url(#${uid}-seam-soft)"/><use href="#${uid}-seam-lines" opacity=".8"/></g>
  <path d="M898 809C893.7 816.5 874.5 840.7 872 854C869.5 867.3 881.2 883.2 883 889M402 955C400.2 962.8 392.8 994.2 391 1002" fill="none" stroke="#ffedb1" stroke-width="2" opacity=".75"/>`;
		case "squished": return `<g fill="none" stroke="#d6cce5" stroke-width="8" stroke-linecap="round" opacity=".65"><path d="M374 393Q392 370 418 365M374 421Q397 399 429 395M821 330Q844 337 855 357M815 355Q836 363 844 382"/></g>`;
		default: return "";
	}
}
//#endregion
//#region src/series/icon-gradients.js
var palettes = {
	toasty: [
		"#80502f",
		"#aa7040",
		"#d3a065"
	],
	grumpy: [
		"#580f1e",
		"#6d1225",
		"#81162b"
	],
	snowy: [
		"#5bbbf0",
		"#75c8f4",
		"#94d7f8"
	],
	blaze: [
		"#ee1c02",
		"#f86903",
		"#fa9b02"
	],
	party: [
		"#6e29f8",
		"#912ff6",
		"#b937f8"
	],
	melting: [
		"#de7552",
		"#f58c68",
		"#ffaf8c"
	],
	sick: [
		"#387158",
		"#779b56",
		"#bbd157"
	],
	ghost: [
		"#031451",
		"#183276",
		"#446bb1"
	],
	gold: [
		"#fff3de",
		"#efddea",
		"#b6b7d9"
	],
	glitch: [
		"#110334",
		"#160725",
		"#020010"
	],
	"early-supporter": [
		"#103025",
		"#194332",
		"#235844"
	],
	porcelain: [
		"#406a9d",
		"#729bc7",
		"#91b3d8",
		"#c2dbef",
		"#a7c3df"
	],
	jade: [
		"#0b5b44",
		"#167451",
		"#328b61"
	],
	kintsugi: [
		"#1e1f23",
		"#29292e",
		"#343238"
	],
	waiting: [
		"#027598",
		"#00a6b6",
		"#01dcd1"
	],
	relieved: [
		"#41677f",
		"#78a69c",
		"#a3d3b8"
	],
	focused: [
		"#012a84",
		"#0149be",
		"#0169f6"
	],
	love: [
		"#863e67",
		"#cf62a1",
		"#ff88d2"
	],
	turbo: [
		"#341540",
		"#8f2d67",
		"#e44d83"
	],
	starstruck: [
		"#50245d",
		"#a95069",
		"#f78c42"
	],
	champion: [
		"#0a4c6b",
		"#698571",
		"#ecb74b"
	],
	sleepy: [
		"#303e79",
		"#4a5397",
		"#6a6cb9"
	],
	upsidedown: [
		"#16495b",
		"#80547d",
		"#d26a9c"
	],
	squished: [
		"#3d4170",
		"#986f95",
		"#ed9fb8"
	],
	rainy: [
		"#29474d",
		"#5f8791",
		"#90b6c3"
	],
	bored: [
		"#3e4451",
		"#6e6864",
		"#9a836f"
	],
	peekaboo: [
		"#29364d",
		"#7f8a52",
		"#d7e25a"
	],
	detective: [
		"#1a2b43",
		"#64504d",
		"#ac6648"
	],
	repair: [
		"#70432e",
		"#788a96",
		"#7ccdf2"
	],
	revived: [
		"#1896bb",
		"#37b4a3",
		"#74db8c"
	]
};
function applyIconGradient(svg, uid, skin) {
	const colors = palettes[skin];
	const gradient = svg.querySelector(`[id="${uid}-coat-gradient"]`);
	if (!colors || !gradient) return;
	const reversed = skin === "upsidedown";
	for (const [key, value] of Object.entries({
		gradientUnits: "userSpaceOnUse",
		x1: "600",
		x2: "600",
		y1: reversed ? "1100" : "210",
		y2: reversed ? "210" : "1100"
	})) gradient.setAttribute(key, value);
	const offsets = skin === "porcelain" ? [
		0,
		.34,
		.59,
		.82,
		1
	] : null;
	gradient.replaceChildren(...colors.map((color, index) => {
		const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
		stop.setAttribute("offset", String(offsets?.[index] ?? index / (colors.length - 1)));
		stop.setAttribute("stop-color", color);
		return stop;
	}));
}
//#endregion
//#region src/series/skin-motion.js
function createSkinMotion(svg) {
	const parts = [...svg.querySelectorAll("[data-effect]")].map((node) => ({
		node,
		kind: node.dataset.effect,
		x: Number(node.dataset.x) || 0,
		y: Number(node.dataset.y) || 0,
		phase: Number(node.dataset.phase) || 0
	}));
	const clamp = (v) => Math.max(0, Math.min(1, v));
	return function renderSkinMotion(time = 0, active = false) {
		const t = active ? time / 1e3 : 0;
		for (const { node, kind, x, y, phase } of parts) {
			const wave = Math.sin(t * Math.PI * 2 / 3.6 + phase), slow = Math.sin(t * Math.PI * 2 / 5.2 + phase);
			let dx = 0, dy = 0, sx = 1, sy = 1, rotate = 0, opacity = kind === "kintsugi-glow" ? 0 : kind === "turbo-glow" ? .72 : kind === "turbo-charge" ? .18 : kind === "turbo-spark" ? .82 : 1;
			if (active) switch (kind) {
				case "kintsugi-glow":
					opacity = .82 * (.5 - .5 * Math.cos(t * Math.PI * 2 / 4.8));
					break;
				case "anger-mark":
					sx = sy = 1 + .06 * (.5 + .5 * wave);
					break;
				case "huff":
					dx = slow * 12;
					dy = -15 * (.5 + .5 * wave);
					opacity = .6 + .4 * (.5 + .5 * wave);
					break;
				case "digital-fragment": {
					const pulse = (t + phase) % 6;
					dx = pulse < .24 ? Math.sin(pulse / .24 * Math.PI * 2) * 12 : 0;
					opacity = .65 + .35 * (.5 + .5 * wave);
					break;
				}
				case "ghost-veil":
					node.setAttribute("d", ghostVeilPath(wave * 12));
					break;
				case "ghost-mote":
					dy = slow * 18;
					dx = wave * 6;
					opacity = .55 + .3 * (.5 + .5 * wave);
					break;
				case "peek-cloth":
				case "blanket": {
					const p = t % 7;
					const lift = p < 1.4 ? (1 - Math.cos(p / 1.4 * Math.PI)) / 2 : p < 2.1 ? 1 : p < 3.8 ? (1 + Math.cos((p - 2.1) / 1.7 * Math.PI)) / 2 : 0;
					dy = -(kind === "peek-cloth" ? 42 : 110) * lift;
					break;
				}
				case "peek-leaf":
					rotate = wave * (phase ? -3 : 3);
					break;
				case "steam":
					dy = -12 * (.5 + .5 * slow);
					opacity = .45 + .4 * (.5 + .5 * wave);
					break;
				case "scarf-tail":
					rotate = wave * 3;
					break;
				case "turbo-glow": {
					const pulse = Math.sin(Math.PI * clamp(t % 5.4 / .82)) ** 2;
					sx = sy = 1 + .2 * pulse;
					opacity = .72 + .28 * pulse;
					break;
				}
				case "turbo-charge":
					opacity = .18 + .72 * Math.sin(Math.PI * clamp(t % 5.4 / 1.2)) ** 2;
					break;
				case "turbo-spark": {
					const charge = .5 + .5 * Math.sin(t * Math.PI * 2 / 2.8 + phase);
					opacity = .42 + .58 * charge;
					dx = (x < 624 ? -1 : 1) * 7 * charge;
					dy = -4 * charge;
					break;
				}
				case "turbo-breath": {
					const charge = .5 - .5 * Math.cos(t * Math.PI * 2 / 4.8);
					sx = sy = .8 + .5 * charge;
					opacity = .12 + .88 * charge;
					break;
				}
				case "turbo-core":
					opacity = .22 + .78 * (.5 - .5 * Math.cos(t * Math.PI * 2 / 4.8));
					break;
				case "turbo-discharge": {
					const progress = clamp((t + phase) % 2.4 / 1.2);
					const charge = Math.sin(Math.PI * progress) ** 2;
					opacity = charge;
					dx = (x < 624 ? -1 : 1) * 24 * progress;
					dy = -20 * progress;
					sx = sy = .88 + .12 * charge;
					break;
				}
				case "cupid-wing":
					rotate = wave * 5;
					break;
				case "orbit-star":
					dy = wave * 7;
					rotate = slow * 8;
					break;
				case "thought":
					dy = slow * 7;
					break;
				case "sprout":
					rotate = wave * 2.5;
					break;
				case "wisp":
					sx = 1 + wave * .015;
					sy = 1 + slow * .025;
					break;
				case "sleep": {
					const p = (t / 4.8 + phase) % 1;
					dx = 22 * p;
					dy = -90 * p;
					opacity = .85 * clamp(p / .18) * clamp((1 - p) / .25);
					sx = sy = .88 + .18 * p;
					break;
				}
				case "heart": {
					const p = (t / 5.4 + phase) % 1;
					dx = Math.sin(p * Math.PI) * 12;
					dy = -50 * p;
					opacity = .85 * clamp(p / .2) * clamp((1 - p) / .25);
					sx = sy = .82 + .2 * Math.sin(p * Math.PI);
					break;
				}
				case "hairpin-drop":
					rotate = slow * 5;
					break;
				case "twinkle":
					sx = sy = .76 + .24 * (.5 + .5 * wave);
					opacity = .45 + .55 * (.5 + .5 * wave);
					rotate = slow * 8;
					break;
				case "halo":
					dy = slow * 10;
					rotate = wave * .9;
					break;
				case "cloud":
					dx = slow * 5;
					dy = wave * 4;
					break;
				case "rain": {
					const p = (t / 2.8 + phase) % 1;
					dx = -8 * p;
					dy = 58 * p;
					opacity = .85 * clamp(p / .14) * clamp((1 - p) / .25);
					break;
				}
				case "flame":
					sx = 1 + wave * .018;
					sy = 1 + wave * .045;
					rotate = slow * .6;
					break;
				case "ember": {
					const p = (t / 3.8 + phase) % 1;
					dx = 8 * Math.sin(p * Math.PI);
					dy = -54 * p;
					sx = sy = 1 - p * .4;
					opacity = .75 * Math.sin(p * Math.PI);
					break;
				}
				case "confetti": {
					const p = (t / 5.6 + phase) % 1;
					dx = Math.sin(p * Math.PI * 2) * 12;
					dy = p * 42;
					rotate = p * 30;
					opacity = .8 * clamp(p / .2) * clamp((1 - p) / .25);
					break;
				}
				case "chain":
					node.setAttribute("d", `M909 540Q${951 + wave * 7} 698 ${918 + wave * 9} 792`);
					break;
				case "liquid":
					sy = .92 + .08 * (.5 + .5 * slow);
					break;
				case "pom":
					dy = wave * 2.5;
					dx = slow * 1.8;
					break;
				case "drop": {
					const p = (t / 5 + phase) % 1;
					dy = 22 * p;
					sy = .92 + .18 * p;
					opacity = .45 + .35 * Math.sin(p * Math.PI);
					break;
				}
				case "speed": {
					const p = (t / 4.4 + phase) % 1;
					dx = -24 * p;
					opacity = .7 * clamp(p / .15) * clamp((1 - p) / .3);
					break;
				}
				case "sigh": {
					const p = (t / 6.4 + phase) % 1;
					dx = 24 * p;
					dy = -12 * p;
					sx = sy = .8 + .35 * p;
					opacity = .48 * Math.sin(p * Math.PI) ** 2;
					break;
				}
				case "bubbles": {
					const p = (t / 5.8 + phase) % 1;
					dx = 7 * Math.sin(p * Math.PI * 2);
					dy = -70 * p;
					sx = sy = .8 + .3 * p;
					opacity = .7 * clamp(p / .2) * clamp((1 - p) / .25);
					break;
				}
				case "glitch": {
					const p = (t / 7.2 + phase) % 1;
					dx = p > .79 && p < .85 ? 2 * Math.sin((p - .79) / .06 * Math.PI) : 0;
					opacity = .55 + .35 * (.5 + .5 * slow);
					break;
				}
			}
			if (!active && kind === "chain") node.setAttribute("d", "M909 540Q951 698 918 792");
			if (!active && kind === "ghost-veil") node.setAttribute("d", ghostVeilPath());
			node.setAttribute("transform", `translate(${dx} ${dy}) translate(${x} ${y}) rotate(${rotate}) scale(${sx} ${sy}) translate(${-x} ${-y})`);
			node.setAttribute("opacity", String(opacity));
		}
	};
}
//#endregion
//#region src/series/skin-gestures.js
var SKIN_MOTIONS = {
	classic: [
		"Small wave",
		"轻轻挥手",
		"wave",
		1.5
	],
	deepsea: [
		"Original gentle float",
		"原版轻柔漂浮",
		"drift",
		2.4
	],
	grumpy: [
		"Little huff",
		"轻轻哼气",
		"huff",
		1.4
	],
	snowy: [
		"Tiny shiver",
		"轻轻打颤",
		"shiver",
		1.1
	],
	blaze: [
		"Ember lift",
		"火光轻跃",
		"lift",
		1.3
	],
	party: [
		"Party bounce",
		"派对弹跳",
		"bounce",
		1.2
	],
	melting: [
		"Soft settle",
		"软软落定",
		"settle",
		2
	],
	sick: [
		"Small sniffle",
		"轻轻吸鼻",
		"sniffle",
		1.2
	],
	ghost: [
		"Ghostly sway",
		"幽灵摇摆",
		"sway",
		2.6
	],
	gold: [
		"Pearl presentation",
		"展示珍珠",
		"turn",
		2
	],
	glitch: [
		"Tiny glitch",
		"小小错位",
		"glitch",
		.8
	],
	"early-supporter": [
		"Grateful bow",
		"感谢点头",
		"bow",
		1.8
	],
	porcelain: [
		"Gentle tilt",
		"轻轻歪头",
		"tilt",
		2
	],
	jade: [
		"Calm breath",
		"平静呼吸",
		"breathe",
		2.8
	],
	kintsugi: [
		"Steady nod",
		"坚定点头",
		"nod",
		1.6
	],
	waiting: [
		"Curious lean",
		"好奇探身",
		"curious",
		1.8
	],
	relieved: [
		"Relaxed exhale",
		"放松呼气",
		"exhale",
		2.4
	],
	focused: [
		"Writing notes",
		"写笔记",
		"writing",
		8
	],
	love: [
		"Shy sway",
		"害羞摇摆",
		"shy",
		2.2
	],
	turbo: [
		"Quick spring",
		"快速轻弹",
		"spring",
		1
	],
	starstruck: [
		"Wonder lift",
		"惊喜仰望",
		"wonder",
		2
	],
	champion: [
		"Proud lift",
		"骄傲挺身",
		"proud",
		1.8
	],
	sleepy: [
		"Drowsy nod",
		"困倦点头",
		"drowsy",
		2.6
	],
	upsidedown: [
		"Upside-down wiggle",
		"倒立轻摇",
		"wiggle",
		2.2
	],
	toasty: [
		"Cozy cup lift",
		"暖暖举杯",
		"cup-lift",
		2.8
	],
	squished: [
		"Soft squish",
		"软软一压",
		"squish",
		1.8
	],
	rainy: [
		"Rainy shrug",
		"雨中耸肩",
		"shrug",
		1.6
	],
	bored: [
		"Little sigh and slump",
		"叹气垂肩",
		"sigh",
		2.5
	],
	peekaboo: [
		"Little peek",
		"探头看看",
		"peek",
		1.6
	],
	detective: [
		"Look around",
		"四处观察",
		"look",
		2.2
	],
	repair: [
		"Careful wave",
		"小心挥手",
		"careful-wave",
		1.8
	],
	revived: [
		"Fresh little hop",
		"活力小跳",
		"hop",
		1.2
	]
};
var ids = Object.keys(SKIN_MOTIONS);
function applySkinGesture(id, pose) {
	const p = { ...pose };
	if (!pose.skinMotion) return p;
	const spec = SKIN_MOTIONS[id];
	if (!spec) return p;
	const index = ids.indexOf(id), duration = spec[3], period = 6.4 + index % 4 * .4;
	const phase = ((pose.skinTimeMs || 0) / 1e3 + (pose.skinReplay ? 0 : index % 5 * .22)) % period;
	if (phase > duration) return p;
	const u = phase / duration, e = Math.sin(Math.PI * u) ** 2, w = Math.sin(Math.PI * 2 * u) * e;
	switch (spec[2]) {
		case "wave":
			p.left += 28 * Math.sin(Math.PI * 3 * u) * e;
			p.right -= 6 * e;
			break;
		case "drift":
			p.x += 9 * w;
			p.y -= 9 * e;
			p.left += 3 * e;
			p.right -= 3 * e;
			break;
		case "huff":
			p.rotate += 3 * w;
			p.y += 12 * e;
			p.left -= 9 * e;
			p.right += 9 * e;
			break;
		case "shiver":
			p.x += 4 * Math.sin(u * Math.PI * 6) * e;
			p.left -= 3 * e;
			p.right += 3 * e;
			break;
		case "lift":
			p.y -= 25 * e;
			p.left += 12 * e;
			p.right -= 12 * e;
			break;
		case "bounce":
			p.y -= 30 * e;
			p.left += 15 * e;
			p.right -= 18 * e;
			break;
		case "settle":
			p.y += 7 * e;
			p.sy *= 1 - .012 * e;
			p.sx *= 1 + .01 * e;
			break;
		case "sniffle":
			p.rotate += 3 * w;
			p.y += 10 * e;
			p.left += 12 * e;
			break;
		case "sway":
			p.x += 20 * w;
			p.rotate += 3 * w;
			break;
		case "turn":
			p.rotate -= 3 * e;
			p.right -= 16 * e;
			p.y -= 10 * e;
			break;
		case "glitch":
			p.x += 10 * Math.sin(Math.PI * 4 * u) * e;
			p.left += 7 * e;
			p.right -= 7 * e;
			break;
		case "bow":
			p.y += 18 * e;
			p.rotate += 4 * e;
			p.left += 10 * e;
			p.right -= 10 * e;
			break;
		case "tilt":
			p.rotate -= 4.5 * e;
			p.right -= 8 * e;
			break;
		case "breathe":
			p.y -= 12 * e;
			p.left += 8 * e;
			p.right -= 8 * e;
			break;
		case "cup-lift":
			p.left += 14 * e;
			p.rotate -= 2.5 * e;
			p.y -= 7 * e;
			break;
		case "nod":
			p.rotate += 3.5 * e;
			p.y += 12 * e;
			p.right -= 8 * e;
			break;
		case "curious":
			p.rotate -= 5 * e;
			p.right -= 14 * e;
			break;
		case "exhale":
			p.y += 16 * e;
			p.left -= 9 * e;
			p.right += 9 * e;
			break;
		case "ready":
			p.rotate += 3 * e;
			p.y += 8 * e;
			p.left += 14 * e;
			p.right -= 10 * e;
			break;
		case "shy":
			p.rotate += 2.4 * w;
			p.left -= 3 * e;
			break;
		case "spring":
			p.y -= 28 * e;
			p.left += 13 * e;
			p.right -= 13 * e;
			break;
		case "wonder":
			p.y -= 20 * e;
			p.rotate -= 3 * e;
			p.right -= 14 * e;
			break;
		case "proud":
			p.y -= 20 * e;
			p.left += 18 * e;
			p.right -= 18 * e;
			break;
		case "drowsy":
			p.rotate += 5 * e;
			p.y += 14 * e;
			p.left -= 7 * e;
			p.blink = Math.max(p.blink, .55 * e);
			break;
		case "wiggle":
			p.rotate += 6 * w;
			p.left += 12 * e;
			p.right -= 12 * e;
			break;
		case "squish":
			p.sx *= 1 + .035 * e;
			p.sy *= 1 - .035 * e;
			p.y += 15 * e;
			break;
		case "shrug":
			p.left += 18 * e;
			p.right -= 18 * e;
			p.y -= 10 * e;
			break;
		case "sigh":
			p.y += 18 * e;
			p.rotate += 3 * e;
			p.left -= 12 * e;
			p.right += 12 * e;
			break;
		case "peek":
			p.y -= 20 * e;
			p.left += 14 * e;
			p.right -= 14 * e;
			break;
		case "look":
			p.rotate += 5 * w;
			p.x += 12 * w;
			p.left += 8 * e;
			break;
		case "careful-wave":
			p.left += 22 * Math.sin(Math.PI * 2 * u) * e;
			p.rotate -= 2 * e;
			break;
		case "hop":
			p.y -= 32 * e;
			p.left += 16 * e;
			p.right -= 18 * e;
			break;
	}
	return p;
}
//#endregion
//#region src/series/renderer.js
var group = (markup) => {
	const node = document.createElementNS("http://www.w3.org/2000/svg", "g");
	node.innerHTML = markup;
	return node;
};
function makeSeriesSkin(host, id, uid, { jadeDragon = true } = {}) {
	const rig = createRig(host, _nivo_body_default, uid, "Nivo");
	const svg = host.querySelector("svg");
	svg.dataset.seriesSkin = id;
	applyClassicCoat(svg, uid, ["#123e89", "#123e89"], surfaceArt(id, uid));
	applyIconGradient(svg, uid, id);
	const motion = svg.querySelector("[data-part=\"motion\"]");
	const accessories = group(classicAccessories(id, uid));
	accessories.dataset.seriesAccessories = id;
	motion.append(accessories);
	if (id === "porcelain") motion.prepend(group(porcelainHairpinBack(uid)));
	if (id === "gold") motion.querySelector("[data-part=\"right-flipper\"]").append(group(pearlSeashell(uid)));
	if (id === "party") {
		motion.append(group(partySunglasses));
		motion.querySelector("[data-part=\"right-flipper\"]").append(group(partyWineGlass));
	}
	if (id === "ghost") {
		svg.querySelector("defs").append(group(`<linearGradient id="${uid}-ghost-fade" gradientUnits="userSpaceOnUse" x1="0" y1="760" x2="0" y2="1110"><stop stop-color="white"/><stop offset=".5" stop-color="#b3b3b3"/><stop offset="1" stop-color="#242424"/></linearGradient><mask id="${uid}-ghost-body-fade" maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254" style="mask-type:luminance"><rect width="1254" height="1254" fill="url(#${uid}-ghost-fade)"/></mask>`));
		for (const part of [
			"body",
			"left-flipper",
			"right-flipper"
		]) motion.querySelector(`[data-part="${part}"]`).setAttribute("mask", `url(#${uid}-ghost-body-fade)`);
	}
	if (id === "ghost" || id === "glitch") {
		svg.querySelector("defs").append(group(`<filter id="${uid}-aura" x="-15%" y="-15%" width="130%" height="130%"><feMorphology in="SourceAlpha" operator="dilate" radius="5" result="edge"/><feGaussianBlur in="edge" stdDeviation="${id === "glitch" ? 2 : 8}" result="soft"/><feFlood flood-color="${id === "ghost" ? "#a4c7ef" : "#b12cae"}"/><feComposite in2="soft" operator="in"/></filter>`));
		const aura = group(`<use href="#${uid}-classic-source" filter="url(#${uid}-aura)"/>`);
		if (id === "ghost") aura.setAttribute("mask", `url(#${uid}-ghost-body-fade)`);
		motion.prepend(aura);
	}
	const jade = id === "jade" && jadeDragon ? applyJade(svg, uid) : null;
	const focused = id === "focused" ? mountFocusedWriting(svg, uid) : null;
	const animate = createSkinMotion(svg);
	return { render(pose, time, active) {
		rig.render(focused ? focused.pose(pose, time, active) : applySkinGesture(id, {
			...pose,
			skinTimeMs: time,
			skinMotion: active && !pose.peek && !pose.happy
		}));
		focused?.render(pose, time, active);
		jade?.(time, active);
		animate(time, active);
	} };
}
//#endregion
//#region src/series/catalog.js
var SERIES_WORLDS = {
	porcelain: {
		day: ["#edf5fe", "#f9f8f1"],
		night: ["#152238", "#232f46"],
		ink: "#5e8ec5",
		motif: "blossom",
		note: "Cobalt blossoms, a porcelain glow, and a gently swaying hairpin."
	},
	jade: {
		day: ["#e2efe5", "#f4f6e8"],
		night: ["#102b26", "#193c32"],
		ink: "#71ab87",
		motif: "jade",
		note: "A little jade dragon with soft horns and a gently curling tail."
	},
	kintsugi: {
		day: ["#eee9df", "#faf5eb"],
		night: ["#212127", "#302d2a"],
		ink: "#c19b52",
		motif: "seam",
		note: "Golden seams and quiet glints. Every repair belongs to the story."
	},
	gold: {
		day: ["#f5eaf2", "#edf2fb"],
		night: ["#28233c", "#32354b"],
		ink: "#b5a0ce",
		motif: "pearl",
		note: "Pearlescent light, shell-like curves, and a little pearl to treasure."
	},
	snowy: {
		day: ["#e0f2fc", "#f5faff"],
		night: ["#15283e", "#233e52"],
		ink: "#85bddb",
		motif: "snow",
		note: "Snow drifts, a red scarf, and Nivo’s tiny winter shiver."
	},
	rainy: {
		day: ["#e2edf0", "#f3f7f7"],
		night: ["#172a33", "#253b46"],
		ink: "#88aebe",
		motif: "rain",
		note: "Soft rain, little puddles, and a companion for cloudy days."
	},
	melting: {
		day: ["#fae7dc", "#fff4e9"],
		night: ["#36272c", "#493336"],
		ink: "#e3a17f",
		motif: "ripple",
		note: "Peach sorbet, melting drips, and ripples that slowly settle."
	},
	blaze: {
		day: ["#ffe7ce", "#fff6e8"],
		night: ["#302329", "#442c2c"],
		ink: "#e5a15b",
		motif: "ember",
		note: "Warm ember light and a small flame that keeps going."
	},
	grumpy: {
		day: ["#f3e4e9", "#faf3ef"],
		night: ["#2c202d", "#3c2936"],
		ink: "#bb8194",
		motif: "cloud",
		note: "A rosy cloud, a little huff, and room for an imperfect day."
	},
	sleepy: {
		day: ["#eceafa", "#f8f5fd"],
		night: ["#1b213c", "#303655"],
		ink: "#aaa6d6",
		motif: "moon",
		note: "A crescent moon, sleepy stars, and a soft nod toward rest."
	},
	sick: {
		day: ["#e7efdd", "#f6f8eb"],
		night: ["#172c27", "#2b4031"],
		ink: "#8faa63",
		motif: "steam",
		note: "Olive-green plumage, rosy cheeks, and a tiny thermometer. Take it gently."
	},
	relieved: {
		day: ["#e5f0e8", "#f8f7ee"],
		night: ["#1b302f", "#2c4340"],
		ink: "#8bb5a2",
		motif: "steam",
		note: "A warm mug, rising steam, and a little space to exhale."
	},
	focused: {
		day: ["#e4edfc", "#f5f8fd"],
		night: ["#14233e", "#24385a"],
		ink: "#7f9fda",
		motif: "orbit",
		note: "Clear glasses and a little notebook. One small thing at a time."
	},
	love: {
		day: ["#f7e3ee", "#fff3f5"],
		night: ["#342138", "#4c2e47"],
		ink: "#cf8bae",
		motif: "heart",
		note: "Blush hearts, golden curls, and a shy little sway."
	},
	party: {
		day: ["#eee2fc", "#fff0ee"],
		night: ["#2c2042", "#44305b"],
		ink: "#b093d2",
		motif: "confetti",
		note: "A tiny party hat, floating confetti, and a toast to showing up."
	},
	starstruck: {
		day: ["#f4e5ed", "#fff0df"],
		night: ["#28203d", "#493046"],
		ink: "#cf9f7f",
		motif: "star",
		note: "A golden constellation and a small moment of wonder."
	},
	champion: {
		day: ["#e1eef0", "#fcf2d9"],
		night: ["#17313d", "#324147"],
		ink: "#c0aa65",
		motif: "laurel",
		note: "Golden laurels, ocean light, and Nivo standing a little taller."
	},
	ghost: {
		day: ["#e8ecf8", "#f5f5fc"],
		night: ["#141d35", "#242e48"],
		ink: "#9baed6",
		motif: "wisp",
		note: "A drifting veil, moonlit wisps, and a friendly little ghost."
	},
	glitch: {
		day: ["#eee7f8", "#e6f4f7"],
		night: ["#181325", "#28203d"],
		ink: "#aa87be",
		motif: "pixel",
		note: "Cyan and pink fragments, a pixel antenna, and a tiny digital hiccup."
	}
};
var hasSeriesWorld = (id) => Object.hasOwn(SERIES_WORLDS, id);
//#endregion
//#region src/nivoMelting.js
function icecreamArtwork(uid) {
	return `<g data-accessory="melting-icecream">
  <defs>
   <linearGradient id="${uid}-scoop" x1="0" y1="0" x2=".3" y2="1"><stop stop-color="#fff2d8"/><stop offset=".55" stop-color="#ffd8ba"/><stop offset="1" stop-color="#f4b492"/></linearGradient>
   <linearGradient id="${uid}-cone" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f6d494"/><stop offset="1" stop-color="#dba060"/></linearGradient>
   <clipPath id="${uid}-waffle"><path d="M721 254Q773 278 830 288L829 155Q828 147 822 153Z"/></clipPath>
  </defs>
  <path d="M721 254Q773 278 830 288L829 155Q828 147 822 153Z" fill="url(#${uid}-cone)" stroke="#d69d65" stroke-width="4" stroke-linejoin="round"/>
  <g clip-path="url(#${uid}-waffle)" fill="none" stroke="#c58a53" stroke-width="4" opacity=".6">
   <path d="M712 190 858 264M706 220 851 294M732 170 858 234M759 150 858 204M726 300 847 171M706 278 827 149M751 312 872 183"/>
  </g>
  <path d="M730 253 818 170" stroke="#ffe5b3" stroke-width="5" stroke-linecap="round" opacity=".75"/>
  <path d="M667 322C653 304 665 282 686 280C689 255 715 244 738 254C754 231 787 233 804 251C833 242 861 259 864 285C890 287 906 310 895 332C915 354 894 376 873 369C860 387 835 381 822 367Q809 363 808 383L807 398Q805 412 793 410Q781 409 782 394L784 371Q764 375 745 366Q733 364 732 379L730 389Q726 403 715 398Q705 395 710 380L713 363C688 372 671 360 675 345Q652 343 667 322Z" fill="url(#${uid}-scoop)"/>
  <path d="M686 296Q694 275 718 278M750 263Q771 251 789 265M848 283Q867 286 872 303" fill="none" stroke="#fff8e9" stroke-width="10" stroke-linecap="round" opacity=".85"/>
  <path d="M683 337Q698 345 712 337M752 347Q767 351 779 343M836 347Q851 353 864 345" fill="none" stroke="#ecaa8d" stroke-width="5" stroke-linecap="round" opacity=".6"/>
 </g>`;
}
function mountMeltingSkin(svg, uid) {
	svg.querySelector("defs").insertAdjacentHTML("beforeend", `<linearGradient id="${uid}-frost" gradientUnits="userSpaceOnUse" x1="0" y1="845" x2="0" y2="1080"><stop stop-color="#edf8fa" stop-opacity="0"/><stop offset=".3" stop-color="#edf8fa" stop-opacity=".12"/><stop offset=".68" stop-color="#e2f3f6" stop-opacity=".8"/><stop offset="1" stop-color="#c4e6ed"/></linearGradient>`);
	applyClassicCoat(svg, uid, ["#de7958", "#ffc39a"], `<rect y="845" width="1254" height="409" fill="url(#${uid}-frost)"/>`);
	const motion = svg.querySelector("[data-part=\"motion\"]");
	motion.insertAdjacentHTML("beforeend", icecreamArtwork(uid));
	motion.insertAdjacentHTML("afterbegin", `<g data-accessory="thaw-edge" fill="#c4e6ed">
  <path d="M466 1018Q491 1028 516 1037L509 1071Q506 1089 490 1087Q473 1085 474 1069Z"/>
  <path d="M602 1042H665L657 1091Q653 1113 632 1111Q611 1109 610 1090Z"/>
  <path d="M748 1010 798 993 789 1044Q786 1064 769 1065Q752 1064 752 1047Z"/>
 </g>`);
	motion.insertAdjacentHTML("beforeend", `<g data-accessory="thaw-drop" transform="translate(776 1077)"><path d="M0-12C-4-5-11 2-11 8A11 11 0 0 0 11 8C11 2 4-5 0-12Z" fill="#c4e9f1"/><path d="M-4 5V9" stroke="white" stroke-width="3" stroke-linecap="round"/></g>`);
	const ground = document.createElementNS("http://www.w3.org/2000/svg", "g");
	ground.innerHTML = "<ellipse cx=\"636\" cy=\"1165\" rx=\"207\" ry=\"26\" fill=\"#b8dce5\" opacity=\".4\"/><ellipse data-ripple cx=\"776\" cy=\"1165\" rx=\"25\" ry=\"5\" fill=\"none\" stroke=\"#a3d5e2\" stroke-width=\"4\" opacity=\".4\"/>";
	motion.before(ground);
	const drop = motion.querySelector("[data-accessory=\"thaw-drop\"]"), ripple = ground.querySelector("[data-ripple]");
	motion.after(drop);
	const clamp = (value) => Math.max(0, Math.min(1, value));
	const smooth = (value) => {
		const p = clamp(value);
		return p * p * (3 - 2 * p);
	};
	const lowerParts = [
		motion.querySelector("[data-accessory=\"thaw-edge\"]"),
		drop,
		ground
	];
	let release = null, previousTime = -1;
	return (time, active, peek = false) => {
		for (const node of lowerParts) node.setAttribute("visibility", peek ? "hidden" : "visible");
		const p = time % 4400 / 4400;
		const attached = new DOMPoint(776, 1077).matrixTransform(motion.transform.baseVal.consolidate().matrix);
		if (time < previousTime || p < .3) release = null;
		previousTime = time;
		if (!release && p >= .3) release = {
			x: attached.x,
			y: attached.y
		};
		const origin = release || attached;
		const grow = smooth(p / .3), fall = clamp((p - .3) / .2), land = smooth((p - .5) / .06);
		let x = attached.x, y = attached.y, sx = .15 + .85 * grow, sy = .15 + .85 * grow, opacity = smooth(p / .12);
		if (p >= .3) {
			x = origin.x;
			y = origin.y + (1144 - origin.y) * fall * fall + 18 * land;
			sx = 1 - .12 * Math.sin(fall * Math.PI) + .45 * land;
			sy = 1 + .18 * Math.sin(fall * Math.PI) - .85 * land;
			opacity = 1 - land;
		}
		if (!active) {
			x = attached.x;
			y = attached.y;
			sx = .7;
			sy = .7;
			opacity = .75;
		}
		drop.setAttribute("transform", `translate(${x} ${y}) scale(${sx} ${sy})`);
		drop.setAttribute("opacity", opacity);
		const spread = clamp((p - .5) / .38), expansion = 1 - (1 - spread) ** 3;
		ripple.setAttribute("cx", String(origin.x));
		ripple.setAttribute("rx", String(8 + 44 * expansion));
		ripple.setAttribute("ry", String(2 + 7 * expansion));
		ripple.setAttribute("opacity", active ? .55 * smooth(spread / .14) * (1 - smooth(spread)) : .3);
	};
}
function meltingPose(pose, time) {
	const settle = Math.sin(time % 4400 / 4400 * Math.PI) ** 2;
	return {
		...pose,
		y: pose.y + 6 * settle,
		sx: pose.sx * (1 + .012 * settle),
		sy: pose.sy * (1 - .01 * settle)
	};
}
//#endregion
//#region src/nivoIconSkins.js
var skins = {
	love: {
		coat: ["#ba517e", "#f4a6c7"],
		duration: 2.2,
		period: 9.3,
		offset: 1.88
	},
	melting: {
		coat: ["#db855c", "#ffc599"],
		duration: 2,
		period: 9.3,
		offset: 2.82
	}
};
var hasIconSkinArtwork = (appearance) => Object.hasOwn(skins, appearance);
var fx = (kind, art, x, y, phase = 0) => `<g data-effect="${kind}" data-x="${x}" data-y="${y}" data-phase="${phase}">${art}</g>`;
function cupidWings() {
	return `${fx("cupid-wing", `<path d="M350 776C278 789 218 761 180 717C148 679 153 644 177 654C196 665 217 678 240 683C198 650 183 604 205 596C223 590 246 632 280 652C259 625 257 601 276 603C302 608 332 675 365 715Z" fill="#fff2f7" stroke="#d5afd0" stroke-width="6" stroke-linejoin="round"/>
  <path d="M189 702Q237 745 297 741M223 647Q253 689 301 698" fill="none" stroke="#e9c9e0" stroke-width="7" stroke-linecap="round"/>`, 350, 735)}
  ${fx("cupid-wing", `<path d="M924 735C1019 731 1082 697 1124 646C1146 620 1141 597 1122 605C1102 616 1082 627 1062 630C1103 603 1138 545 1116 533C1096 522 1072 570 1041 594C1058 568 1055 545 1039 548C1013 550 980 617 927 664Z" fill="#fff2f7" stroke="#d5afd0" stroke-width="6" stroke-linejoin="round"/>
  <path d="M1109 632Q1060 682 1001 691M1090 580Q1067 623 1010 650" fill="none" stroke="#e9c9e0" stroke-width="7" stroke-linecap="round"/>`, 940, 692, Math.PI)}`;
}
var cupidProps = {
	arrow: `<g data-accessory="cupid-arrow" transform="translate(250 825) rotate(150)">
  <path d="M-72-18H-44L-21 0-44 18H-72L-55 0Z" fill="#f3c7e0" stroke="#cc83b0" stroke-width="4" stroke-linejoin="round"/>
  <path d="M-65 0H-16M16 0H98" stroke="#9e5a43" stroke-width="13" stroke-linecap="round"/>
  <path d="M-65-2H-16M16-2H98" stroke="#ffe0a0" stroke-width="7" stroke-linecap="round"/>
  <path d="M138 0C106-37 85-30 88-12Q89-3 99 0Q89 3 88 12C85 30 106 37 138 0Z" fill="#e874a6" stroke="#b85384" stroke-width="5" stroke-linejoin="round"/>
  <path d="M97-15Q105-21 114-15" fill="none" stroke="#ffc5dd" stroke-width="4" stroke-linecap="round"/>
 </g>`,
	bow: `<g data-accessory="cupid-bow" transform="translate(1002 800) rotate(8)">
  <path d="M66-110V110" stroke="#f8e4c2" stroke-width="6" stroke-linecap="round"/>
  <path d="M66-110C26-104 3-66 0-18M0 18C3 66 26 104 66 110" fill="none" stroke="#b87747" stroke-width="23" stroke-linecap="round"/>
  <path d="M66-111C26-105 3-66 0-18M0 18C3 66 26 103 66 109" fill="none" stroke="#ffd184" stroke-width="15" stroke-linecap="round"/>
 </g>`
};
var cupidArtwork = `<g data-accessory="cupid-curl">
  <path d="M592 230C610 226 606 248 594 265C575 294 518 301 507 332C498 357 527 372 543 355C552 344 541 330 529 339C528 322 550 316 563 330C585 356 559 389 530 388C493 389 470 361 479 330C490 290 562 267 592 230Z" fill="#eab66b"/>
  <path d="M581 269C618 254 659 271 664 301C669 324 647 345 627 338C608 332 605 315 619 306C617 321 636 324 642 313C652 291 613 281 576 298Z" fill="#eab66b"/>
  <path d="M584 252C553 283 505 293 493 330M593 282Q625 274 644 289" fill="none" stroke="#ffdda3" stroke-width="8" stroke-linecap="round"/>
 </g>
 <g data-accessory="cupid-quiver" transform="translate(862 887) rotate(25)">
  <path d="M-14-61-23-138M16-61 23-132" fill="none" stroke="#ffe2a5" stroke-width="8" stroke-linecap="round"/>
  <path d="M-23-149C-48-133-46-119-23-129C0-119 2-133-23-149ZM23-144C-2-128 0-114 23-124C46-114 48-128 23-144Z" fill="#f39abc" stroke="#c76594" stroke-width="4" stroke-linejoin="round"/>
  <path d="M-42-76H42L32 72Q0 91-32 72Z" fill="#b56e91" stroke="#925677" stroke-width="6" stroke-linejoin="round"/>
  <path d="M-28-57H-11L-8 74Q-20 72-24 68Z" fill="#d596b3"/>
  <path d="M-46-75H46M-33 67Q0 77 33 67" fill="none" stroke="#ffd79a" stroke-width="11" stroke-linecap="round"/>
  <path d="M0 24C-29 8-15-11 0 2C15-11 29 8 0 24Z" fill="#ffe0a5"/>
 </g>${fx("heart", "<path d=\"M1034 463C983 433 1006 401 1034 424C1062 401 1085 433 1034 463Z\" fill=\"#ed92bd\"/>", 1034, 437, .25)}`;
function mountNivoIconSkin(svg, uid, appearance) {
	if (appearance === "melting") return mountMeltingSkin(svg, uid);
	applyClassicCoat(svg, uid, skins[appearance].coat);
	const motion = svg.querySelector("[data-part=\"motion\"]");
	if (appearance === "love") {
		motion.insertAdjacentHTML("afterbegin", cupidWings());
		motion.querySelector("[data-part=\"left-flipper\"]").insertAdjacentHTML("beforeend", cupidProps.arrow);
		motion.querySelector("[data-part=\"right-flipper\"]").insertAdjacentHTML("beforeend", cupidProps.bow);
		motion.insertAdjacentHTML("beforeend", cupidArtwork);
	}
	const effects = [...motion.querySelectorAll("[data-effect]")].map((node) => ({
		node,
		kind: node.dataset.effect,
		x: Number(node.dataset.x),
		y: Number(node.dataset.y),
		phase: Number(node.dataset.phase)
	}));
	const handheldAndLowerBody = motion.querySelectorAll("[data-accessory=\"cupid-arrow\"], [data-accessory=\"cupid-bow\"], [data-accessory=\"cupid-quiver\"], [data-accessory=\"sorbet-drips\"]");
	let wasPeeking = false;
	return (time, active, peek = false) => {
		if (peek !== wasPeeking) {
			for (const node of handheldAndLowerBody) node.setAttribute("visibility", peek ? "hidden" : "visible");
			wasPeeking = peek;
		}
		for (const { node, kind, x, y, phase } of effects) {
			if (!active) {
				node.removeAttribute("transform");
				node.removeAttribute("opacity");
				continue;
			}
			const seconds = time / 1e3;
			if (kind === "cupid-wing") {
				const rotation = Math.sin(seconds * Math.PI * 2 / 3.6 + phase) * 5;
				node.setAttribute("transform", `rotate(${rotation} ${x} ${y})`);
			} else if (kind === "heart") {
				const p = (seconds / 5.4 + phase) % 1;
				const scale = .82 + .2 * Math.sin(p * Math.PI);
				node.setAttribute("transform", `translate(${Math.sin(p * Math.PI) * 12} ${-50 * p}) translate(${x} ${y}) scale(${scale}) translate(${-x} ${-y})`);
				node.setAttribute("opacity", .85 * Math.min(1, p / .2, (1 - p) / .25));
			} else {
				const p = (seconds / 5 + phase) % 1;
				node.setAttribute("transform", `translate(0 ${22 * p}) translate(0 ${y}) scale(1 ${.92 + .18 * p}) translate(0 ${-y})`);
				node.setAttribute("opacity", .45 + .35 * Math.sin(p * Math.PI));
			}
		}
	};
}
function nivoIconSkinPose(appearance, pose, time, replay = false) {
	if (appearance === "melting") return meltingPose(pose, time);
	const { duration, period, offset } = skins[appearance];
	const elapsed = (time / 1e3 + (replay ? 0 : offset)) % period;
	if (elapsed > duration) return pose;
	const progress = elapsed / duration;
	const ease = Math.sin(Math.PI * progress) ** 2;
	if (appearance === "love") return {
		...pose,
		rotate: pose.rotate + 2.4 * Math.sin(Math.PI * 2 * progress) * ease,
		left: pose.left - 3 * ease
	};
	return {
		...pose,
		y: pose.y + 7 * ease,
		sy: pose.sy * (1 - .012 * ease),
		sx: pose.sx * (1 + .01 * ease)
	};
}
//#endregion
//#region \0website-nivo-skins
var heroLooks = [
	{
		"id": "classic",
		"name": "Classic"
	},
	{
		"id": "deepsea",
		"name": "Deep-Sea"
	},
	{
		"id": "snowy",
		"name": "Snowy"
	},
	{
		"id": "blaze",
		"name": "Blaze"
	},
	{
		"id": "party",
		"name": "Party"
	},
	{
		"id": "melting",
		"name": "Melting"
	},
	{
		"id": "sick",
		"name": "Sick"
	},
	{
		"id": "ghost",
		"name": "Ghost"
	},
	{
		"id": "gold",
		"name": "Pearl"
	},
	{
		"id": "glitch",
		"name": "Glitch"
	},
	{
		"id": "porcelain",
		"name": "Porcelain"
	},
	{
		"id": "jade",
		"name": "Jade"
	},
	{
		"id": "kintsugi",
		"name": "Kintsugi"
	},
	{
		"id": "focused",
		"name": "Focused"
	},
	{
		"id": "love",
		"name": "Love"
	},
	{
		"id": "starstruck",
		"name": "Starstruck"
	},
	{
		"id": "champion",
		"name": "Champion"
	},
	{
		"id": "sleepy",
		"name": "Sleepy"
	},
	{
		"id": "rainy",
		"name": "Rainy"
	}
];
function makeClassicSkin(host, look, uid) {
	const id = look.id;
	if (hasSeriesWorld(id) && id !== "snowy" && !hasIconSkinArtwork(id)) {
		const rig = makeSeriesSkin(host, id, uid);
		return { render(pose) {
			rig.render({
				...pose,
				reacting: !!pose.skinReacting
			}, pose.skinTimeMs || 0, !!pose.skinMotion);
		} };
	}
	const rig = createRig(host, _nivo_body_default, uid, "Nivo", id);
	const svg = host.querySelector("svg");
	let motion;
	if (id === "snowy") {
		applySnowyArtwork(svg, uid);
		motion = createSnowyMotion(svg);
	} else if (hasIconSkinArtwork(id)) motion = mountNivoIconSkin(svg, uid, id);
	return { render(pose) {
		const time = pose.skinTimeMs || 0;
		const animate = !!pose.skinMotion && !pose.peek;
		if (animate && !pose.skinReacting) {
			if (id === "snowy") pose = snowyShiver(pose, time);
			else if (motion) pose = nivoIconSkinPose(id, pose, time);
		}
		rig.render(pose);
		motion?.(time, animate, pose.peek);
	} };
}
//#endregion
export { heroLooks, makeClassicSkin };
