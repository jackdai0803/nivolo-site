import {collections} from './nivo-collections.js?v=20261111-mythic';
import {chapters,looks,destinations} from './collection-chapters-data.js?v=20261111-chapters';
import {unlocks,worlds} from './collection-unlocks.js?v=20261111-chapters';
import {idleAt,neutralPose} from './nivo-rig.js?v=20261110-mascot-size';
const cn=()=>document.documentElement.lang.startsWith('zh');
const copy={
 en:{eyebrow:'One little companion. Many little worlds.',title:'Find your Nivo.',intro:'Choose a collection. Find a little world that feels like you.',all:'All Nivo collections',matching:'Nivo + matching app icon',day:'Day',night:'Midnight',pause:'Pause Nivo',play:'Play Nivo',inspect:'Explore icon ↗',retry:'Reload preview',error:'The preview could not load. Try again.',back:'All collections ↑',terms:'Any paid membership counts. Free trials and launch-list signups do not reserve a place.',choose:'Choose a Nivo',selected:' selected',free:'Yours from the start',plus:'Included with Nivolo Plus',krill:'{n} Krill',streak:'{n}-day streak',goal:'Complete a goal',freeze:'Use a streak freeze',comeback:'Return after a break',early:'Log before 8 AM',nightUnlock:'Log after midnight',bigday:'5 actions in one day',count:'{n} actions total',supporter:'For the first 20 paying members'},
 zh:{eyebrow:'同一位小伙伴，各自的小天地。',title:'找到你的 Nivo。',intro:'选择一个系列，找到与你心意相通的小天地。',all:'所有 Nivo 系列',matching:'Nivo 与配套应用图标',day:'日间',night:'午夜',pause:'暂停 Nivo',play:'播放 Nivo',inspect:'探索图标 ↗',retry:'重新加载预览',error:'预览暂时无法加载，请重试。',back:'所有系列 ↑',terms:'任何付费会员方案均可。免费试用与加入上线通知名单不占名额。',choose:'选择 Nivo',selected:'已选中',free:'从一开始就属于你',plus:'Nivolo Plus 会员包含',krill:'{n} 磷虾',streak:'连续记录 {n} 天',goal:'完成一个目标',freeze:'使用一次连续记录保护',comeback:'休息后重新开始',early:'上午 8 点前记录',nightUnlock:'午夜后记录',bigday:'一天内记录 5 次行动',count:'累计 {n} 次行动',supporter:'献给最初 20 位付费会员'}
};
const t=(key,n)=>copy[cn()?'zh':'en'][key]?.replace('{n}',n) || key;
const icon=id=>`assets/icons/${id}.png?v=20261110-classic-eyes`;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let rendererPromise;
function renderer(){return rendererPromise ||= import('./nivo-skins.js?v=20261110-sick-care').catch(error=>{rendererPromise=null;throw error})}
const controllers=new Map();let serial=0;
function overviewText(){document.querySelectorAll('[data-overview-copy]').forEach(el=>el.textContent=t(el.dataset.overviewCopy));document.querySelector('.collection-directory')?.setAttribute('aria-label',t('all'));document.querySelectorAll('[data-collection-link]').forEach(el=>{const group=collections.find(c=>c.id===el.dataset.collectionLink);el.querySelector('strong').textContent=cn()?group.zh:group.name;el.querySelector('small').textContent=cn()?`${group.ids.length} 款外观`:`${group.ids.length} ${group.ids.length===1?'look':'looks'}`})}
for(const section of document.querySelectorAll('[data-chapter]')){
 const group=collections.find(c=>c.id===section.dataset.chapter),data=chapters[group.id];
 const stage=section.querySelector('.chapter-stage'),host=section.querySelector('.chapter-nivo'),background=section.querySelector('.chapter-world'),pause=section.querySelector('[data-chapter-pause]'),inspect=section.querySelector('.chapter-inspect');
 const buttons=[...section.querySelectorAll('[data-chapter-choice]')];
 let selected=data.representative,night=false,paused=false,visible=false,api,rig,loading,failed=false,elapsed=0,previous=null,frame=0;
 function text(){
  section.querySelectorAll('[data-chapter-copy]').forEach(el=>{const key=el.dataset.chapterCopy;el.textContent=key==='collection'?(cn()?group.zh:group.name):['title','intro'].includes(key)?data[key][cn()?1:0]:t(key)});
  const look=looks[selected],name=look[cn()?1:0];stage.setAttribute('aria-label',`${name} Nivo`);
  section.querySelector('.chapter-identity h3').textContent=name;section.querySelector('.chapter-identity img').src=icon(selected);
  section.querySelector('.chapter-note').textContent=failed?t('error'):look[cn()?3:2];
  const unlock=unlocks[selected];section.querySelector('.chapter-access').textContent=unlock?t(unlock.type==='night'?'nightUnlock':unlock.type,unlock.n):t('supporter');
  buttons.forEach(button=>{button.querySelector('span').textContent=looks[button.dataset.chapterChoice][cn()?1:0];button.setAttribute('aria-pressed',String(selected===button.dataset.chapterChoice))});
  section.querySelector('.chapter-picker').setAttribute('aria-label',t('choose'));
  pause.textContent=t(paused?'play':'pause');pause.setAttribute('aria-pressed',String(paused));pause.hidden=reduced.matches;
  inspect.textContent=t(failed?'retry':'inspect');
  section.querySelectorAll('[data-chapter-light]').forEach(button=>button.setAttribute('aria-pressed',String((button.dataset.chapterLight==='night')===night)));
 }
 function draw(){if(!rig)return;const pose=reduced.matches?neutralPose():idleAt(elapsed);pose.skinTimeMs=elapsed;pose.skinMotion=!reduced.matches;rig.render(pose)}
 function tick(now){frame=0;if(previous!==null)elapsed+=Math.min(50,now-previous);previous=now;draw();if(visible&&!paused&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(tick)}
 function resume(){cancelAnimationFrame(frame);frame=0;previous=null;draw();if(rig&&visible&&!paused&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(tick)}
 function world(){stage.dataset.look=selected;stage.dataset.night=String(night);const world=worlds[selected];background.hidden=!world;if(world)background.src=`assets/collection-worlds/${selected}-${night?'night':'day'}.svg?v=20261111-chapters`;const colors=world?.[night?'night':'day'] || (selected==='deepsea'?(night?['#10223e','#194367']:['#c9e9ed','#6d9eaf']):selected==='early-supporter'?(night?['#342c31','#66513f']:['#f4e8c8','#dcc996']):(night?['#1c3045','#46627b']:['#e4eff5','#c7dde5']));stage.style.setProperty('--scene-top',colors[0]);stage.style.setProperty('--scene-bottom',colors[1])}
 function select(id,announce=false){if(!group.ids.includes(id))return;selected=id;elapsed=0;if(api){rig=api.makeClassicSkin(host,{id},`chapter-nivo-${++serial}`);host.querySelector('svg').setAttribute('aria-hidden','true');stage.dataset.ready='true'}world();text();resume();if(announce)section.querySelector('.chapter-announcement').textContent=looks[id][cn()?1:0]+t('selected')}
 async function load(){if(api)return;if(loading)return loading;loading=(async()=>{try{const module=await renderer();const image=new Image();image.src=new URL('./nivo-body.png',import.meta.url);await image.decode();api=module;failed=false;select(selected);section.querySelectorAll('button').forEach(b=>b.disabled=false)}catch{failed=true;inspect.disabled=false;text()}finally{loading=null}})();return loading}
 buttons.forEach(button=>button.addEventListener('click',()=>select(button.dataset.chapterChoice,true)));
 pause.addEventListener('click',()=>{paused=!paused;text();resume()});
 section.querySelectorAll('[data-chapter-light]').forEach(button=>button.addEventListener('click',()=>{night=button.dataset.chapterLight==='night';world();text()}));
 inspect.addEventListener('click',()=>{if(failed){load();return}document.dispatchEvent(new CustomEvent('nivo-icon-inspect',{detail:{id:selected,name:looks[selected][cn()?1:0],story:looks[selected][cn()?3:2]}}))});
 new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))load()},{rootMargin:'350px'}).observe(section);
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;resume()}).observe(stage);
 document.addEventListener('visibilitychange',resume);window.addEventListener('pagehide',()=>cancelAnimationFrame(frame));window.addEventListener('pageshow',resume);reduced.addEventListener('change',()=>{text();resume()});
 controllers.set(group.id,{text,async reveal(id){section.scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});await load();select(id,true);buttons.find(b=>b.dataset.chapterChoice===id)?.focus({preventScroll:true})}});
 select(selected);
}
function reveal(id){const group=collections.find(c=>c.ids.includes(id));if(!group)return false;const controller=controllers.get(group.id);if(controller)controller.reveal(id);else document.getElementById(destinations[group.id])?.scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});return true}
document.addEventListener('nivo-look-select',event=>{if(reveal(event.detail.id))event.preventDefault()});
document.querySelector('.benefit-icon-preview')?.addEventListener('click',event=>{if(!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey){event.preventDefault();reveal('snowy')}});
new MutationObserver(()=>{overviewText();controllers.forEach(c=>c.text())}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});overviewText();
