import { createRig, neutralPose, idleAt, smallWinAt, celebrationAt, SMALL_WIN_MS, CELEBRATION_MS } from './nivo-rig.js?v=4';

const demo = document.querySelector('[data-first-step-demo]');
if (demo) {
  const copy = {
    en: {
      eyebrow: 'A LITTLE PREVIEW', example: 'EXAMPLE GOAL', goal: 'Play my first guitar chord',
      progress: 'Your progress', count: '{n} of 3 small steps', next: 'YOUR NEXT SMALL STEP', complete: 'GOAL COMPLETE',
      action0: 'Practise finger placement', action1: 'Strum it slowly', action2: 'Play one clear chord', action3: 'Your first chord, played.',
      message0: 'Big plans. Tiny first step.', message1: 'You started. That counts.', message2: 'Look at you, keeping going.', message3: 'You did it. Nivo knew you could.',
      button0: 'Log my first small step', button1: 'Try the next small step', button2: 'Finish this example goal', button3: 'Try it again',
      shelfTitle: 'A little keepsake, ahead.', shelfNote: 'Finish the goal. Keep its gem.',
      earnedTitle: 'Your first chord, now a keepsake.', earnedNote: 'A little proof you saw it through.',
      ownGoal: 'Make room for your own goal', note: 'Just a preview. Your own journey starts in the app.',
      status1: 'First step logged. One of three complete.', status2: 'Another small win. Two of three complete.',
      status3: 'Goal complete. Your first-chord gem is on the shelf.', reset: 'A fresh start. Try your first small step.',
    },
    zh: {
      eyebrow: '小小体验', example: '示例目标', goal: '弹出我的第一个吉他和弦',
      progress: '你的进度', count: '已完成 {n} / 3 小步', next: '接下来的一小步', complete: '目标完成',
      action0: '练习手指的位置', action1: '慢慢拨动琴弦', action2: '弹出一个清晰的和弦', action3: '第一个和弦，弹出来了。',
      message0: '大大的计划，小小的开始。', message1: '你开始了。这就值得。', message2: '看，你正在一点点坚持。', message3: '你做到了。Nivo 一直相信你。',
      button0: '记录我的第一小步', button1: '试试下一小步', button2: '完成这个示例目标', button3: '再试一次',
      shelfTitle: '一份小小的纪念，等着你。', shelfNote: '完成目标，收藏它的宝石。',
      earnedTitle: '你的第一个和弦，成为珍藏。', earnedNote: '一份小小的证明：你坚持到了最后。',
      ownGoal: '为自己的目标留点空间', note: '这里只是体验。你的旅程，从应用里开始。',
      status1: '已记录第一小步。完成三步中的一步。', status2: '又一个小成就。完成三步中的两步。',
      status3: '目标完成。你的第一枚和弦宝石已放上收藏架。', reset: '重新开始。试着迈出第一小步。',
    },
  };
  const t = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replace(`{${name}}`, value), copy[document.documentElement.lang.startsWith('zh') ? 'zh' : 'en'][key]);
  demo.querySelectorAll('[data-demo-copy]').forEach((el) => { el.textContent = t(el.dataset.demoCopy); });
  const find = (name) => demo.querySelector(`[data-demo-${name}]`);
  const button = find('log');
  const progress = demo.querySelector('[role="progressbar"]');
  const status = demo.querySelector('.demo-status');
  const gem = demo.querySelector('.demo-earned-gem');
  const scene = demo.querySelector('.demo-scene');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const rig = createRig(find('nivo'), new URL('./nivo-body.png', import.meta.url).href, 'first-step-demo-nivo', 'Nivo');
  let steps = 0;
  let frame = 0;
  let visible = false;
  let reactionStart = null;
  let lastTap = -Infinity;
  let audio;
  const effects = new Set();
  const particles = new Set();
  const animate = (el, frames, options) => {
    if (motion.matches || !el.animate) return;
    const effect = el.animate(frames, options);
    effects.add(effect);
    effect.onfinish = () => { effects.delete(effect); effect.cancel(); };
  };
  const clearEffects = () => {
    effects.forEach((effect) => effect.cancel()); effects.clear();
    particles.forEach((particle) => particle.remove()); particles.clear();
  };
  const playSfx = async (finished) => {
    // Shares the website's explicit sound preference, initially off.
    if (document.querySelector('[data-nivo-sound]')?.getAttribute('aria-pressed') !== 'true') return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      const context = audio ??= new Audio();
      if (context.state !== 'running') await context.resume();
      if (document.hidden || document.querySelector('[data-nivo-sound]')?.getAttribute('aria-pressed') !== 'true') return;
      (finished ? [523, 659, 784] : [659, 880]).forEach((frequency, i) => {
        const at = context.currentTime + i * .07;
        const tone = context.createOscillator();
        const gain = context.createGain();
        tone.frequency.value = frequency;
        gain.gain.setValueAtTime(0, at);
        gain.gain.linearRampToValueAtTime(.025, at + .008);
        gain.gain.exponentialRampToValueAtTime(.0001, at + .22);
        tone.connect(gain); gain.connect(context.destination);
        tone.start(at); tone.stop(at + .24);
        tone.onended = () => { tone.disconnect(); gain.disconnect(); };
      });
    } catch { /* The visual acknowledgement still works without audio. */ }
  };
  const render = (now) => {
    frame = 0;
    const elapsed = reactionStart === null ? Infinity : now - reactionStart;
    const duration = steps === 3 ? CELEBRATION_MS : SMALL_WIN_MS;
    if (elapsed >= duration) reactionStart = null;
    rig.render(reactionStart === null ? idleAt(now) : steps === 3 ? celebrationAt(elapsed) : smallWinAt(elapsed));
    if (visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(render);
  };
  const resume = () => {
    cancelAnimationFrame(frame); frame = 0;
    rig.render(motion.matches && steps ? { ...neutralPose(), happy: 1, blink: 1, left: 12, right: -12 } : neutralPose());
    if (visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(render);
  };
  const update = () => {
    demo.dataset.steps = steps;
    demo.classList.toggle('is-complete', steps === 3);
    find('message').textContent = t(`message${steps}`);
    find('count').textContent = t('count', { n: steps });
    progress.setAttribute('aria-label', t('progress'));
    progress.setAttribute('aria-valuenow', steps);
    progress.setAttribute('aria-valuetext', t('count', { n: steps }));
    progress.style.setProperty('--progress', `${steps / 3 * 100}%`);
    find('action-label').textContent = t(steps === 3 ? 'complete' : 'next');
    find('action').textContent = t(`action${steps}`);
    demo.querySelector('.demo-step-check').textContent = steps === 3 ? '✓' : steps + 1;
    button.replaceChildren(document.createTextNode(t(`button${steps}`)));
    const arrow = document.createElement('span'); arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = steps === 3 ? '↻' : '→'; button.append(arrow);
    find('shelf-title').textContent = t(steps === 3 ? 'earnedTitle' : 'shelfTitle');
    find('shelf-note').textContent = t(steps === 3 ? 'earnedNote' : 'shelfNote');
    find('own').hidden = steps !== 3;
    demo.querySelector('.demo-note').hidden = steps === 3;
  };
  const sparkle = () => {
    if (motion.matches) return;
    for (let i = 0; i < 6; i++) {
      const star = document.createElement('span'); star.className = 'demo-spark'; star.textContent = '✦'; star.setAttribute('aria-hidden', 'true');
      scene.append(star); particles.add(star);
      const angle = i / 6 * Math.PI * 2;
      const effect = star.animate([
        { transform: 'translate(0, 0) scale(.2)', opacity: 0 },
        { opacity: 1, offset: .2 },
        { transform: `translate(${Math.cos(angle) * 90}px, ${Math.sin(angle) * 55 - 25}px) scale(.7)`, opacity: 0 },
      ], { duration: 850, easing: 'ease-out' });
      effects.add(effect);
      effect.onfinish = () => { effects.delete(effect); particles.delete(star); star.remove(); };
    }
  };
  button.addEventListener('click', () => {
    const now = performance.now();
    if (now - lastTap < 240) return;
    lastTap = now;
    clearEffects();
    steps = steps === 3 ? 0 : steps + 1;
    update();
    status.textContent = steps ? t(`status${steps}`) : t('reset');
    reactionStart = steps ? now : null;
    resume();
    if (!steps) return;
    playSfx(steps === 3);
    navigator.vibrate?.(steps === 3 ? [12, 35, 18] : 10);
    sparkle();
    if (steps === 3 && !motion.matches) {
      const source = scene.getBoundingClientRect();
      const destination = gem.getBoundingClientRect();
      const x = source.left + source.width / 2 - destination.left - destination.width / 2;
      const y = source.top + source.height / 2 - destination.top - destination.height / 2;
      animate(gem, [
        { transform: `translate(${x}px, ${y}px) scale(.15) rotate(-15deg)`, opacity: 0 },
        { transform: `translate(${x}px, ${y}px) scale(1.9) rotate(6deg)`, opacity: 1, offset: .35 },
        { transform: `translate(${x}px, ${y}px) scale(1.8) rotate(0deg)`, opacity: 1, offset: .57 },
        { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
      ], { duration: 1550, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }
  });
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); }).observe(demo);
  motion.addEventListener('change', () => { clearEffects(); reactionStart = null; resume(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearEffects(); resume(); });
  window.addEventListener('pagehide', () => { cancelAnimationFrame(frame); clearEffects(); audio?.close().catch(() => {}); audio = undefined; });
  window.addEventListener('pageshow', resume);
  update();
  button.disabled = false;
}
