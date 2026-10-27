(() => {
  const copy = {
    en: {
      kicker: 'A little help',
      title: 'Questions or concerns?',
      body: 'Something not working, a question on your mind, or an idea to share? We’d love to hear from you.',
      send: 'Email us',
      note: 'Opens your email app. Your message goes directly to Nivolo’s developer.',
      contact: 'Contact us',
      subject: 'Nivolo — questions or concerns',
    },
    zh: {
      kicker: '我们来帮忙',
      title: '有问题或顾虑？',
      body: '遇到了问题、有想了解的事，或有建议想分享？欢迎随时联系我们。',
      send: '发送邮件',
      note: '将打开你的邮件应用，邮件会直接发送给 Nivolo 的开发者。',
      contact: '联系我们',
      subject: 'Nivolo — 问题或反馈',
    },
  };
  const t = (key) => copy[document.documentElement.lang.startsWith('zh') ? 'zh' : 'en'][key];
  document.querySelectorAll('[data-contact-copy]').forEach((element) => {
    element.textContent = t(element.dataset.contactCopy);
  });
  document.querySelectorAll('[data-contact-email]').forEach((element) => {
    element.href = `mailto:support@nivolo.app?subject=${encodeURIComponent(t('subject'))}`;
  });
})();
