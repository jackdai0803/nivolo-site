// Export the approved flower artwork through its existing Classic rig.
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const site=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const app=resolve(site,'../pebble-app');
const {build}=await import(pathToFileURL(resolve(app,'node_modules/vite/dist/node/index.js')));
await build({configFile:false,root:site,logLevel:'warn',plugins:[{
 name:'flower-edition-snapshot',enforce:'pre',
 resolveId(id){if(id.endsWith('website-flower-art'))return '\0flower-art';if(id.endsWith('/nivo_body.png'))return '\0flower-body';},
 load(id){if(id==='\0flower-body')return 'export default new URL("./nivo-body.png",import.meta.url).href;';if(id==='\0flower-art')return `export {flowers,makeFlower} from ${JSON.stringify(resolve(app,'src/flowers/art.js'))};export {sceneArt} from ${JSON.stringify(resolve(app,'src/flowers/scenes.js'))};export {neutralPose,idleAt} from ${JSON.stringify(resolve(app,'src/nivoRig.js'))};`;}
}],build:{emptyOutDir:false,outDir:resolve(site,'assets'),minify:false,lib:{entry:'website-flower-art',formats:['es'],fileName:()=> 'flower-art.js'}}});
console.log('Exported the eleven flower editions and their scene renderer.');
