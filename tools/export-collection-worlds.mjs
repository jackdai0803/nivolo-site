// Capture the app's existing SeriesWorld component; no separate website drawing.
// Run with the app Vite dev server on 127.0.0.1:4199.
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {SERIES_WORLDS,NIVO_SERIES} from '../../pebble-app/src/series/catalog.js';
const site=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),app=path.resolve(site,'../pebble-app');
const require=createRequire(path.join(app,'package.json')),puppeteer=require('puppeteer-core');
const source=fs.readFileSync(path.join(app,'src/App.jsx'),'utf8');
const component=source.slice(source.indexOf('const SeriesWorld ='),source.indexOf('const iconUnlockCopy ='));
const entry=`import React,{useEffect,useRef,useMemo} from 'react';import{createRoot}from'react-dom/client';import{SERIES_WORLDS}from'/src/series/catalog.js';import{seriesSceneArt,hasRichSeriesWorld}from'/src/series/world-scenes.js';${component}\ncreateRoot(document.getElementById('root')).render(<>{Object.keys(SERIES_WORLDS).map(id=>[false,true].map(night=><div key={id+night} data-export-world={id} data-night={night}><SeriesWorld id={id} card night={night} paused/></div>))}</>);`;
fs.writeFileSync(path.join(app,'tmp/collection-world-export.jsx'),entry);
fs.writeFileSync(path.join(app,'tmp/collection-world-export.html'),'<!doctype html><div id="root"></div><script type="module" src="./collection-world-export.jsx"></script>');
const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try{const page=await browser.newPage();await page.goto('http://127.0.0.1:4199/tmp/collection-world-export.html',{waitUntil:'networkidle0'});await page.waitForSelector('[data-export-world] svg');const output=await page.evaluate(()=>[...document.querySelectorAll('[data-export-world]')].map(el=>{const svg=el.querySelector('svg').cloneNode(true),world=el.querySelector('.series-world');svg.setAttribute('xmlns','http://www.w3.org/2000/svg');svg.setAttribute('color',world.style.color);return{id:el.dataset.exportWorld,night:el.dataset.night==='true',illustrated:world.dataset.scene==='illustrated',svg:svg.outerHTML}}));const dir=path.join(site,'assets/collection-worlds');fs.mkdirSync(dir,{recursive:true});const ids=NIVO_SERIES.flatMap(s=>s.ids);for(const item of output.filter(item=>ids.includes(item.id))){const [a,b]=SERIES_WORLDS[item.id][item.night?'night':'day'];const backdrop=`<defs><linearGradient id="scene-backdrop" x2="1" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="270" fill="url(#scene-backdrop)" stroke="none"/>`;fs.writeFileSync(path.join(dir,`${item.id}-${item.night?'night':'day'}.svg`),item.illustrated?item.svg:item.svg.replace(/(<svg[^>]+>)/,'$1'+backdrop));}console.log(`Exported ${ids.length*2} app-derived collection scenes.`)}finally{await browser.close()}
