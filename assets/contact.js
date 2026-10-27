(() => {
  const copy = {
    en: {
      kicker: 'A little help',
      title: 'Questions or concerns?',
      body: 'Something not working, a question on your mind, or an idea to share? We’d love to hear from you.',
      send: 'Email us',
      note: 'Choose your email app, or copy our address. You’ll be writing directly to Nivolo’s developer.',
      contact: 'Contact us',
      subject: 'Nivolo — questions or concerns',
      choose: 'How would you like to email us?',
      chooseBody: 'Use email in your browser, open your email app, or copy the address below.',
      gmail: 'Use Gmail', outlook: 'Use Outlook', app: 'Open email app',
      address: 'Our email address', copy: 'Copy email address', copied: 'Email address copied.',
      manual: 'Please select and copy the address above.', close: 'Close email options',
    },
    zh: {
      kicker: '我们来帮忙',
      title: '有问题或顾虑？',
      body: '遇到了问题、有想了解的事，或有建议想分享？欢迎随时联系我们。',
      send: '发送邮件',
      note: '选择邮件应用或复制邮箱地址，你的邮件会直接发送给 Nivolo 的开发者。',
      contact: '联系我们',
      subject: 'Nivolo — 问题或反馈',
      choose: '你想如何发送邮件？',
      chooseBody: '使用网页版邮箱、打开邮件应用，或复制下方的邮箱地址。',
      gmail: '使用 Gmail', outlook: '使用 Outlook', app: '打开邮件应用',
      address: '我们的邮箱地址', copy: '复制邮箱地址', copied: '邮箱地址已复制。',
      manual: '请选择并复制上方的邮箱地址。', close: '关闭邮件选项',
    },
  };
  const t = (key) => copy[document.documentElement.lang.startsWith('zh') ? 'zh' : 'en'][key];
  document.querySelectorAll('[data-contact-copy]').forEach((element) => {
    element.textContent = t(element.dataset.contactCopy);
  });
  const address = 'support@nivolo.app';
  const subject = encodeURIComponent(t('subject'));
  const mailto = `mailto:${address}?subject=${subject}`;
  const triggers = document.querySelectorAll('[data-contact-email]');
  if (!triggers.length) return;

  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    element.className = className;
    if (text) element.textContent = text;
    return element;
  };
  const dialog = make('dialog', 'contact-dialog');
  if (typeof dialog.showModal !== 'function') return;
  dialog.setAttribute('aria-labelledby', 'contact-choice-title');
  const close = make('button', 'contact-close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', t('close'));
  close.addEventListener('click', () => dialog.close());
  const title = make('h2', '', t('choose'));
  title.id = 'contact-choice-title';
  const body = make('p', 'contact-choice-body', t('chooseBody'));
  const options = make('div', 'contact-options');
  [
    ['gmail', `https://mail.google.com/mail/?view=cm&fs=1&to=${address}&su=${subject}`],
    ['outlook', `https://outlook.live.com/mail/0/deeplink/compose?to=${address}&subject=${subject}`],
    ['app', mailto],
  ].forEach(([key, href]) => {
    const link = make('a', 'contact-option', t(key));
    link.href = href;
    if (key !== 'app') {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    options.append(link);
  });
  const field = make('input', 'contact-address');
  field.value = address;
  field.readOnly = true;
  field.setAttribute('aria-label', t('address'));
  field.addEventListener('click', () => field.select());
  const copyButton = make('button', 'contact-option contact-copy', t('copy'));
  copyButton.type = 'button';
  const status = make('p', 'contact-copy-status');
  status.setAttribute('role', 'status');
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(address);
      status.textContent = t('copied');
    } catch {
      field.focus();
      field.select();
      status.textContent = t('manual');
    }
  });
  dialog.append(close, title, body, options, field, copyButton, status);
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  document.body.append(dialog);
  triggers.forEach((element) => {
    element.href = mailto;
    element.setAttribute('aria-haspopup', 'dialog');
    element.addEventListener('click', (event) => {
      event.preventDefault();
      status.textContent = '';
      dialog.showModal();
    });
  });
})();
