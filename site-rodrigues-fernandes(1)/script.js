// Menu mobile
const nav = document.getElementById('nav');
const btn = document.getElementById('menu-button');
const setMenu = open => {
  nav.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', open);
  btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
};
btn.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

document.getElementById('year').textContent = new Date().getFullYear();

// Cartas empilhadas da seção "Nossa abordagem"
const section = document.getElementById('abordagem');
const cards = [...section.querySelectorAll('.approach-card')];
const bar = document.getElementById('progress-bar');
const count = document.getElementById('step-count');

if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  section.classList.add('reduced');
  bar.style.transform = 'scaleX(1)';
} else {
  // interpola linearmente entre pontos [x, y], limitando nas pontas
  const lerp = (p, xs, ys) => {
    if (p <= xs[0]) return ys[0];
    for (let i = 1; i < xs.length; i++) {
      if (p <= xs[i]) return ys[i - 1] + (ys[i] - ys[i - 1]) * (p - xs[i - 1]) / (xs[i] - xs[i - 1]);
    }
    return ys[ys.length - 1];
  };
  const cfg = [
    { s: 0,   e: .01, y: [0, 0, -36],    r: [-3, 0], rx: [0, 0],   sc: [1, .96, .91] },
    { s: .12, e: .47, y: [670, 0, -18],  r: [14, 0], rx: [-18, 0], sc: [1, 1, .955] },
    { s: .48, e: .84, y: [670, 0, 0],    r: [14, 0], rx: [-18, 0], sc: [1, 1, 1] },
  ];
  const update = () => {
    const rect = section.getBoundingClientRect();
    const total = section.offsetHeight - innerHeight;
    const p = Math.min(1, Math.max(0, -rect.top / total));
    cards.forEach((card, i) => {
      const c = cfg[i];
      const y = lerp(p, [c.s, c.e, 1], c.y);
      const r = lerp(p, [c.s, c.e], c.r);
      const rx = lerp(p, [c.s, c.e], c.rx);
      const sc = lerp(p, [0, .5, 1], c.sc);
      card.style.zIndex = i + 1;
      card.style.transform = `translateY(${y}px) rotate(${r}deg) rotateX(${rx}deg) scale(${sc})`;
    });
    bar.style.transform = `scaleX(${p})`;
    count.textContent = `0${Math.round(lerp(p, [0, .47, .84], [1, 2, 3]))} / 03`;
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
}
