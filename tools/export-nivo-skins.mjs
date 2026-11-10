// Snapshot only current production Nivo looks; icon IDs and names come from the app.
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const app = resolve(site, '../pebble-app');
const { build } = await import(pathToFileURL(resolve(app, 'node_modules/vite/dist/node/index.js')));
const { hasSeriesWorld } = await import(pathToFileURL(resolve(app, 'src/series/catalog.js')));
const source = readFileSync(resolve(app, 'src/App.jsx'), 'utf8').split('const MASCOT_ICON_LOOKS')[0];
const looks = [...source.matchAll(/\{ id: "([^"]+)",\s*name: "([^"]+)"[^\n]+/g)]
  .filter(match => !match[0].includes('retired: true'))
  .map(([, id, name]) => ({ id, name }))
  .filter(({ id }) => ['classic', 'deepsea', 'love', 'melting'].includes(id) || hasSeriesWorld(id));
const modulePath = file => JSON.stringify(resolve(app, 'src', file));
await build({ configFile: false, root: site, logLevel: 'warn', plugins: [{
  name: 'website-nivo-snapshot', enforce: 'pre',
  resolveId(id) {
    if (id.endsWith('website-nivo-skins')) return '\0website-nivo-skins';
    if (id.endsWith('/nivo_body.png')) return '\0nivo-body';
  },
  load(id) {
    if (id === '\0nivo-body') return 'export default new URL("./nivo-body.png", import.meta.url).href;';
    if (id === '\0website-nivo-skins') return `
      import { createRig } from ${modulePath('nivoRig.js')};
      import { makeSeriesSkin } from ${modulePath('series/renderer.js')};
      import { hasSeriesWorld } from ${modulePath('series/catalog.js')};
      import { hasIconSkinArtwork, mountNivoIconSkin, nivoIconSkinPose } from ${modulePath('nivoIconSkins.js')};
      import { applySnowyArtwork, createSnowyMotion, snowyShiver } from ${modulePath('nivoSnowy.js')};
      import body from ${modulePath('assets/nivo_body.png')};
      export const heroLooks = ${JSON.stringify(looks)};
      export function makeClassicSkin(host, look, uid) {
        const id = look.id;
        if (hasSeriesWorld(id) && id !== 'snowy' && !hasIconSkinArtwork(id)) {
          const rig = makeSeriesSkin(host, id, uid);
          return { render(pose) { rig.render({ ...pose, reacting: !!pose.skinReacting }, pose.skinTimeMs || 0, !!pose.skinMotion); } };
        }
        const rig = createRig(host, body, uid, 'Nivo', id);
        const svg = host.querySelector('svg');
        if (id === 'melting') svg.setAttribute('viewBox', '85 85 1120 1140');
        let motion;
        if (id === 'snowy') { applySnowyArtwork(svg, uid); motion = createSnowyMotion(svg); }
        else if (hasIconSkinArtwork(id)) motion = mountNivoIconSkin(svg, uid, id);
        return { render(pose) {
          const time = pose.skinTimeMs || 0;
          const animate = !!pose.skinMotion && !pose.peek;
          if (animate && !pose.skinReacting) {
            if (id === 'snowy') pose = snowyShiver(pose, time);
            else if (motion) pose = nivoIconSkinPose(id, pose, time);
          }
          rig.render(pose);
          motion?.(time, animate, pose.peek);
        } };
      }`;
  }
}], build: { emptyOutDir: false, outDir: resolve(site, 'assets'), minify: false,
 lib: { entry: 'website-nivo-skins', formats: ['es'], fileName: () => 'nivo-skins.js' } } });
console.log(`Exported ${looks.length} current production looks.`);
