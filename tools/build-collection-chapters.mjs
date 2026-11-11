// Static markup keeps all nine chapters readable before their previews load.
import fs from 'node:fs';
import {collections} from '../assets/nivo-collections.js';
import {chapters,looks,destinations} from '../assets/collection-chapters-data.js';
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const icon=id=>`assets/icons/${id}.png?v=20261110-classic-eyes`;
const representative=group=>chapters[group.id]?.representative || {mythic:'anubis',flowers:'white-lotus'}[group.id];
const overview=`<article class="collection-overview" id="nivo-looks" aria-labelledby="collection-overview-title">
  <header id="collection"><p class="collection-overview-eyebrow" data-overview-copy="eyebrow">One little companion. Many little worlds.</p><h2 id="collection-overview-title" data-overview-copy="title">Find your Nivo.</h2><p data-overview-copy="intro">Choose a collection. Find a little world that feels like you.</p></header>
  <div class="collection-directory" role="navigation" aria-label="Nivo collections">${collections.map(group=>{const id=representative(group),src=group.id==='mythic'?`assets/myths/${id}-icon.webp?v=20261111`:group.id==='flowers'?`assets/flowers/${id}-icon.webp?v=20261109`:icon(id);return`<a class="collection-link" href="#${destinations[group.id]}" data-collection-link="${group.id}"><img src="${src}" width="64" height="64" alt="" loading="lazy"/><span><strong>${escape(group.name)}</strong><small>${group.ids.length} ${group.ids.length===1?'look':'looks'}</small></span><span class="collection-link-arrow" aria-hidden="true">↗</span></a>`}).join('\n')}</div>
</article>`;
function chapter(group){const data=chapters[group.id],id=data.representative,look=looks[id],destination=destinations[group.id];return `<section class="collection-chapter section" id="${destination}" data-chapter="${group.id}" style="--chapter-paper:${data.color};--chapter-accent:${data.accent}" aria-labelledby="${destination}-title">
  <div class="wrap">
    <header class="chapter-heading"><p class="chapter-eyebrow" data-chapter-copy="collection">${escape(group.name)}</p><h2 id="${destination}-title" data-chapter-copy="title">${escape(data.title[0])}</h2><p data-chapter-copy="intro">${escape(data.intro[0])}</p></header>
    <div class="chapter-feature">
      <div class="chapter-showcase"><div class="chapter-stage" data-look="${id}" data-night="false" id="${destination}-stage" role="img" aria-label="${escape(look[0])} Nivo"><img class="chapter-world" alt="" hidden/><img class="chapter-fallback" src="${icon(id)}" width="256" height="256" alt="" loading="lazy"/><div class="chapter-nivo" aria-hidden="true"></div></div>
      <div class="chapter-toolbar"><div class="chapter-light"><button type="button" data-chapter-light="day" data-chapter-copy="day" aria-pressed="true" disabled>Day</button><button type="button" data-chapter-light="night" data-chapter-copy="night" aria-pressed="false" disabled>Midnight</button></div><button type="button" class="chapter-pause btn-moonlit btn-moonlit--quiet" data-chapter-pause aria-pressed="false" disabled>Pause Nivo</button></div></div>
      <div class="chapter-story"><p class="chapter-access"></p><div class="chapter-identity"><img src="${icon(id)}" width="64" height="64" alt="" loading="lazy"/><div><small data-chapter-copy="matching">Nivo + matching app icon</small><h3>${escape(look[0])}</h3></div></div><p class="chapter-note">${escape(look[2])}</p><div class="chapter-picker" role="group" aria-label="Choose a Nivo">${group.ids.map(lookId=>`<button type="button" class="chapter-choice" data-chapter-choice="${lookId}" aria-pressed="${lookId===id}" aria-controls="${destination}-stage" disabled><img src="${icon(lookId)}" width="64" height="64" alt="" loading="lazy"/><span>${escape(looks[lookId][0])}</span></button>`).join('\n')}</div><button type="button" class="chapter-inspect" disabled>Explore icon ↗</button>${group.id==='supporters'?'<p class="chapter-terms" data-chapter-copy="terms">Any paid membership counts. Free trials and launch-list signups do not reserve a place.</p>':''}</div>
    </div><p class="chapter-announcement sr-only" aria-live="polite" aria-atomic="true"></p>
    <a class="chapter-back" href="#collection" data-chapter-copy="back">All collections ↑</a>
  </div>
</section>`;}
const file=new URL('../index.html',import.meta.url);let html=fs.readFileSync(file,'utf8');
const replace=(tag,content)=>{const pattern=new RegExp(`<!-- ${tag}:start -->[\\s\\S]*?<!-- ${tag}:end -->`);if(!pattern.test(html))throw Error(`Missing ${tag} markers`);html=html.replace(pattern,`<!-- ${tag}:start -->\n${content}\n<!-- ${tag}:end -->`)};
replace('collection-overview',overview);replace('collection-chapters',collections.filter(c=>chapters[c.id]&&c.id!=='supporters').map(chapter).join('\n'));replace('supporter-chapter',chapter(collections.find(c=>c.id==='supporters')));
fs.writeFileSync(file,html);console.log('Built compact directory and seven collection chapters.');
