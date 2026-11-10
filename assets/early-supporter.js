(() => {
  'use strict';
  const language = new URLSearchParams(location.search).get('lang');
  if (language === 'zh' || language === 'en') document.documentElement.lang = language;
  const zh = document.documentElement.lang.startsWith('zh');
  const copy = {
    edition: ['The Founder’s Edition', '创始珍藏系列'],
    iconLabel: ['Early Supporter icon', '早期支持者图标'],
    featureTitle: ['A little thank-you.\nFor our first twenty.', '一份小小的谢意。\n献给最初的二十位。'],
    featureBody: ['A little reminder you were here at the beginning. Our first twenty paying members receive the Early Supporter icon and a permanent supporter number.', '记住你与 Nivolo 最初的相遇。最初二十位付费会员，将获得早期支持者图标与永久支持者编号。'],
    iconNote: ['A little reminder you were here first.', '记住你与 Nivolo 最初的相遇。'],
    featureTerms: ['Any paid membership counts. Free trials and launch-list signups do not reserve a place.', '任何付费会员方案均可。免费试用与加入上线通知名单不占名额。'],
  };
  const t = (key) => copy[key][zh ? 1 : 0];
  document.querySelectorAll('[data-founder-copy]').forEach((element) => {
    const lines = t(element.dataset.founderCopy).split('\n');
    element.replaceChildren();
    lines.forEach((line, index) => {
      if (index) element.append(document.createElement('br'));
      element.append(document.createTextNode(line));
    });
  });
})();
