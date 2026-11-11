// Export the app's approved Mythic renderer, metadata, and icon previews.
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import fs from 'node:fs';
const site=resolve(dirname(fileURLToPath(import.meta.url)),'..'),app=resolve(site,'../pebble-app');
const {build}=await import(pathToFileURL(resolve(app,'node_modules/vite/dist/node/index.js')));
const {myths,powers,zh,MYTH_PRICE}=await import(pathToFileURL(resolve(app,'src/myths/catalog.js')));
const {worlds}=await import(pathToFileURL(resolve(app,'src/myths/scenes.js')));
fs.writeFileSync(resolve(site,'assets/mythic-catalog.js'),`// Generated from the app's approved Mythic collection.\nexport const myths=${JSON.stringify(myths)};\nexport const powers=${JSON.stringify(powers)};\nexport const worlds=${JSON.stringify(worlds)};\nexport const zh=${JSON.stringify(zh)};\nexport const price=${MYTH_PRICE};\n`);
fs.copyFileSync(resolve(app,'src/assets/appicons/classic.png'),resolve(site,'assets/mythic-classic-icon.png'));
await build({configFile:false,root:site,logLevel:'warn',plugins:[{
 name:'mythic-edition-export',enforce:'pre',
 resolveId(id){if(id.endsWith('website-mythic-art'))return '\0mythic-art';if(id.endsWith('/nivo_body.png'))return '\0mythic-body';if(id.endsWith('/appicons/classic.png'))return '\0mythic-icon';},
 load(id){if(id==='\0mythic-body')return 'export default new URL("./nivo-body.png",import.meta.url).href;';if(id==='\0mythic-icon')return 'export default new URL("./mythic-classic-icon.png",import.meta.url).href;';if(id==='\0mythic-art')return `export {makeMyth,mythIcon,POWER_MS} from ${JSON.stringify(resolve(app,'src/myths/art.js'))};export {sceneArt} from ${JSON.stringify(resolve(app,'src/myths/scenes.js'))};export {neutralPose,idleAt} from ${JSON.stringify(resolve(app,'src/nivoRig.js'))};`;}
}],build:{emptyOutDir:false,outDir:resolve(site,'assets'),minify:false,lib:{entry:'website-mythic-art',formats:['es'],fileName:()=> 'mythic-art.js'}}});
console.log('Exported nine Mythic looks, powers, and Home worlds.');
