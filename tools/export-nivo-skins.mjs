// Snapshot the existing Classic-based collection for the static website.
// Run from nivolo-site with ../pebble-app available; no runtime app dependency.
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const app = resolve(site, '../pebble-app');
const { build } = await import(pathToFileURL(resolve(app, 'node_modules/vite/dist/node/index.js')));
const catalogue = readFileSync(resolve(app, 'design/nivo-icon-skins/skins.js'), 'utf8');
const looks = [...catalogue.matchAll(/^ \['([^']+)','([^']+)'/gm)]
  .map(([, id, name]) => ({ id, name }))
  .filter(({ id }) => existsSync(resolve(app, `src/assets/appicons/${id}.png`)));
await build({
  configFile: false,
  root: site,
  logLevel: 'warn',
  plugins: [{
    name: 'website-nivo-snapshot',
    enforce: 'pre',
    resolveId(id) {
      if (id.endsWith('website-nivo-skins')) return '\0website-nivo-skins';
      if (id.endsWith('/nivo_body.png')) return '\0nivo-body';
      if (id.endsWith('/nivo_deepsea.png')) return '\0nivo-deepsea';
    },
    load(id) {
      if (id === '\0nivo-body') return 'export default new URL("./nivo-body.png", import.meta.url).href;';
      if (id === '\0nivo-deepsea') return 'export default new URL("./nivo-deepsea.webp", import.meta.url).href;';
      if (id === '\0website-nivo-skins') return `export { makeClassicSkin } from ${JSON.stringify(resolve(app, 'design/nivo-icon-skins/classic-skins.js'))};\nexport const heroLooks = ${JSON.stringify(looks)};`;
    },
  }],
  build: {
    emptyOutDir: false,
    outDir: resolve(site, 'assets'),
    minify: false,
    lib: { entry: 'website-nivo-skins', formats: ['es'], fileName: () => 'nivo-skins.js' },
  },
});
console.log(`Exported ${looks.length} existing icon looks to assets/nivo-skins.js`);
