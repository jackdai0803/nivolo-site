import { myths, powers, worlds, zh, price } from './mythic-catalog.js?v=20261111-mythic';
const section = document.querySelector('#mythic-edition');
if (section) {
  const copy = {
    en: { plusMyths:'Nine Plus-exclusive legends to unlock with Krill', edition:'The Mythic Edition', title:'Nine little legends.\nOne familiar face.', intro:'A little courage from Olympus. A little wonder from the Nile. Meet nine Nivos with worlds and powers of their own.', choose:'Choose your legend', access:`Plus-exclusive · ${price} Krill each`, includes:'Every unlock includes a Nivo look, matching app icon, and app world.', replay:'Replay power', pause:'Pause', play:'Play', day:'Day', night:'Midnight', retry:'Reload preview', error:'The preview could not load. Try again.', world:'A world of their own', hint:'Choose a legend to see their power.', open:'Explore the Mythic Edition', selected:' selected' },
    zh: { plusMyths:'九款 Plus 专属神话外观，使用磷虾解锁', edition:'神话系列', title:'九位小小传奇。\n一张熟悉的面孔。', intro:'来自奥林匹斯的一点勇气，来自尼罗河的一点奇妙。认识九位 Nivo，探索各自的世界与力量。', choose:'选择你的传奇', access:`Plus 专属 · 每款 ${price} 磷虾`, includes:'每次解锁都包含 Nivo 外观、配套应用图标与应用世界。', replay:'重播力量', pause:'暂停', play:'播放', day:'日间', night:'午夜', retry:'重新加载预览', error:'预览暂时无法加载，请重试。', world:'属于自己的世界', hint:'选择一位传奇，看看它的力量。', open:'探索神话系列', selected:'已选中' },
  };
  const cn = () => document.documentElement.lang.startsWith('zh');
  const t = key => copy[cn() ? 'zh' : 'en'][key];
  const translate = value => cn() ? zh[value] || value : value;
  const stage = section.querySelector('.myth-stage'), host = section.querySelector('.myth-nivo');
  const scenery = section.querySelector('.myth-scenery');
  const replay = section.querySelector('[data-myth-replay]'), pause = section.querySelector('[data-myth-pause]');
  const choices = [...section.querySelectorAll('[data-myth-choice]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let selected = myths[0], night = false, paused = false, visible = false, api, rig, loading, failed = false;
  let elapsed = 0, powerStart = 0, last = null, frame = 0, serial = 0;
  function text() {
    document.querySelectorAll('[data-myth-copy]').forEach(el => el.textContent = t(el.dataset.mythCopy));
    section.querySelector('.myth-name').textContent = cn() ? selected.zh : selected.name;
    section.querySelector('.myth-origin').textContent = translate(selected.origin);
    section.querySelector('.myth-role').textContent = translate(selected.role);
    section.querySelector('.myth-power-name').textContent = translate(powers[selected.id].name);
    section.querySelector('.myth-power-note').textContent = translate(powers[selected.id].description);
    section.querySelector('.myth-world-name').textContent = translate(worlds[selected.id].name);
    section.querySelector('.myth-world-note').textContent = translate(worlds[selected.id].note);
    section.querySelector('.myth-hint').textContent = failed ? t('error') : t('hint');
    replay.textContent = t(failed ? 'retry' : 'replay');
    pause.textContent = t(paused ? 'play' : 'pause');
    pause.setAttribute('aria-pressed', String(paused)); pause.hidden = reduced.matches;
    for (const button of choices) {
      const myth = myths.find(m => m.id === button.dataset.mythChoice);
      button.querySelector('span').textContent = cn() ? myth.zh : myth.name;
      button.setAttribute('aria-pressed', String(myth.id === selected.id));
    }
    for (const button of section.querySelectorAll('[data-myth-light]')) button.setAttribute('aria-pressed', String((button.dataset.mythLight === 'night') === night));
    stage.setAttribute('aria-label', `${cn() ? selected.zh : selected.name} · ${translate(worlds[selected.id].name)}`);
  }
  function draw() {
    if (!rig) return;
    const power = reduced.matches ? api.POWER_MS * .48 : powerStart === null ? null : elapsed - powerStart;
    const pose = reduced.matches ? api.neutralPose() : api.idleAt(elapsed);
    rig.render(pose, elapsed, !reduced.matches, power !== null && power <= api.POWER_MS ? power : null);
  }
  function tick(now) {
    frame = 0;
    if (last !== null) elapsed += Math.min(50, now - last);
    last = now; draw();
    if (visible && !document.hidden && !paused && !reduced.matches) frame = requestAnimationFrame(tick);
  }
  function resume() {
    cancelAnimationFrame(frame); frame = 0; last = null; draw();
    if (rig && visible && !document.hidden && !paused && !reduced.matches) frame = requestAnimationFrame(tick);
  }
  function world() { if (api) scenery.innerHTML = api.sceneArt(selected, `myth-world-${++serial}`, night, 'card'); }
  function select(id, announce = false) {
    selected = myths.find(m => m.id === id); elapsed = 0; powerStart = 0; paused = false;
    if (api) {
      rig = api.makeMyth(host, selected, `myth-nivo-${++serial}`);
      host.querySelector('svg').setAttribute('aria-hidden', 'true');
      stage.dataset.ready = 'true'; stage.dataset.myth = selected.id; world();
    }
    section.style.setProperty('--myth-accent', selected.accent);
    text(); resume();
    if (announce) section.querySelector('.myth-announcement').textContent = `${cn() ? selected.zh : selected.name}${t('selected')}`;
  }
  async function load() {
    if (api || loading) return loading;
    loading = (async () => {
      try {
        api = await import('./mythic-art.js?v=20261112-nivo-soft-edge');
        const image = new Image(); image.src = new URL('./nivo-body.png', import.meta.url); await image.decode();
        failed = false; select(selected.id);
        section.querySelectorAll('button').forEach(button => button.disabled = false);
      } catch { api = null; failed = true; replay.disabled = false; text(); }
      finally { loading = null; }
    })();
    return loading;
  }
  choices.forEach(button => button.addEventListener('click', () => select(button.dataset.mythChoice, true)));
  replay.addEventListener('click', () => { if (failed) { load(); return; } powerStart = elapsed; paused = false; text(); resume(); });
  pause.addEventListener('click', () => { paused = !paused; text(); resume(); });
  section.querySelectorAll('[data-myth-light]').forEach(button => button.addEventListener('click', () => { night = button.dataset.mythLight === 'night'; world(); text(); }));
  new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) load(); }, { rootMargin:'400px' }).observe(section);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); }).observe(stage);
  document.addEventListener('visibilitychange', resume);
  reduced.addEventListener('change', () => { text(); resume(); });
  window.addEventListener('pagehide', () => cancelAnimationFrame(frame));
  window.addEventListener('pageshow', resume);
  new MutationObserver(text).observe(document.documentElement, { attributes:true, attributeFilter:['lang'] });
  text();
}
