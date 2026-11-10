import { collections } from './nivo-collections.js?v=20261110-remove-grumpy';
import { idleAt, neutralPose } from './nivo-rig.js?v=20261110-mascot-size';

const section = document.querySelector('#nivo-looks');
if (section) {
  const copy = {
    en: { viewSnowy: 'Meet Snowy Nivo', eyebrow: 'One little companion. Many sides.', title: 'Find your Nivo.', intro: 'All your Nivos, together. Tap a look to meet them.', matching: 'Nivo + matching app icon', inspect: 'Explore icon ↗', pause: 'Pause Nivo', resume: 'Resume Nivo', swipe: 'Swipe to explore more looks →', choose: 'Choose a Nivo look', collection: 'Choose a collection', selected: '{name} selected', retry: 'Reload preview', unavailable: 'The preview could not load. Tap to try again.', garden: 'Explore the flower gardens ↗', founders: 'Explore the Founder’s Gallery ↗', plus: 'Plus-exclusive', elements: 'Porcelain · 300 Krill. Jade · 500. Kintsugi · 800. Pearl · 50-day streak.', flowers: 'Eight flowers for everyone. Three Plus-exclusive editions.', supporters: 'A numbered painting and icon for the first 20 paying members.' },
    zh: { viewSnowy: '认识雪花 Nivo', eyebrow: '同一位小伙伴，不一样的小个性。', title: '找到你的 Nivo。', intro: '所有 Nivo，一起看。轻点喜欢的外观，认识它。', matching: 'Nivo 与相配的应用图标', inspect: '探索图标 ↗', pause: '暂停 Nivo', resume: '继续 Nivo', swipe: '滑动探索更多外观 →', choose: '选择 Nivo 外观', collection: '选择系列', selected: '已选择{name}', retry: '重新加载预览', unavailable: '预览暂时未能加载，轻点重试。', garden: '探索花园 ↗', founders: '探索创始者画廊 ↗', plus: 'Plus 专属', elements: '青花瓷 · 300 磷虾。翡翠 · 500。金缮 · 800。珍珠 · 连续记录 50 天。', flowers: '八款花卉向所有人开放，三款为 Plus 专属。', supporters: '赠予最初 20 位付费会员的编号画作与图标。' },
  };
  // IDs match the production app. Only looks with an approved mascot are selectable.
  const looks = {
    classic: ['Classic', '经典', 'Your first Nivo. A familiar face for every small beginning.', '你的第一位 Nivo，陪伴每一个小小的开始。', '#e2edf2'],
    deepsea: ['Deep-Sea', '深海', 'A little ocean light. The same companion, with his own deep-sea glow.', '一点海洋微光。熟悉的小伙伴，带着独有的深海光芒。', '#263e70'],
    snowy: ['Snowy', '雪花', 'Arrives after your first proper week. Nivo swears it always snows right before something starts to stick.', '在你完整坚持一周之后到来。Nivo 坚称，事情快要成形之前总会下雪。', '#e0f2fc'],
    blaze: ['Blaze', '烈焰', 'Carried up out of the old fire under the ice. It finds the ones who don\'t cool off.', '从冰层底下那团旧火里带上来的。它只找那些不会冷下来的人。', '#ffe7ce'],
    party: ['Party', '派对', 'He\'s held that confetti since the day you set the goal. Finishing it opens his hands.', '从你定下目标那天起，那把彩纸就攥在他手里。完成目标，他才松手。', '#eee2fc'],
    melting: ['Melting', '融化', 'The face of a streak that nearly went. A freeze went off in the night, and he\'s still dripping with relief.', '差点断掉的连续记录留下的表情。冻结在夜里生效了，他现在还在后怕地滴水。', '#fae7dc'],
    ghost: ['Ghost', '小幽灵', 'A long stretch of quiet, faithful days leaves something behind.', '一长段安静而忠实的日子，总会留下点什么。', '#e8ecf8'],
    gold: ['Pearl', '珍珠', 'Fifty days of showing up. A little pearl, with all that quiet effort inside.', '坚持了五十天。一颗小珍珠，藏着每一天安静的努力。', '#f5eaf2'],
    glitch: ['Glitch', '故障', 'You went so far the ice started skipping. Almost nobody sees this one.', '你走得太远，冰面开始跳帧。几乎没人见过这一枚。', '#eee7f8'],
    porcelain: ['Porcelain', '青花瓷', 'Cobalt blossoms and a gently swaying hairpin.', '青花绽放，发簪轻轻摇曳。', '#edf5fe'],
    jade: ['Jade', '翡翠', 'A little jade dragon with soft horns and a gently curling tail.', '柔和的龙角、轻卷的尾巴，一只温润的翡翠小龙。', '#e2efe5'],
    kintsugi: ['Kintsugi', '金缮', 'Quiet golden glints. Every repair belongs to the story.', '安静闪烁的金光，每一道修补都是故事的一部分。', '#eee9df'],
    focused: ['Focused', '专注', 'Nothing exists but the next small thing. Nivo is extremely busy and would rather not be disturbed.', '世界只剩下手边这一件小事。Nivo 非常忙，暂时不想被打扰。', '#e4edfc'],
    love: ['Love', '爱心', 'Somewhere in that first week a habit stops being a chore and starts being yours. He felt it before you did.', '第一周的某个瞬间，习惯不再是任务，而变成了你自己的东西。他比你先察觉。', '#f7e3ee'],
    starstruck: ['Starstruck', '星星眼', 'He looked at what you\'d built and forgot how to blink.', '他看着你做出来的东西，忘了怎么眨眼。', '#f4e5ed'],
    champion: ['Champion', '冠军', 'There\'s a shelf in the ice for the very consistent. He won\'t come down.', '冰上有一块只留给极度稳定者的高台。他不打算下来。', '#e1eef0'],
    sleepy: ['Sleepy', '困困', 'Caught before sunrise. He didn\'t think anyone else was up either.', '在日出前被逮到。他也没想到还有别人醒着。', '#eceafa'],
    sick: ['Sick', '生病', 'Olive-green plumage, rosy cheeks, and a tiny thermometer. Take it gently.', '橄榄绿羽毛、红润脸颊，还有一支小小的体温计。慢慢来就好。', '#e7efdd'],
    rainy: ['Rainy', '雨天', 'Grey days count double. This one\'s for the people who showed up anyway.', '灰暗的日子算双份。这一枚献给照样出现的人。', '#e2edf0'],
  };
  const zh = () => document.documentElement.lang.startsWith('zh');
  const t = (key, name = '') => copy[zh() ? 'zh' : 'en'][key].replace('{name}', name);
  const name = () => looks[selected][zh() ? 1 : 0];
  const story = () => looks[selected][zh() ? 3 : 2];
  const flowerTiles = [...document.querySelectorAll('[data-flower-choice]')];
  const flowerIds = new Set(flowerTiles.map(tile => tile.dataset.flowerChoice));
  const plusIds = new Set(['white-lotus', 'tree-peony', 'spider-lily']);
  const choices = section.querySelector('.look-choices');
  for (const original of flowerTiles) {
    const id = original.dataset.flowerChoice;
    const en = original.querySelector('.flower-choice-name').textContent;
    const cn = original.querySelector('.flower-choice-zh').textContent;
    looks[id] = [en, cn, 'A Nivo look, a matching icon, and a little garden of your own.', '一款 Nivo、一枚相配图标，还有属于你的小花园。', '#e2efe5'];
    const button = document.createElement('button');
    button.className = 'look-choice'; button.type = 'button'; button.dataset.look = id;
    button.disabled = true; button.setAttribute('aria-controls', 'look-preview');
    button.append(original.querySelector('img').cloneNode());
    const label = document.createElement('span'); label.textContent = en; button.append(label);
    if (plusIds.has(id)) { const badge = document.createElement('small'); badge.className = 'look-plus'; badge.textContent = 'Plus'; button.append(badge); }
    choices.append(button);
  }
  looks['early-supporter'] = ['Early Supporter', '早期支持者', 'A little reminder you were here first. A golden icon and a numbered painting for our first twenty paying members.', '纪念最早的相遇。赠予最初二十位付费会员的金色图标与编号画作。', '#f3e8cc'];
  const supporter = document.createElement('button');
  supporter.className = 'look-choice'; supporter.type = 'button'; supporter.dataset.look = 'early-supporter'; supporter.disabled = true; supporter.setAttribute('aria-controls', 'look-preview');
  supporter.innerHTML = '<img src="assets/icons/early-supporter.png?v=20261109" width="160" height="160" alt="" loading="lazy" /><span>Early Supporter</span>';
  choices.append(supporter);
  const buttons = [...section.querySelectorAll('[data-look]')];
  const groups = collections.filter(collection => collection.ids.some(id => looks[id]));
  let activeCollection = groups[0].id;
  const collectionHeadings = groups.map(collection => {
    const group = document.createElement('section');
    group.className = 'look-collection'; group.id = `look-group-${collection.id}`;
    const heading = document.createElement('h4');
    heading.id = `look-collection-${collection.id}`; heading.dataset.lookCollection = collection.id;
    const row = document.createElement('div'); row.className = 'look-collection-choices';
    row.setAttribute('role', 'group'); row.setAttribute('aria-labelledby', heading.id);
    const ids = collection.id === 'flowers' ? [...collection.ids.filter(id => !plusIds.has(id)), ...collection.ids.filter(id => plusIds.has(id))] : collection.ids;
    ids.forEach((id, index) => {
      if (collection.id === 'flowers' && plusIds.has(id) && !plusIds.has(ids[index - 1])) {
        const label = document.createElement('p'); label.className = 'look-plus-heading'; label.dataset.lookCopy = 'plus'; row.append(label);
      }
      const tile = buttons.find(tile => tile.dataset.look === id); if (tile) row.append(tile);
    });
    group.append(heading, row);
    const noteKey = collection.id === 'treasures' ? 'elements' : ['flowers', 'supporters'].includes(collection.id) ? collection.id : null;
    if (noteKey) {
      const note = document.createElement('p'); note.className = 'look-collection-note'; note.dataset.lookCopy = noteKey; group.append(note);
    }
    choices.append(group);
    return heading;
  });
  const preview = section.querySelector('.look-preview');
  const host = section.querySelector('.look-mascot');
  const pause = section.querySelector('.look-pause');
  const inspect = section.querySelector('.look-inspect');
  const snowyLink = document.querySelector('.benefit-icon-preview');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let api, flowerApi, loading, selected = 'classic', paused = false, visible = false, frame = 0, previous = null, elapsed = 0, serial = 0, failed = false;
  let layers = [], transitionStart = 0;

  function text() {
    section.querySelectorAll('[data-look-copy]').forEach(el => { el.textContent = t(el.dataset.lookCopy); });
    collectionHeadings.forEach(control => {
      const collection = collections.find(group => group.id === control.dataset.lookCollection);
      control.textContent = (zh() ? collection.zh : collection.name);
    });
    const detail = section.querySelector('.look-detail-link');
    detail.hidden = !['flowers', 'supporters'].includes(activeCollection);
    detail.href = activeCollection === 'flowers' ? '#flower-edition' : '#founders';
    detail.textContent = t(activeCollection === 'flowers' ? 'garden' : 'founders');
    inspect.hidden = flowerIds.has(selected);
    section.querySelector('.look-matching-icon').src = buttons.find(button => button.dataset.look === selected).querySelector('img').src;
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
      if (plusIds.has(button.dataset.look)) button.setAttribute('aria-description', t('plus'));
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
    activeCollection = groups.find(group => group.ids.includes(id)).id;
    if (!layers.some(layer => layer.id === id)) {
      const node = document.createElement('div'); node.className = 'look-layer'; node.dataset.lookLayer = id;
      const uid = `collection-nivo-${++serial}`;
      const flower = flowerApi.flowers.find(flower => flower.id === id);
      const flowerRig = flower && flowerApi.makeFlower(node, flower, uid);
      const rig = flowerRig ? { render: pose => flowerRig.render(pose, pose.skinTimeMs, pose.skinMotion) } : api.makeClassicSkin(node, { id }, uid);
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
        const [module, flowers] = await Promise.all([import('./nivo-skins.js?v=20261110-supporter-mascot'), import('./flower-art.js?v=20261110-mascot-size')]);
        flowerApi = flowers;
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
  const hoverPreview = matchMedia('(hover: hover) and (pointer: fine)');
  buttons.forEach(button => {
    button.addEventListener('click', () => select(button.dataset.look, true));
    button.addEventListener('pointerenter', event => {
      if (hoverPreview.matches && event.pointerType === 'mouse' && !button.disabled) select(button.dataset.look);
    });
    button.addEventListener('focus', () => {
      if (button.matches(':focus-visible')) select(button.dataset.look, true);
    });
  });
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
