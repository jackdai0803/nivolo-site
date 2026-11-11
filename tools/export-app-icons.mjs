// Refresh website thumbnails and inspection tiles from the app's current artwork.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const sharp = createRequire(new URL('../../pebble-app/package.json', import.meta.url))('sharp');
const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = path.resolve(site, '../pebble-app');
const source = fs.readFileSync(path.join(app, 'src/App.jsx'), 'utf8').split('const MASCOT_ICON_LOOKS')[0];
const icons = [...source.matchAll(/\{ id: "([^"]+)",\s*name: "([^"]+)"[^\n]+/g)].filter(m => !m[0].includes('retired: true')).map(m => m[1]);
const jpg = new Set(['early-supporter','porcelain','jade','kintsugi','deepsea']);
for (const id of icons) {
 const websiteId = id === 'upsidedown' ? 'upside_down' : id;
 const preview = path.join(app, `src/assets/appicons/${id}.png`);
 const native = path.join(app, `ios/App/App/Assets.xcassets/AppIcon-${id}.appiconset/AppIcon-${id}.png`);
 const master = fs.existsSync(native) ? native : preview;
 await sharp(preview).resize(256,256).png().toFile(path.join(site, `assets/icons/${websiteId}.png`));
 for (const [suffix, size] of [['',512],['-lg',1024]]) {
  const image = sharp(master).resize(size,size);
  const extension = jpg.has(id) ? 'jpg' : 'webp';
  await (jpg.has(id) ? image.jpeg({quality:94}) : image.webp({quality:94})).toFile(path.join(site, `assets/icons-3d/${websiteId}${suffix}.${extension}`));
 }
}
for (const file of fs.readdirSync(path.join(app,'src/assets/flowers')).filter(f => f.endsWith('.png'))) {
 await sharp(path.join(app,'src/assets/flowers',file)).resize(256,256).webp({quality:94}).toFile(path.join(site,'assets/flowers',file.replace('.png','-icon.webp')));
}
fs.mkdirSync(path.join(site,'assets/myths'),{recursive:true});
for (const file of fs.readdirSync(path.join(app,'src/assets/myths')).filter(f => f.endsWith('.png'))) {
 await sharp(path.join(app,'src/assets/myths',file)).resize(256,256).webp({quality:94}).toFile(path.join(site,'assets/myths',file.replace('.png','-icon.webp')));
}
for (const file of ['index.html','launch.html']) {
 const target=path.join(site,file);
 let html=fs.readFileSync(target,'utf8');
 html=html.replace(/(assets\/(?:icons\/[^"?]+\.png|flowers\/[^"?]+-icon\.webp))(?:\?v=[^"\s]+)?/g,'$1?v=20261109');
 fs.writeFileSync(target,html);
}
console.log(`Exported ${icons.length} current app icons and all flower thumbnails.`);
