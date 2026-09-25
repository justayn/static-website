/* ==========================================================
   Maple Street Lights — scripts
   ========================================================== */

/* ---------- Shared: this year's (or next year's) tour window ---------- */
function getTourWindow(now) {
  let year = now.getFullYear();
  let start = new Date(year, 11, 1, 0, 0, 0);
  let end = new Date(year, 11, 24, 23, 59, 59);

  if (now > end) {
    year += 1;
    start = new Date(year, 11, 1, 0, 0, 0);
    end = new Date(year, 11, 24, 23, 59, 59);
  }
  return { start, end };
}

/* ---------- 1. Live time counter + open/closed status ---------- */
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours() % 12 || 12).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = now.getHours() >= 12 ? 'PM' : 'AM';

  const clockEl = document.getElementById('liveClock');
  if (clockEl) {
    clockEl.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
  }

  const { start, end } = getTourWindow(now);
  const inSeason = now >= start && now <= end;
  const hour = now.getHours();
  const lightsOn = inSeason && hour >= 17 && hour < 22;

  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');

  if (statusDot && statusText) {
    if (lightsOn) {
      statusDot.classList.remove('is-closed');
      statusText.textContent = 'Lights are on now, until 10pm';
    } else if (inSeason) {
      statusDot.classList.add('is-closed');
      statusText.textContent = 'Lights turn on at dusk, off by 10pm';
    } else {
      statusDot.classList.add('is-closed');
      statusText.textContent = 'Off season — the tour returns December 1';
    }
  }
}
updateClock();
setInterval(updateClock, 1000);

/* ---------- 2. Countdown timer (to opening night, or to the last night) ---------- */
function updateCountdown() {
  const now = new Date();
  const { start, end } = getTourWindow(now);

  const targetingOpening = now < start;
  const target = targetingOpening ? start : end;
  let diff = target - now;

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');
  const captionEl = document.getElementById('board-caption');

  if (diff <= 0) {
    diff = 0;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);
  const mins = Math.floor(diff / (1000 * 60));
  diff -= mins * (1000 * 60);
  const secs = Math.floor(diff / 1000);

  if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
  if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
  if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');

  if (captionEl) {
    captionEl.textContent = targetingOpening
      ? 'Counting down to opening night.'
      : 'Counting down to the last night of the tour.';
  }
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ---------- 3. Interactive button: pick a starting stop ---------- */
const stops = [
  { name: '412 Maple St.', tip: 'where Christmas began here in 2003 — string-light arches over a lit-up tree.' },
  { name: 'Holly Avenue', tip: 'the synchronized block — tune to 89.1 FM for the carols as you walk past.' },
  { name: 'Chestnut Court', tip: 'the inflatable field — snowmen and reindeer everywhere, look up.' },
  { name: "Corner of Maple & Holly", tip: "Santa's chair — weekends only, 6–8pm, through Christmas Eve." },
  { name: 'Birch Lane', tip: 'the cocoa and candy cane stand — cash or card, all proceeds to the block fund.' }
];

let pickCount = 0;
const pickBtn = document.getElementById('pickBtn');
const pickText = document.getElementById('pickText');
const pickCountEl = document.getElementById('pickCount');

if (pickBtn) {
  pickBtn.addEventListener('click', () => {
    const choice = stops[Math.floor(Math.random() * stops.length)];
    pickText.textContent = `Start at ${choice.name} — ${choice.tip}`;

    pickCount += 1;
    pickCountEl.textContent = pickCount;
  });
}

/* ---------- Bonus: mobile nav toggle ---------- */
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Bonus: footer year ---------- */
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ---------- Bonus: gentle falling snow in the header ---------- */
const snowLayer = document.getElementById('snow');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (snowLayer) {
  const flakeCount = prefersReducedMotion ? 10 : 28;

  for (let i = 0; i < flakeCount; i++) {
    const flake = document.createElement('span');
    const size = 3 + Math.random() * 4;
    const duration = 6 + Math.random() * 8;
    const delay = Math.random() * 8;

    flake.style.left = `${Math.random() * 100}%`;
    flake.style.width = `${size}px`;
    flake.style.height = `${size}px`;
    flake.style.opacity = (0.35 + Math.random() * 0.5).toFixed(2);
    flake.style.animationDuration = `${duration}s`;
    flake.style.animationDelay = `${delay}s`;

    snowLayer.appendChild(flake);
  }
}
