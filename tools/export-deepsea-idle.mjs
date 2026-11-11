// Cache the approved app rig's costly glow in nine still blink poses.
// Website motion can then move these pixels without rerunning SVG filters.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = path.resolve(site, '../pebble-app');
const require = createRequire(path.join(app, 'package.json'));
const puppeteer = require('puppeteer-core'), sharp = require('sharp');
const rig = await fs.readFile(path.join(app, 'src/nivoRig.js'));
const body = await fs.readFile(path.join(app, 'src/assets/nivo_body.png'));
const frames = 9, size = 640;
const version = createHash('sha256').update(rig).update(body).update(`idle-v1:${frames}:${size}`).digest('hex').slice(0, 12);
const metadata = path.join(site, 'assets/deepsea-idle-data.js');
const output = path.join(site, 'assets/deepsea-idle.webp');
const existing = await fs.readFile(metadata, 'utf8').catch(() => '');
if (existing.includes(version) && await fs.stat(output).catch(() => false)) {
  console.log('Deep-Sea idle artwork is current.');
} else {
  const server = createServer((req, res) => {
    if (req.url === '/rig.js') { res.setHeader('Content-Type', 'text/javascript'); res.end(rig); }
    else if (req.url === '/body.png') { res.setHeader('Content-Type', 'image/png'); res.end(body); }
    else { res.setHeader('Content-Type', 'text/html'); res.end('<!doctype html><style>html,body{margin:0;background:transparent}#rig{width:640px;height:640px}svg{display:block;width:100%;height:100%;overflow:visible}</style><div id="rig"></div>'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.evaluate(async () => {
      const api = await import('/rig.js');
      const image = new Image(); image.src = '/body.png'; await image.decode();
      window.rig = api.createRig(document.querySelector('#rig'), '/body.png', 'deepsea-idle', 'Nivo', 'deepsea');
      window.neutral = api.neutralPose;
    });
    const tiles = [];
    for (let frame = 0; frame < frames; frame++) {
      await page.evaluate(blink => window.rig.render({ ...window.neutral(), blink }), frame / (frames - 1));
      tiles.push({ input: await page.screenshot({ omitBackground: true }), left: frame * size, top: 0 });
    }
    const image = await sharp({ create: { width: size * frames, height: size, channels: 4, background: '#00000000' } })
      .composite(tiles).webp({ quality: 92, alphaQuality: 100 }).toBuffer();
    await fs.writeFile(output, image);
    await fs.writeFile(metadata, `// Generated from the app's approved Deep-Sea rig.\nexport const deepseaIdle = ${JSON.stringify({ version, frames })};\n`);
    console.log(`Exported ${frames} Deep-Sea blink poses (${Math.round(image.length / 1024)} KB).`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
}
