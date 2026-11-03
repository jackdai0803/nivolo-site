/* Keep actual app captures editable inside one pre-rendered product frame.
   Four measured screen corners map the screenshot onto the glass plane. */
(() => {
  const corners = [[67, 185], [710, 98], [1168, 1478], [568, 1558]];
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = corners;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const denominator = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / denominator;
  const h = (dx1 * dy3 - dx3 * dy1) / denominator;
  const a = x1 - x0 + g * x1, b = x3 - x0 + h * x3;
  const d = y1 - y0 + g * y1, e = y3 - y0 + h * y3;
  const position = (phone, width) => {
    if (!width) return;
    const s = width / 1073;
    phone.querySelector('img').style.transform = `matrix3d(${[
      a / 393 * s, d / 393 * s, 0, g / 393,
      b / 852 * s, e / 852 * s, 0, h / 852,
      0, 0, 1, 0, x0 * s, y0 * s, 0, 1,
    ].join(',')})`;
  };
  const observer = new ResizeObserver(entries => {
    for (const entry of entries) position(entry.target, entry.contentRect.width);
  });
  for (const phone of document.querySelectorAll('.app-screen-stage .phone')) {
    const image = phone.querySelector('img');
    if (!image) continue;
    const display = document.createElement('span');
    display.className = 'phone-studio-display';
    image.before(display);
    display.append(image);
    phone.classList.add('is-studio');
    position(phone, phone.getBoundingClientRect().width);
    observer.observe(phone);
  }
})();
