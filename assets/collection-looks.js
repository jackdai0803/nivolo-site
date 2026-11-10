import { idleAt, neutralPose } from './nivo-rig.js?v=9';

const section = document.querySelector('#nivo-looks');
if (section) {
  const copy = {
    en: { eyebrow: 'One little companion. Many sides.', title: 'Find your Nivo.', intro: 'Choose an icon. Meet the little character behind it.', matching: 'Nivo + matching app icon', inspect: 'Explore icon ↗', pause: 'Pause Nivo', resume: 'Resume Nivo', swipe: 'Swipe to explore more looks →', choose: 'Choose a Nivo look', selected: '{name} selected', retry: 'Reload preview', unavailable: 'The preview could not load. Tap to try again.' },
    zh: { eyebrow: '同一位小伙伴，不一样的小个性。', title: '找到你的 Nivo。', intro: '选一枚图标，认识它背后的小伙伴。', matching: 'Nivo 与相配的应用图标', inspect: '探索图标 ↗', pause: '暂停 Nivo', resume: '继续 Nivo', swipe: '滑动探索更多外观 →', choose: '选择 Nivo 外观', selected: '已选择{name}', retry: '重新加载预览', unavailable: '预览暂时未能加载，轻点重试。' },
  };
  // IDs match the production app. Only looks with an approved mascot are selectable.
  const looks = {
    classic: ['Classic', '经典', 'Your first Nivo. A familiar face for every small beginning.', '你的第一位 Nivo，陪伴每一个小小的开始。', '#e2edf2'],
    deepsea: ['Deep-Sea', '深海', 'A little ocean light. The same companion, with his own deep-sea glow.', '一点海洋微光。熟悉的小伙伴，带着独有的深海光芒。', '#263e70'],
    grumpy: ['Grumpy', '气鼓鼓', 'A little huff. There’s room for an imperfect day.', '轻轻哼一声，不完美的一天也值得被接纳。', '#f3e4e9'],
    snowy: ['Snowy', '雪花', 'A red scarf, drifting snow, and a little winter shiver.', '红围巾、飘落的雪花，还有冬日里小小的颤抖。', '#e0f2fc'],
    blaze: ['Blaze', '烈焰', 'Warm ember light. A small flame that keeps going.', '温暖的余烬，一簇不肯熄灭的小火苗。', '#ffe7ce'],
    party: ['Party', '派对', 'A tiny party hat. Every little finish deserves a celebration.', '戴上小小派对帽，每一次完成都值得庆祝。', '#eee2fc'],
    melting: ['Melting', '融化', 'A scoop of peach sorbet and a tiny puddle of thawing ice.', '一球蜜桃冰沙，和一小滩融化的冰水。', '#fae7dc'],
    ghost: ['Ghost', '小幽灵', 'A drifting veil. Your quiet little companion.', '轻轻飘动的面纱，安静陪伴你的小伙伴。', '#e8ecf8'],
    gold: ['Pearl', '珍珠', 'Pearlescent light, shell-like curves, and a little treasure.', '珍珠微光、贝壳般的曲线，一份小小珍藏。', '#f5eaf2'],
    glitch: ['Glitch', '故障', 'Cyan and pink fragments. A tiny digital hiccup.', '青色与粉色的小碎片，一次可爱的数字小故障。', '#eee7f8'],
    porcelain: ['Porcelain', '青花瓷', 'Cobalt blossoms and a gently swaying hairpin.', '青花绽放，发簪轻轻摇曳。', '#edf5fe'],
    jade: ['Jade', '翡翠', 'Flowing jade bands and a slow, calming breath.', '流动的翡翠纹路，伴着缓缓的呼吸。', '#e2efe5'],
    kintsugi: ['Kintsugi', '金缮', 'Quiet golden glints. Every repair belongs to the story.', '安静闪烁的金光，每一道修补都是故事的一部分。', '#eee9df'],
    relieved: ['Relieved', '松口气', 'A warm mug, rising steam, and a little space to exhale.', '暖暖的杯子、升起的热气，留一点松口气的空间。', '#e5f0e8'],
    focused: ['Focused', '专注', 'Clear glasses and a little notebook. One small thing at a time.', '透明眼镜与小小的笔记本。一次专注一件小事。', '#e4edfc'],
    love: ['Love', '爱心', 'Blush hearts, golden curls, and a shy little sway.', '粉色爱心、金色卷纹，还有害羞的小摇摆。', '#f7e3ee'],
    starstruck: ['Starstruck', '星星眼', 'A golden constellation. A small moment of wonder.', '一片金色星光，一个小小惊叹的瞬间。', '#f4e5ed'],
    champion: ['Champion', '冠军', 'Golden laurels. Nivo stands a little taller.', '戴上金色桂冠，Nivo 站得更挺了一点。', '#e1eef0'],
    sleepy: ['Sleepy', '困困', 'Sleepy stars and a soft nod toward rest.', '困倦的小星星，轻轻提醒你该休息了。', '#eceafa'],
    rainy: ['Rainy', '雨天', 'Soft rain. A companion for cloudy days, too.', '细雨轻落，阴天也有小伙伴陪伴。', '#e2edf0'],
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
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let api, loading, selected = 'classic', paused = false, visible = false, frame = 0, previous = null, elapsed = 0, serial = 0, failed = false;
  let layers = [], transitionStart = 0;

  function text() {
    section.querySelectorAll('[data-look-copy]').forEach(el => { el.textContent = t(el.dataset.lookCopy); });
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
        const module = await import('./nivo-skins.js?v=6');
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
  // Existing collection cards lead back to the matching preview; icon-only rewards retain their viewer.
  document.addEventListener('nivo-look-select', event => {
    if (!api || !looks[event.detail.id]) return;
    event.preventDefault(); select(event.detail.id, true);
    const button = buttons.find(button => button.dataset.look === selected);
    button.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
    section.scrollIntoView({ block: 'start', behavior: reduced.matches ? 'instant' : 'smooth' });
    button.focus({ preventScroll: true });
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
