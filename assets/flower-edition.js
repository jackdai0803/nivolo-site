const section=document.querySelector('#flower-edition');
if(section){
 const lang=()=>document.documentElement.lang.startsWith('zh')?'zh':'en';
 const copy={
  en:{edition:'The Flower Edition',title:'A little room to bloom.',intro:'Eleven flowers, eleven little worlds. A new collection inspired by the beauty of Chinese gardens.',soon:'Eleven looks · One little companion',matching:'A Nivo look.\nA matching icon.\nA world of its own.',availability:'Eight editions to collect with Krill. White Lotus, Tree Peony and Red Spider Lily are included with active Nivolo Plus.',lighting:'Scene lighting',day:'Day',midnight:'Midnight',pause:'Pause Nivo',resume:'Resume Nivo',hint:'Find a flower that feels like you.',choose:'Explore all eleven'},
  zh:{edition:'花卉系列',title:'留一点空间，让美好盛开。',intro:'十一种花，十一个小世界。灵感来自中式花园之美的新系列。',soon:'十一种外观 · 同一位小伙伴',matching:'一款 Nivo。\n一枚专属图标。\n一个自己的小世界。',availability:'八款花卉可用磷虾解锁。白荷、牡丹和彼岸花在 Nivolo Plus 会员有效期内专属。',lighting:'场景光线',day:'白昼',midnight:'午夜',pause:'暂停 Nivo',resume:'继续 Nivo',hint:'找到与你心意相通的那朵花。',choose:'探索十一种花'}
 };
 const stories={
  'plum-blossom':['Plum Blossom in Snow','雪中梅花','Pink blossoms, winter blue, and a first dusting of snow.','粉梅、冰蓝，与初落的一层薄雪。'],
  jasmine:['Jasmine Morning','茉莉清晨','Little white flowers climbing toward the morning light.','小小白花，沿着晨光攀上花架。'],
  camellia:['Camellia Garden','山茶庭院','Coral petals and glossy leaves in a quiet garden corner.','珊瑚色花瓣与油亮绿叶，开在安静的庭院一角。'],
  'white-lotus':['Moonlit Lotus','月下白荷','Ivory petals, still water, and a little moonlight.','象牙白的花瓣、静静的水面，与一点月光。'],
  'tree-peony':['Peony Courtyard','牡丹庭院','Full magenta blooms gathered around a moon gate.','丰盛的紫红牡丹，簇拥着一扇月洞门。'],
  magnolia:['Magnolia After Rain','雨后玉兰','Porcelain petals on pale branches, fresh after the rain.','淡色枝头的瓷白花瓣，带着雨后的清新。'],
  orchid:['Orchid Rain','幽兰听雨','Slender petals, ribbon leaves, and soft bamboo shadows.','纤细花瓣、修长叶片，与柔和竹影。'],
  osmanthus:['Osmanthus Moon','桂花秋月','Tiny golden flowers beneath a warm autumn moon.','细小金桂，映着一轮温暖秋月。'],
  crabapple:['Crabapple Dawn','海棠晓光','Hanging coral buds beside a lattice washed in dawn light.','垂落的珊瑚花苞，映着晨光中的花窗。'],
  peony:['Dew-kissed Peony','露润芍药','Open blush petals and golden hearts along a garden path.','浅粉花瓣与金色花心，沿园中小径舒展。'],
  'spider-lily':['Crimson Dusk','彼岸暮色','Fine crimson curls beside a river disappearing into mist.','纤长绯红花丝，伴着隐入薄雾的河流。']
 };
 const t=key=>copy[lang()][key];
 const stage=section.querySelector('.flower-stage'),nivo=section.querySelector('.flower-nivo'),scenery=section.querySelector('.flower-scenery');
 const choices=[...section.querySelectorAll('[data-flower-choice]')],themes=[...section.querySelectorAll('[data-flower-theme]')],pause=section.querySelector('.flower-pause');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let api,rig,selected='white-lotus',night=false,paused=false,visible=false,loading=false,frame=0,last=null,elapsed=0;
 function text(){
  document.querySelectorAll('[data-flower-copy]').forEach(el=>{el.textContent=t(el.dataset.flowerCopy);});
  section.querySelector('[data-flower-label]').setAttribute('aria-label',t('lighting'));
  const story=stories[selected],zh=lang()==='zh';
  section.querySelector('.flower-selected-name').textContent=story[zh?1:0];
  section.querySelector('.flower-selected-note').textContent=story[zh?3:2];
  section.querySelector('.flower-selected-zh').textContent=choices.find(b=>b.dataset.flowerChoice===selected).querySelector('.flower-choice-zh').textContent;
  pause.textContent=t(paused?'resume':'pause');pause.setAttribute('aria-pressed',String(paused));
  pause.hidden=reduced.matches;
  for(const b of choices){const id=b.dataset.flowerChoice;b.setAttribute('aria-pressed',String(id===selected));b.setAttribute('aria-label',zh?b.querySelector('.flower-choice-zh').textContent:b.querySelector('.flower-choice-name').textContent);}
  stage.setAttribute('aria-label',`${story[zh?1:0]}. ${story[zh?3:2]}`);
 }
 function draw(){if(rig)rig.render(!paused&&!reduced.matches?api.idleAt(elapsed):api.neutralPose(),elapsed,!paused&&!reduced.matches);}
 function tick(now){frame=0;if(last!==null)elapsed+=Math.min(now-last,50);last=now;draw();if(visible&&!document.hidden&&!paused&&!reduced.matches)frame=requestAnimationFrame(tick);}
 function resume(){cancelAnimationFrame(frame);frame=0;last=null;draw();if(rig&&visible&&!document.hidden&&!paused&&!reduced.matches)frame=requestAnimationFrame(tick);}
 function render(announce=false){
  if(!api)return;
  const f=api.flowers.find(f=>f.id===selected);
  scenery.innerHTML=api.sceneArt(f,'website-flower-scene',night,'card');
  nivo.replaceChildren();rig=api.makeFlower(nivo,f,'website-flower-nivo');
  section.querySelector('.flower-matching img').src=`assets/flowers/${selected}-icon.webp?v=20261109`;
  for(const b of themes)b.setAttribute('aria-pressed',String((b.dataset.flowerTheme==='midnight')===night));
  text();stage.dataset.ready='';resume();
  if(announce)section.querySelector('.flower-announcement').textContent=`${stories[selected][lang()==='zh'?1:0]} · ${t(night?'midnight':'day')}`;
 }
 async function load(){
  if(api||loading)return;loading=true;
  try{
   api=await import('./flower-art.js?v=3');
   const image=new Image();image.src=new URL('./nivo-body.png',import.meta.url).href;await image.decode();
   render();choices.forEach(b=>b.disabled=false);section.querySelector('.flower-controls').hidden=false;
  }catch{api=null;}finally{loading=false;}
 }
 choices.forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.flowerChoice;elapsed=0;render(true);}));
 themes.forEach(b=>b.addEventListener('click',()=>{night=b.dataset.flowerTheme==='midnight';render(true);}));
 pause.addEventListener('click',()=>{paused=!paused;text();resume();});
 const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)load();resume();},{rootMargin:'120px'});observer.observe(section);
 reduced.addEventListener('change',()=>{text();resume();});
 document.addEventListener('visibilitychange',resume);
 window.addEventListener('pagehide',()=>cancelAnimationFrame(frame));window.addEventListener('pageshow',resume);
 new MutationObserver(()=>text()).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 text();
}
