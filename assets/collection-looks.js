import { idleAt, neutralPose } from './nivo-rig.js?v=20261110-mascot-size';

const section = document.querySelector('#nivo-looks');
if (section) {
  const copy = {
    en: { viewSnowy: 'Meet Snowy Nivo', eyebrow: 'One little companion. Many sides.', title: 'Find your Nivo.', intro: 'Choose an icon. Meet the little character behind it.', matching: 'Nivo + matching app icon', inspect: 'Explore icon ↗', pause: 'Pause Nivo', resume: 'Resume Nivo', swipe: 'Swipe to explore more looks →', choose: 'Choose a Nivo look', selected: '{name} selected', retry: 'Reload preview', unavailable: 'The preview could not load. Tap to try again.' },
    zh: { viewSnowy: '认识雪花 Nivo', eyebrow: '同一位小伙伴，不一样的小个性。', title: '找到你的 Nivo。', intro: '选一枚图标，认识它背后的小伙伴。', matching: 'Nivo 与相配的应用图标', inspect: '探索图标 ↗', pause: '暂停 Nivo', resume: '继续 Nivo', swipe: '滑动探索更多外观 →', choose: '选择 Nivo 外观', selected: '已选择{name}', retry: '重新加载预览', unavailable: '预览暂时未能加载，轻点重试。' },
  };
  // IDs match the production app. Only looks with an approved mascot are selectable.
  const looks = {
    classic: ['Classic', '经典', 'Your first Nivo. A familiar face for every small beginning.', '你的第一位 Nivo，陪伴每一个小小的开始。', '#e2edf2'],
    deepsea: ['Deep-Sea', '深海', 'A little ocean light. The same companion, with his own deep-sea glow.', '一点海洋微光。熟悉的小伙伴，带着独有的深海光芒。', '#263e70'],
    grumpy: ['Grumpy', '气鼓鼓', 'Some mornings the habit wins and the mood doesn\'t. He turns up anyway, and he\'d like that noted.', '有些早晨习惯赢了，心情没赢。他照样出现，而且希望这一点被记下来。', '#f3e4e9'],
    snowy: ['Snowy', '雪花', 'Arrives after your first proper week. Nivo swears it always snows right before something starts to stick.', '在你完整坚持一周之后到来。Nivo 坚称，事情快要成形之前总会下雪。', '#e0f2fc'],
    blaze: ['Blaze', '烈焰', 'Carried up out of the old fire under the ice. It finds the ones who don\'t cool off.', '从冰层底下那团旧火里带上来的。它只找那些不会冷下来的人。', '#ffe7ce'],
    party: ['Party', '派对', 'He\'s held that confetti since the day you set the goal. Finishing it opens his hands.', '从你定下目标那天起，那把彩纸就攥在他手里。完成目标，他才松手。', '#eee2fc'],
    melting: ['Melting', '融化', 'The face of a streak that nearly went. A freeze went off in the night, and he\'s still dripping with relief.', '差点断掉的连续记录留下的表情。冻结在夜里生效了，他现在还在后怕地滴水。', '#fae7dc'],
    ghost: ['Ghost', '小幽灵', 'A long stretch of quiet, faithful days leaves something behind.', '一长段安静而忠实的日子，总会留下点什么。', '#e8ecf8'],
    gold: ['Pearl', '珍珠', 'Fifty days of showing up. A little pearl, with all that quiet effort inside.', '坚持了五十天。一颗小珍珠，藏着每一天安静的努力。', '#f5eaf2'],
    glitch: ['Glitch', '故障', 'You went so far the ice started skipping. Almost nobody sees this one.', '你走得太远，冰面开始跳帧。几乎没人见过这一枚。', '#eee7f8'],
    porcelain: ['Porcelain', '青花瓷', 'Cobalt blossoms and a gently swaying hairpin.', '青花绽放，发簪轻轻摇曳。', '#edf5fe'],
    jade: ['Jade', '翡翠', 'Flowing jade bands and a slow, calming breath.', '流动的翡翠纹路，伴着缓缓的呼吸。', '#e2efe5'],
    kintsugi: ['Kintsugi', '金缮', 'Quiet golden glints. Every repair belongs to the story.', '安静闪烁的金光，每一道修补都是故事的一部分。', '#eee9df'],
    relieved: ['Relieved', '松口气', 'The exhale that comes a few mornings in, when showing up stops feeling like a decision.', '坚持几天之后的那口气 —— 出现这件事，不再需要下决心了。', '#e5f0e8'],
    focused: ['Focused', '专注', 'Nothing exists but the next small thing. Nivo is extremely busy and would rather not be disturbed.', '世界只剩下手边这一件小事。Nivo 非常忙，暂时不想被打扰。', '#e4edfc'],
    love: ['Love', '爱心', 'Somewhere in that first week a habit stops being a chore and starts being yours. He felt it before you did.', '第一周的某个瞬间，习惯不再是任务，而变成了你自己的东西。他比你先察觉。', '#f7e3ee'],
    starstruck: ['Starstruck', '星星眼', 'He looked at what you\'d built and forgot how to blink.', '他看着你做出来的东西，忘了怎么眨眼。', '#f4e5ed'],
    champion: ['Champion', '冠军', 'There\'s a shelf in the ice for the very consistent. He won\'t come down.', '冰上有一块只留给极度稳定者的高台。他不打算下来。', '#e1eef0'],
    sleepy: ['Sleepy', '困困', 'Caught before sunrise. He didn\'t think anyone else was up either.', '在日出前被逮到。他也没想到还有别人醒着。', '#eceafa'],
    rainy: ['Rainy', '雨天', 'Grey days count double. This one\'s for the people who showed up anyway.', '灰暗的日子算双份。这一枚献给照样出现的人。', '#e2edf0'],
  };
  const zh = () => document.documentElement.lang.startsWith('zh');
  const t = (key, name = '') => copy[zh() ? 'zh' : 'en'][key].replace('{name}', name);
  const name = () => looks[selected][zh() ? 1 : 0];
  const story = () => looks[selected][zh() ? 3 : 2];
  const buttons = [...section.querySelectorAll('[data-look]')];
  const preview = section.querySelector('.look-preview');
  const host = section.querySelector('.look-mascot');
  const pause = section.querySelector('.look-pause');
  const inspect = section.querySelector('.look-inspect');
  const snowyLink = document.querySelector('.benefit-icon-preview');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let api, loading, selected = 'classic', paused = false, visible = false, frame = 0, previous = null, elapsed = 0, serial = 0, failed = false;
  let layers = [], transitionStart = 0;

  function text() {
    section.querySelectorAll('[data-look-copy]').forEach(el => { el.textContent = t(el.dataset.lookCopy); });
    snowyLink?.setAttribute('aria-label', t('viewSnowy'));
    section.querySelector('.look-name').textContent = name();
    section.querySelector('.look-note').textContent = failed ? t('unavailable') : story();
    section.querySelector('.look-stage').setAttribute('aria-label', `${name()} Nivo`);
    section.querySelector('.look-choices').setAttribute('aria-label', t('choose'));
    pause.textContent = t(paused ? 'resume' : 'pause');
    pause.setAttribute('aria-pressed', String(paused));
    pause.hidden = !api || reduced.matches;
    inspect.textContent = t(failed ? 'retry' : 'inspect');
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.look === selected));
      button.querySelector('span').textContent = looks[button.dataset.look][zh() ? 1 : 0];
    });
  }
  function draw(now) {
    const moving = visible && !document.hidden && !paused && !reduced.matches;
    const blend = reduced.matches || paused ? 1 : Math.min(1, (now - transitionStart) / 220);
    const pose = moving ? idleAt(elapsed) : neutralPose();
    pose.skinTimeMs = elapsed;
    pose.skinMotion = moving;
    for (const layer of layers) {
      layer.opacity = layer.from + ((layer.id === selected ? 1 : 0) - layer.from) * blend;
      layer.node.style.opacity = String(layer.opacity);
      layer.rig.render(pose);
    }
    layers = layers.filter(layer => {
      if (blend === 1 && layer.id !== selected) { layer.node.remove(); return false; }
      return true;
    });
  }
  function tick(now) {
    frame = 0;
    if (previous !== null) elapsed += Math.min(50, now - previous);
    previous = now;
    draw(now);
    if (visible && !document.hidden && !paused && !reduced.matches) frame = requestAnimationFrame(tick);
  }
  function resume() {
    cancelAnimationFrame(frame); frame = 0; previous = null;
    draw(performance.now());
    if (api && visible && !document.hidden && !paused && !reduced.matches) frame = requestAnimationFrame(tick);
  }
  function select(id, announce = false) {
    if (!api || !looks[id]) return;
    if (id === 'focused' && selected !== id) elapsed = 0;
    selected = id;
    if (!layers.some(layer => layer.id === id)) {
      const node = document.createElement('div'); node.className = 'look-layer'; node.dataset.lookLayer = id;
      const rig = api.makeClassicSkin(node, { id }, `collection-nivo-${++serial}`);
      node.querySelector('svg').setAttribute('aria-hidden', 'true');
      if (!layers.length) host.replaceChildren();
      host.append(node);
      layers.push({ id, node, rig, opacity: layers.length ? 0 : 1, from: 0 });
    }
    // Retarget from each visible opacity so rapid selections remain interruptible.
    for (const layer of layers) layer.from = layer.opacity;
    transitionStart = performance.now();
    preview.dataset.selectedLook = id;
    preview.style.setProperty('--look-tint', looks[id][4]);
    section.querySelector('.look-matching-icon').src = buttons.find(button => button.dataset.look === id).querySelector('img').src;
    text(); resume();
    if (announce) section.querySelector('.look-announcement').textContent = t('selected', name());
  }
  async function load() {
    if (api) return;
    if (loading) return loading;
    failed = false;
    loading = (async () => {
      try {
        const module = await import('./nivo-skins.js?v=20261110-mascot-size');
        const image = new Image();
        image.src = new URL('nivo-body.png', import.meta.url).href;
        await image.decode();
        api = module;
        select(selected);
        buttons.forEach(button => { button.disabled = false; });
        inspect.disabled = false;
      } catch { failed = true; inspect.disabled = false; text(); }
      finally { loading = null; }
    })();
    return loading;
  }
  buttons.forEach(button => button.addEventListener('click', () => select(button.dataset.look, true)));
  pause.addEventListener('click', () => { paused = !paused; text(); resume(); });
  inspect.addEventListener('click', () => {
    if (failed) { load(); return; }
    document.dispatchEvent(new CustomEvent('nivo-icon-inspect', { detail: { id: selected, name: name(), story: story() } }));
  });
  function revealLook(id) {
    select(id, true);
    const button = buttons.find(button => button.dataset.look === selected);
    button.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
    section.scrollIntoView({ block: 'start', behavior: reduced.matches ? 'instant' : 'smooth' });
    button.focus({ preventScroll: true });
  }
  document.addEventListener('nivo-look-select', event => {
    if (!api || !looks[event.detail.id]) return;
    event.preventDefault();
    revealLook(event.detail.id);
  });
  snowyLink?.addEventListener('click', async event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    section.scrollIntoView({ block: 'start', behavior: reduced.matches ? 'instant' : 'smooth' });
    if (!api) await load();
    if (api) revealLook('snowy');
    else inspect.focus({ preventScroll: true });
  });
  const preload = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) load();
  }, { rootMargin: '400px' });
  preload.observe(section);
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
  observer.observe(preview);
  reduced.addEventListener('change', () => { text(); resume(); });
  document.addEventListener('visibilitychange', resume);
  window.addEventListener('pagehide', () => cancelAnimationFrame(frame));
  window.addEventListener('pageshow', resume);
  new MutationObserver(text).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  text();
}
