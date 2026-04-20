function init() {
  generateStars();
  bindNavigation();
}

function generateStars() {
  const container = document.getElementById('stars');
  if (!container) return;

  for (let i = 0; i < 120; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 70 + '%';
    star.style.setProperty('--dur', (3 + Math.random() * 6) + 's');
    star.style.setProperty('--max-op', (0.3 + Math.random() * 0.7).toFixed(2));
    star.style.animationDelay = Math.random() * 8 + 's';
    container.appendChild(star);
  }
}

const READINGS = {
  red: {
    label: 'Vermillion',
    hex: '#FF2400',
    lines: [
      'This hue often appears when something wants to be named—anger, desire, or a boundary you have been polite about for too long.',
      'You do not have to act today. Noticing the heat is enough. Let it clarify what you will no longer shrink to protect someone else’s comfort.',
    ],
  },
  orange: {
    label: 'Amber',
    hex: '#FF7F00',
    lines: [
      'Orange is the color of appetite—for change, for contact, for the next small risk that proves you are still curious about your own life.',
      'If you have been waiting for permission, consider this a soft bell: you may reach toward what warms you without explaining it perfectly first.',
    ],
  },
  yellow: {
    label: 'Gold',
    hex: '#FFD700',
    lines: [
      'Yellow asks for light—sometimes because you are full of it, sometimes because you are trying to find it again.',
      'Name one thing that still feels possible, even quietly. That is not naive; it is how rooms get brighter.',
    ],
  },
  green: {
    label: 'Verdant',
    hex: '#4CAF50',
    lines: [
      'Green is patience with direction: regrowth after a season that did not go to plan.',
      'Where can you loosen your grip without abandoning care? Growth rarely announces itself; it accumulates in small, faithful motions.',
    ],
  },
  blue: {
    label: 'Cerulean',
    hex: '#1E90FF',
    lines: [
      'Blue is depth and distance—the part of you that can hold a feeling without drowning in it.',
      'If you feel far from shore, remember: depth is not failure. Some truths only speak underwater.',
    ],
  },
  violet: {
    label: 'Violet',
    hex: '#BF5FFF',
    lines: [
      'Violet edges toward the unseen—intuition, dreams, the questions you save for 2 a.m.',
      'You are allowed to trust a hunch that does not yet have evidence. Follow it gently; gather proof as you go.',
    ],
  },
  rose: {
    label: 'Rose',
    hex: '#FF1493',
    lines: [
      'Rose is tenderness with teeth—love that refuses to be only polite.',
      'Whose softness have you been carrying? Return some of that warmth to your own skin.',
    ],
  },
};

/** Mood path maps to a color key for reading */
const MOOD_TO_COLOR = {
  still: 'blue',
  restless: 'orange',
  hopeful: 'yellow',
  heavy: 'violet',
  bright: 'rose',
  uncertain: 'green',
};

function setBackgroundTint(hex, opacity) {
  const bg = document.getElementById('bgLayer');
  if (!bg) return;
  const a = opacity ?? 0.12;
  bg.style.background = `radial-gradient(ellipse 90% 70% at 50% 75%, ${hexToRgba(hex, a)} 0%, transparent 65%), var(--bg)`;
}

function hexToRgba(hex, a) {
  const n = hex.replace('#', '');
  const v = n.length === 3 ? n.split('').map((c) => c + c).join('') : n;
  const num = parseInt(v, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r},${g},${b},${a})`;
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach((el) => {
    const on = el.id === id;
    el.classList.toggle('active', on);
    el.setAttribute('aria-hidden', on ? 'false' : 'true');
  });

  if (id === 'screen-landing') {
    const bg = document.getElementById('bgLayer');
    if (bg) bg.style.background = '';
    const accent = document.getElementById('readingAccent');
    if (accent) accent.style.background = 'transparent';
  }
}

function renderReading(colorKey, subtitle) {
  const data = READINGS[colorKey];
  if (!data) return;

  const kicker = document.getElementById('readingKicker');
  const hue = document.getElementById('readingHue');
  const body = document.getElementById('readingBody');
  const accent = document.getElementById('readingAccent');

  if (kicker) kicker.textContent = subtitle || 'Your reading';
  if (hue) {
    hue.textContent = data.label;
    hue.style.color = data.hex;
  }
  if (body) {
    body.innerHTML = data.lines.map((line) => `<p>${line}</p>`).join('');
  }
  if (accent) accent.style.background = data.hex;

  setBackgroundTint(data.hex, 0.14);
  showScreen('screen-reading');
}

function bindNavigation() {
  document.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-goto');
      if (id) showScreen(id);
    });
  });

  document.querySelectorAll('[data-back]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-back');
      if (id) showScreen(id);
    });
  });

  document.querySelectorAll('.spectrum-swatch').forEach((sw) => {
    sw.addEventListener('click', () => {
      const key = sw.getAttribute('data-color');
      if (key) renderReading(key, 'From the spectrum');
    });
  });

  document.querySelectorAll('.mood-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      // Prototype stop-point: allow choosing a word, but don't advance to a reading yet.
      document.querySelectorAll('.mood-chip').forEach((el) => {
        el.classList.toggle('selected', el === chip);
        el.setAttribute('aria-pressed', el === chip ? 'true' : 'false');
      });
    });
  });

  const again = document.getElementById('reading-again');
  if (again) {
    again.addEventListener('click', () => {
      showScreen('screen-landing');
    });
  }
}

init();
