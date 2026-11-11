// Keep website availability and worlds tied to the app's catalog.
import fs from 'node:fs';
import {SERIES_WORLDS} from '../../pebble-app/src/series/catalog.js';
const source=fs.readFileSync(new URL('../../pebble-app/src/App.jsx',import.meta.url),'utf8');
const names=[...source.matchAll(/^import (appIcon\w+) from /gm)].map(m=>m[1]);
const blocks=['APP_ICONS','MOOD_ICONS','COLLECTOR_ICONS'].map(name=>source.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\n\\];`))?.[0]);
if(blocks.some(b=>!b))throw Error('App icon catalog moved; inspect before exporting.');
const icons=new Function(`${names.map(n=>`const ${n}=null;`).join('')} ${blocks.join('\n')} return [...APP_ICONS,...MOOD_ICONS,...COLLECTOR_ICONS];`)().filter(i=>!i.retired).map(({id,unlock})=>({id,unlock}));
fs.writeFileSync(new URL('../assets/collection-unlocks.js',import.meta.url),`// Generated from App.jsx and the shared series catalog.\nexport const unlocks=${JSON.stringify(Object.fromEntries(icons.map(i=>[i.id,i.unlock])))};\nexport const worlds=${JSON.stringify(SERIES_WORLDS)};\n`);
