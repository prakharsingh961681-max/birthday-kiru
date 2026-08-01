/* =========================================================================
   HAPPY BIRTHDAY, KIRU — script.js
   Vanilla JS only. No frameworks, no build step.

   Sections:
   1.  Content config (edit here to change copy)
   2.  Typing effect (hero subheading)
   3.  Timeline builder
   4.  Gallery builder (auto-loads /images/*, falls back to placeholder)
   5.  Memory Jar builder
   6.  Reasons checklist builder
   7.  Lightbox
   8.  Scroll-reveal (IntersectionObserver)
   9.  Birthday countdown
   10. Floating hearts (ambient)
   11. Falling petals (letter section)
   12. Ambient canvas particles + sparkles
   13. Parallax (hero blobs)
   14. Custom cursor + sparkle trail
   15. Sparkle burst + heart confetti helpers
   16. Music player (vinyl button)
   17. Init
   ========================================================================= */

/* =========================================================
   1. CONTENT CONFIG — edit these to change what shows up
========================================================= */
const JOURNEY_ITEMS = [
  { icon:'📖', title:'Coaching Days', text:'Where it all began — shared benches, stolen glances at the clock, and a friendship neither of us saw coming.' },
  { icon:'🍜', title:'Street Food Adventures', text:'Every questionable food cart, every "just one more plate", every walk home too full to speak.' },
  { icon:'📸', title:'The Picture Collection', text:'A thousand photos, half of them blurry, all of them proof that we were there, together.' },
  { icon:'🗣️', title:'Gossip Sessions', text:'The two-hour calls that were supposed to be five minutes. The tea that never gets cold.' },
  { icon:'😂', title:'Crazy Laughs', text:'The kind of laughing that hurts your stomach and makes strangers stare. My favourite sound.' },
  { icon:'🤫', title:'Inside Jokes', text:'A whole language only we understand, built one ridiculous moment at a time.' },
  { icon:'🌸', title:'Future Memories', text:'Every birthday, every plan, every "someday" we haven\'t lived yet — I can\'t wait for all of it.' },
];

// Gallery auto-loads images/memory-1.jpg ... images/memory-N.jpg from GitHub.
// If a file isn't found yet, a pretty placeholder shows instead — no code
// changes needed later, just drop matching files into /images.
const GALLERY_COUNT = 8;
const GALLERY_PATH = 'images/memory-';

const MEMORY_JAR_ITEMS = [
  { icon:'📚', text:'You made coaching fun.' },
  { icon:'🗣️', text:'Our endless gossip.' },
  { icon:'🍢', text:'Street food > everything.' },
  { icon:'😂', text:'Your laugh is contagious.' },
  { icon:'📸', text:'I still hate those embarrassing pictures 😂' },
  { icon:'🤍', text:'You always show up, no matter what.' },
  { icon:'🤍', text:'Every day with you becomes a favorite memory.' },
  { icon:'🌸', text:'No matter how much we grow up, we\'ll always be the chaotic duo.' },
];

const REASONS_ITEMS = [
  'Caring',
  'Funny',
  'Loyal',
  'Beautiful soul',
  'Chaotic Queen',
  'Best Friend Forever',
];

const TYPED_TEXT = "To the most chaotic, kind, beautiful soul I know.";

// Birthday target — 8 August, this year (or next year automatically once passed)
function getBirthdayTarget(){
  const now = new Date();
  let year = now.getFullYear();
  let target = new Date(year, 7, 8, 0, 0, 0); // month is 0-indexed: 7 = August
  if(now > target){
    // if the 8th has already passed this year, aim at next year
    // (countdown script also detects "today is the 8th" separately, see section 9)
    const isSameDay = now.toDateString() === target.toDateString();
    if(!isSameDay) target = new Date(year + 1, 7, 8, 0, 0, 0);
  }
  return target;
}

/* =========================================================
   2. TYPING EFFECT
========================================================= */
function typeText(el, text, speed = 42){
  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'typed-cursor';
  cursor.textContent = '\u00A0';
  el.appendChild(cursor);

  function step(){
    if(i < text.length){
      cursor.insertAdjacentText('beforebegin', text.charAt(i));
      i++;
      setTimeout(step, speed);
    }
  }
  step();
}

/* =========================================================
   3. TIMELINE BUILDER
========================================================= */
function buildTimeline(){
  const wrap = document.getElementById('timeline');
  JOURNEY_ITEMS.forEach(item => {
    const card = document.createElement('div');
    card.className = 't-card';
    card.innerHTML = `
      <div class="t-dot"></div>
      <span class="t-icon">${item.icon}</span>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    `;
    wrap.appendChild(card);
  });
}

/* =========================================================
   4. GALLERY BUILDER
   Tries to load images/memory-1.jpg, memory-2.jpg, ... automatically.
   If a file 404s, it swaps in a soft placeholder instead — so you can
   add photos to the /images folder on GitHub at any time and the
   gallery fixes itself, no HTML/JS editing required.
========================================================= */
function buildGallery(){
  const grid = document.getElementById('galleryGrid');
  const placeholderIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.6"/><path d="M21 16l-5.5-5.5L9 17"/></svg>`;

  for(let i = 1; i <= GALLERY_COUNT; i++){
    const item = document.createElement('div');
    item.className = 'g-item';

   const img = document.createElement('img');
img.alt = `Memory ${i}`;
img.loading = 'lazy';

const imageNames = [
  "RSRY412.png",
  "RXLDT5D.png",
  "Screenshot_2026-07-30_175135.png",
  "Screenshot_2026-07-30_175207.png",
  "R8ZFHXJ.png",
  "R97IX9S.png",
  "RCSTWT7.png",
  "RH5E3TG.png"
];
img.src = `images/${imageNames[i - 1]}`;

    const placeholder = document.createElement('div');
    placeholder.className = 'g-placeholder';
    placeholder.innerHTML = `${placeholderIcon}<span>memory ${String(i).padStart(2,'0')}</span>`;

    // start with placeholder visible; swap to <img> only once it loads successfully
    item.appendChild(placeholder);

    img.addEventListener('load', () => {
      item.innerHTML = '';
      item.appendChild(img);
    });
    img.addEventListener('error', () => {
      // stays as placeholder — file simply hasn't been added yet
    });

    item.addEventListener('click', () => openLightbox(item.innerHTML));
    grid.appendChild(item);
  }
}

/* =========================================================
   5. MEMORY JAR BUILDER
========================================================= */
function buildMemoryJar(){
  const grid = document.getElementById('jarGrid');
  MEMORY_JAR_ITEMS.forEach(item => {
    const card = document.createElement('div');
    card.className = 'jar-card';
    card.innerHTML = `<span class="jar-icon">${item.icon}</span><p>"${item.text}"</p>`;
    grid.appendChild(card);
  });
}

/* =========================================================
   6. REASONS CHECKLIST BUILDER
========================================================= */
function buildReasons(){
  const list = document.getElementById('reasonsList');
  REASONS_ITEMS.forEach((text, idx) => {
    const li = document.createElement('li');
    li.className = 'reason-item';
    li.style.transitionDelay = `${idx * 0.12}s`;
    li.innerHTML = `
      <span class="reason-check">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M7 12.5l3.2 3.2L17 9"></path>
        </svg>
      </span>
      <span class="reason-text">${text}</span>
    `;
    list.appendChild(li);
  });
}

/* =========================================================
   7. LIGHTBOX
========================================================= */
let lightbox, lightboxBox, lightboxClose;

function initLightbox(){
  lightbox = document.getElementById('lightbox');
  lightboxBox = document.getElementById('lightboxBox');
  lightboxClose = document.getElementById('lightboxClose');

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if(e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeLightbox(); });
}

function openLightbox(innerHTML){
  lightboxBox.innerHTML = innerHTML;
  lightbox.classList.add('open');
}
function closeLightbox(){
  lightbox.classList.remove('open');
}

/* =========================================================
   8. SCROLL REVEAL
========================================================= */
function initScrollReveal(){
  const targets = document.querySelectorAll(
    '.t-card, .g-item, .paper, .letter-body p, .jar-card, .reason-item, .ending-inner'
  );
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(t => io.observe(t));
}

/* =========================================================
   9. BIRTHDAY COUNTDOWN
   Counts down to 8 August. Automatically swaps to a celebration
   message the moment the birthday arrives — no refresh needed.
========================================================= */
function initCountdown(){
  const wrap = document.getElementById('countdownWrap');
  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minsEl = document.getElementById('cdMins');
  const secsEl = document.getElementById('cdSecs');
  const celebrateEl = document.getElementById('cdCelebrate');

  let hasCelebrated = false;

  function isBirthdayToday(){
    const now = new Date();
    return now.getMonth() === 7 && now.getDate() === 8; // August = month 7
  }

  function showCelebration(){
    if(hasCelebrated) return;
    hasCelebrated = true;
    wrap.style.display = 'none';
    celebrateEl.style.display = 'block';
    celebrateEl.textContent = '🎉 HAPPY BIRTHDAY KIRU 🎉';
    heartConfettiBurst(60);
  }

  function tick(){
    if(isBirthdayToday()){
      showCelebration();
      return;
    }

    const target = getBirthdayTarget();
    const now = new Date();
    const diff = target - now;

    if(diff <= 0){
      showCelebration();
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}

/* =========================================================
   10. FLOATING HEARTS (ambient, whole page)
========================================================= */
function spawnHeart(){
  const field = document.getElementById('heartField');
  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  heart.textContent = Math.random() > 0.5 ? '♡' : '✦';
  const left = Math.random() * 100;
  const duration = 10 + Math.random() * 10;
  const size = 0.8 + Math.random() * 1.1;
  heart.style.left = left + 'vw';
  heart.style.animationDuration = duration + 's';
  heart.style.fontSize = size + 'rem';
  field.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000 + 500);
}

function initFloatingHearts(){
  const isSmall = window.matchMedia('(max-width: 600px)').matches;
  const interval = isSmall ? 2200 : 1400; // fewer on phones for performance
  setInterval(spawnHeart, interval);
  for(let i = 0; i < 5; i++) setTimeout(spawnHeart, i * 400);
}

/* =========================================================
   11. FALLING PETALS (letter section only, plays while in view)
========================================================= */
function spawnPetal(){
  const field = document.getElementById('petalField');
  const petal = document.createElement('div');
  petal.className = 'petal';
  const left = Math.random() * 100;
  const duration = 9 + Math.random() * 8;
  const size = 8 + Math.random() * 10;
  petal.style.left = left + '%';
  petal.style.width = size + 'px';
  petal.style.height = size + 'px';
  petal.style.animationDuration = duration + 's';
  field.appendChild(petal);
  setTimeout(() => petal.remove(), duration * 1000 + 300);
}

function initPetals(){
  let petalInterval = null;
  const letterSection = document.getElementById('letter');

  const petalObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        if(!petalInterval){
          for(let i = 0; i < 8; i++) setTimeout(spawnPetal, i * 250);
          petalInterval = setInterval(spawnPetal, 650);
        }
      } else {
        clearInterval(petalInterval);
        petalInterval = null;
      }
    });
  }, { threshold: 0.1 });

  petalObserver.observe(letterSection);
}

/* =========================================================
   12. AMBIENT CANVAS — glowing particles + sparkles drifting
========================================================= */
function initAmbientCanvas(){
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.documentElement.scrollHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // scale particle count to screen area & device, capped for mobile performance
  const isSmall = window.matchMedia('(max-width: 600px)').matches;
  const cap = isSmall ? 34 : 70;
  const COUNT = Math.min(cap, Math.floor((window.innerWidth * window.innerHeight) / 18000));

  function makeParticle(){
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.6,
      speedY: Math.random() * 0.25 + 0.06,
      speedX: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.15,
      pulse: Math.random() * Math.PI * 2,
      isSparkle: Math.random() > 0.82
    };
  }
  for(let i = 0; i < COUNT; i++) particles.push(makeParticle());

  function draw(){
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.pulse += 0.02;
      const alpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      ctx.beginPath();

      if(p.isSparkle){
        const s = p.r * 2.6;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#D9B99B';
        ctx.beginPath();
        ctx.moveTo(0, -s); ctx.lineTo(s * 0.28, -s * 0.28);
        ctx.lineTo(s, 0); ctx.lineTo(s * 0.28, s * 0.28);
        ctx.lineTo(0, s); ctx.lineTo(-s * 0.28, s * 0.28);
        ctx.lineTo(-s, 0); ctx.lineTo(-s * 0.28, -s * 0.28);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = `rgba(217,185,155,${alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      p.y -= p.speedY;
      p.x += p.speedX;
      if(p.y < -10){ p.y = h + 10; p.x = Math.random() * w; }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* =========================================================
   13. PARALLAX — hero blobs drift at different speeds on scroll
========================================================= */
function initParallax(){
  const blobs = document.querySelectorAll('.hero-bg-blob');
  if(!blobs.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if(!ticking){
      requestAnimationFrame(() => {
        const y = window.scrollY;
        blobs.forEach((blob, i) => {
          const speed = i % 2 === 0 ? 0.18 : 0.28;
          blob.style.transform = `translateY(${y * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* =========================================================
   14. CUSTOM CURSOR — glowing heart + trailing sparkles
========================================================= */
function initCustomCursor(){
  // skip entirely on touch devices
  if(window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'cursor-heart';
  cursor.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.2-4.6-10-9.2C0.4 8.6 2 5 5.6 5 8 5 9.6 6.4 12 9c2.4-2.6 4-4 6.4-4C22 5 23.6 8.6 22 11.8 19.2 16.4 12 21 12 21z"/></svg>`;
  document.body.appendChild(cursor);

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let curX = mouseX, curY = mouseY;
  let lastSparkle = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // throttle sparkle trail so it stays performant
    const now = performance.now();
    if(now - lastSparkle > 90){
      lastSparkle = now;
      spawnCursorSparkle(mouseX, mouseY);
    }
  }, { passive: true });

  document.addEventListener('mousedown', () => cursor.classList.add('pressed'));
  document.addEventListener('mouseup', () => cursor.classList.remove('pressed'));

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });

  function loop(){
    // slight easing so the heart glides rather than snaps
    curX += (mouseX - curX) * 0.18;
    curY += (mouseY - curY) * 0.18;
    cursor.style.left = curX + 'px';
    cursor.style.top = curY + 'px';
    requestAnimationFrame(loop);
  }
  loop();
}

function spawnCursorSparkle(x, y){
  const s = document.createElement('div');
  s.className = 'cursor-sparkle';
  s.textContent = '✦';
  s.style.left = (x + (Math.random() * 14 - 7)) + 'px';
  s.style.top = (y + (Math.random() * 14 - 7)) + 'px';
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 700);
}

/* =========================================================
   15. SPARKLE BURST + HEART CONFETTI HELPERS
========================================================= */
function burstSparkles(x, y, count = 14){
  for(let i = 0; i < count; i++){
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.textContent = '✦';
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 60;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    s.style.transform = `translate(${dx}px, ${dy}px)`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 950);
  }
}

function heartConfettiBurst(count = 40){
  const symbols = ['🤍', '✦', '🎉'];
  for(let i = 0; i < count; i++){
    setTimeout(() => {
      const h = document.createElement('div');
      h.className = 'confetti-heart';
      h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      h.style.left = Math.random() * 100 + 'vw';
      h.style.fontSize = (0.9 + Math.random() * 1.2) + 'rem';
      h.style.setProperty('--drift', (Math.random() * 160 - 80) + 'px');
      h.style.animationDuration = (2.6 + Math.random() * 2) + 's';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 5000);
    }, i * 40);
  }
}

/* =========================================================
   16. MUSIC PLAYER — vinyl toggle button, default OFF
========================================================= */
function initMusicPlayer(){
  const btn = document.getElementById('vinylBtn');
  const audio = document.getElementById('bgAudio');
  const tooltip = document.getElementById('musicTooltip');
  let isPlaying = false;

  btn.addEventListener('click', () => {
    if(!isPlaying){
      audio.play()
        .then(() => {
          isPlaying = true;
          btn.classList.add('playing');
          tooltip.textContent = 'now playing';
        })
        .catch(() => {
          // no audio file added yet under /audio — fail gracefully
          tooltip.textContent = 'add a song to /audio to enable';
        });
    } else {
      audio.pause();
      isPlaying = false;
      btn.classList.remove('playing');
      tooltip.textContent = 'play our song';
    }
  });
}

/* =========================================================
   17. INIT
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  buildTimeline();
  buildGallery();
  buildMemoryJar();
  buildReasons();
  initLightbox();
  initScrollReveal();
  initCountdown();
  initFloatingHearts();
  initPetals();
  initAmbientCanvas();
  initParallax();
  initCustomCursor();
  initMusicPlayer();
  typeText(document.getElementById('typedSub'), TYPED_TEXT);

  // little sparkle celebration whenever the surprise button is used
  const openBtn = document.getElementById('openSurpriseBtn');
  openBtn.addEventListener('click', (e) => {
    const rect = e.target.getBoundingClientRect();
    burstSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    setTimeout(() => {
      document.getElementById('journey').scrollIntoView({ behavior: 'smooth' });
    }, 250);
  });
  openBtn.addEventListener('mouseenter', (e) => {
    const rect = e.target.getBoundingClientRect();
    burstSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, 6);
  });
});
