// Export the approved rig at browser-icon sizes without changing its artwork.
// node tools/generate-nivo-favicons.mjs [path-to-sharp-module]
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRig } from '../assets/nivo-rig.js';

const sharp = (await import(process.argv[2] || 'sharp')).default;
const root = fileURLToPath(new URL('..', import.meta.url));
const artwork = await fs.readFile(path.join(root, 'assets/nivo-body.png'));
const container = { innerHTML: '', querySelectorAll: () => [] };
createRig(container, 'data:image/png;base64,' + artwork.toString('base64'), 'nivo-favicon', 'Nivo');
const svg = container.innerHTML;
// Keep the transparent crop identical in the browser tab and the nav logo.
await sharp(Buffer.from(svg)).resize(128, 128).png().toFile(path.join(root, 'assets/nivo-mark.png'));
const sizes = [16, 32, 48, 64];
const images = [];
for (const size of sizes) {
  const image = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  const name = size === 64 ? 'favicon.png' : 'favicon-' + size + '.png';
  await fs.writeFile(path.join(root, 'assets', name), image);
  images.push(image);
  console.log(name + ': ' + size + '×' + size);
}
// ICO stores the same PNG exports in one file for browsers using /favicon.ico.
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
images.forEach((image, index) => {
  const entry = 6 + index * 16;
  header[entry] = sizes[index];
  header[entry + 1] = sizes[index];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(image.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});
await fs.writeFile(path.join(root, 'favicon.ico'), Buffer.concat([header, ...images]));
console.log('favicon.ico: four embedded sizes');
