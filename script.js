// === GR86 CINEMATIC LAYER 01 ===
// Stable static runtime: no framework, no external libraries.

const cinemaCSS = `
:root{--hero-p:0;--mx:50%;--my:50%;}
.entry{overflow:hidden;background:#000!important;isolation:isolate}
.entry::before{content:"86";position:absolute;right:-7vw;top:50%;transform:translateY(-50%) scale(.92);font:900 clamp(260px,44vw,720px)/.7 Arial,sans-serif;letter-spacing:-.14em;color:transparent;-webkit-text-stroke:1px rgba(255,255,255,.055);opacity:0;transition:opacity .7s .45s ease,transform 1.1s .45s cubic-bezier(.2,.8,.15,1);z-index:-1}
.entry.go::before{opacity:1;transform:translateY(-50%) scale(1)}
.entry::after{content:"";position:absolute;left:-20%;top:51%;width:0;height:2px;background:linear-gradient(90deg,transparent,#eb0a1e 24%,#fff 58%,#eb0a1e 78%,transparent);box-shadow:0 0 26px rgba(235,10,30,.7);transform:skewX(-22deg);transition:width 1.15s .7s cubic-bezier(.2,.8,.15,1)}
.entry.go::after{width:140%}
.entry__inner{width:min(94vw,1480px)!important;text-align:left!important;padding:0 clamp(24px,6vw,96px);}
.entry .brand{justify-content:flex-start!important;gap:16px!important;opacity:.76}
.entry .grbox{width:74px!important;height:40px!important;box-shadow:none!important}
.entry .lights{position:absolute;right:clamp(24px,6vw,96px);top:6px;margin:0!important;gap:10px!important}
.entry .light{width:10px!important;height:10px!important}
.entry h1{font-size:clamp(66px,10.8vw,176px)!important;line-height:.73!important;letter-spacing:-.095em!important;max-width:1100px;margin-top:44px!important;text-transform:uppercase}
.entry p{max-width:520px!important;margin:24px 0 0!important;font-size:12px!important;line-height:1.6!important;letter-spacing:.12em!important;text-transform:uppercase;color:#7d7d84!important}
.entry__line{margin:34px 0 0!important;width:min(520px,66vw)!important;height:2px!important;background:#202025!important}
.skip{right:clamp(24px,6vw,96px)!important;bottom:28px!important;border-radius:0!important;background:#000!important;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);font-size:10px;letter-spacing:.12em;text-transform:uppercase}
.cinema-kicker{position:absolute;left:clamp(24px,6vw,96px);bottom:34px;font-size:9px;letter-spacing:.24em;color:#616169;text-transform:uppercase}
.cinema-kicker b{color:#eb0a1e;font-weight:700}
.cinema-slit{position:absolute;z-index:2;top:0;bottom:0;width:14vw;background:linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent);filter:blur(1px);transform:skewX(-11deg) translateX(-40vw);pointer-events:none}
.entry.go .cinema-slit{animation:cinemaSlit 1.4s 1.1s cubic-bezier(.2,.8,.15,1) forwards}
@keyframes cinemaSlit{to{transform:skewX(-11deg) translateX(150vw)}}

.hero{min-height:115svh!important;padding-bottom:0!important;background:#020202!important;--camX:0px;--camY:0px}
.hero::before,.hero::after{content:"";position:absolute;left:0;right:0;height:clamp(15px,2.2vh,28px);background:#000;z-index:18;pointer-events:none;transition:height .6s ease}.hero::before{top:0}.hero::after{bottom:0}
.hero__bg{transform:translate3d(var(--camX),var(--camY),0) scale(calc(1.09 + (var(--hero-p) * .08)))!important;transform-origin:58% 50%;filter:brightness(calc(.46 + (var(--hero-p) * .12))) saturate(.82) contrast(1.1)!important;transition:filter .15s linear!important;will-change:transform,filter}
.hero__overlay{z-index:2;background:linear-gradient(90deg,#020202 0%,rgba(2,2,2,.94) 19%,rgba(2,2,2,.42) 46%,rgba(2,2,2,.06) 72%),linear-gradient(0deg,#000 0%,rgba(0,0,0,.88) 7%,rgba(0,0,0,.08) 44%,rgba(0,0,0,.24) 100%)!important}
.hero__scan{z-index:4!important;opacity:.78}
.hero__content{z-index:8!important;padding:0 clamp(24px,5vw,78px)!important;transform:translate3d(0,calc(var(--hero-p)*-46px),0);opacity:calc(1 - (var(--hero-p)*1.35));transition:none!important}
.hero__eyebrow{font-size:9px!important;letter-spacing:.24em!important;color:#aaa!important}
.hero h2{font-size:clamp(68px,9.8vw,162px)!important;line-height:.75!important;letter-spacing:-.095em!important;max-width:980px!important;margin-top:16px!important;text-transform:uppercase;text-shadow:0 10px 45px rgba(0,0,0,.34)}
.hero__sub{font-size:12px!important;letter-spacing:.08em!important;text-transform:uppercase;line-height:1.65!important;max-width:440px!important;color:#aaa!important}
.hero__cta{margin-top:24px!important}.hero__cta .pill{border-radius:0!important;clip-path:polygon(9px 0,100% 0,calc(100% - 9px) 100%,0 100%);font-size:11px;letter-spacing:.08em;text-transform:uppercase;padding:13px 20px!important;background:rgba(0,0,0,.52);backdrop-filter:blur(10px)}
.hero__cta .pill.red{background:#eb0a1e!important}
.topbar{opacity:calc(.16 + (var(--hero-p)*.84));transform:translateY(calc((1 - var(--hero-p))*-18px));transition:background .3s ease!important}
.grDock{display:none!important}
.hero__scroll{right:clamp(24px,5vw,78px)!important;bottom:42px!important;font-size:8px!important;letter-spacing:.24em!important;z-index:10!important}
.hero__scroll i{width:94px!important;background:linear-gradient(90deg,#eb0a1e,#777)!important}
.hero-ghost{position:absolute;z-index:3;right:-2vw;top:50%;transform:translateY(-50%) translateX(calc(var(--hero-p)*7vw));font:900 min(31vw,470px)/.7 Arial,sans-serif;letter-spacing:-.14em;color:transparent;-webkit-text-stroke:1px rgba(255,255,255,.12);pointer-events:none;opacity:calc(.28 - (var(--hero-p)*.2))}
.hero-hud{position:absolute;z-index:10;right:clamp(24px,5vw,78px);top:24vh;width:210px;color:#aaa;text-transform:uppercase;letter-spacing:.18em;font-size:8px;pointer-events:none}
.hero-hud .hud-line{height:1px;background:#4a4a50;margin:10px 0 11px;position:relative}.hero-hud .hud-line::after{content:"";position:absolute;left:0;top:0;height:1px;width:calc((1 - var(--hero-p))*100%);background:#eb0a1e}.hero-hud strong{display:block;color:#fff;font-size:46px;line-height:.85;letter-spacing:-.07em}.hero-hud small{display:block;margin-top:6px;color:#686870;font-size:7px}.hero-cut{position:absolute;z-index:17;inset:0;pointer-events:none;opacity:0;background:linear-gradient(101deg,transparent 0 42%,rgba(235,10,30,.92) 42.2% 43.4%,#050505 43.6% 100%);transform:translateX(100%)}
.hero.transitioning .hero-cut{opacity:1;transform:translateX(calc((1 - var(--hero-p))*105%));transition:none}
.story{position:relative;isolation:isolate}
.story::before{content:"RUN 01 / CONTROL";position:absolute;z-index:4;left:clamp(24px,5vw,78px);top:24px;font:700 9px/1.2 'Courier New',monospace;letter-spacing:.24em;color:#6b6b72}
.story::after{content:"";position:absolute;z-index:3;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,#eb0a1e 0 12%,#fff 12% 14%,transparent 14%)}
@media(max-width:820px){.entry__inner{padding:0 20px}.entry .lights{right:20px}.entry h1{font-size:clamp(58px,17vw,96px)!important}.entry p{font-size:10px!important}.cinema-kicker{left:20px}.hero__content{padding:0 20px!important}.hero h2{font-size:clamp(58px,16vw,92px)!important}.hero-hud{display:none}.hero-ghost{font-size:58vw;right:-16vw}.hero__scroll{right:20px!important}.topbar{padding:0 14px!important}.hero__bg{background-position:62% center!important}}
@media(prefers-reduced-motion:reduce){.cinema-slit{display:none}.hero__bg{transform:none!important}.entry::after{display:none}}
`;
const cinemaStyle = document.createElement('style');
cinemaStyle.id = 'cinema-layer-01';
cinemaStyle.textContent = cinemaCSS;
document.head.appendChild(cinemaStyle);

// Entry animation
const entry = document.getElementById('entry');
const skipEntry = document.getElementById('skipEntry');
const entryProgress = document.getElementById('entryProgress');
const lights = [...document.querySelectorAll('.light')];

document.body.style.overflow = 'hidden';

if(entry){
  entry.insertAdjacentHTML('beforeend', '<div class="cinema-slit"></div><div class="cinema-kicker"><b>TOYOTA GAZOO RACING</b> / GR86 / DIRECTOR\'S OPENING</div>');
  const entryTitle = entry.querySelector('h1');
  const entryCopy = entry.querySelector('p');
  if(entryTitle) entryTitle.innerHTML = 'BORN TO<br><em>BE DRIVEN.</em>';
  if(entryCopy) entryCopy.textContent = 'One machine. One driver. No distance between input and response.';
}

function finishEntry(){
  if(!entry) return;
  entry.classList.add('done');
  document.body.style.overflow = '';
}

setTimeout(()=>entry?.classList.add('go'),140);
lights.forEach((light,index)=>{
  setTimeout(()=>light.classList.add('on'), 420 + (index*120));
});
setTimeout(()=>{
  if(entryProgress){
    entryProgress.style.transition = 'width 1.35s linear';
    entryProgress.style.width = '100%';
  }
},900);
setTimeout(finishEntry, 3300);
skipEntry?.addEventListener('click', finishEntry);

// Hero cinematic additions
const hero = document.querySelector('.hero');
if(hero){
  hero.insertAdjacentHTML('beforeend', `
    <div class="hero-ghost" aria-hidden="true">86</div>
    <div class="hero-hud" aria-hidden="true">
      <span>RUN 01 / GR86</span>
      <div class="hud-line"></div>
      <strong>2.4</strong>
      <small>BOXER / RWD / DRIVER FIRST</small>
    </div>
    <div class="hero-cut" aria-hidden="true"></div>
  `);
}

// Sticky topbar
const topbar = document.getElementById('topbar');

// Hero scroll + camera system
let heroProgress = 0;
function updateHeroCinema(){
  if(!hero) return;
  const vh = Math.max(window.innerHeight,1);
  const y = Math.max(0, window.scrollY);
  heroProgress = Math.max(0, Math.min(1, y / (vh * .92)));
  document.documentElement.style.setProperty('--hero-p', heroProgress.toFixed(4));
  hero.classList.toggle('transitioning', heroProgress > .58);
  if(topbar) topbar.classList.toggle('compact', y > 40);
}
window.addEventListener('scroll', updateHeroCinema, {passive:true});
window.addEventListener('resize', updateHeroCinema);
updateHeroCinema();

// Pointer-driven camera drift: subtle, never game-like.
let targetX = 0, targetY = 0, camX = 0, camY = 0;
window.addEventListener('pointermove',(e)=>{
  if(!hero || window.scrollY > window.innerHeight*1.15) return;
  targetX = ((e.clientX / window.innerWidth) - .5) * -16;
  targetY = ((e.clientY / window.innerHeight) - .5) * -9;
},{passive:true});
function cameraLoop(){
  camX += (targetX-camX)*.055;
  camY += (targetY-camY)*.055;
  if(hero){
    hero.style.setProperty('--camX', `${camX.toFixed(2)}px`);
    hero.style.setProperty('--camY', `${camY.toFixed(2)}px`);
  }
  requestAnimationFrame(cameraLoop);
}
if(!matchMedia('(prefers-reduced-motion: reduce)').matches) cameraLoop();

// Reveal on view
const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add('show');
  });
},{threshold:.18});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// Story pin transitions
const panels = [...document.querySelectorAll('.storyPanel')];
const storyPin = document.getElementById('storyPin');
function updateStory(){
  if(!storyPin) return;
  const rect = storyPin.getBoundingClientRect();
  const total = Math.max(1, storyPin.offsetHeight - window.innerHeight);
  const progress = Math.max(0, Math.min(1, -rect.top / total));
  let index = 0;
  if(progress >= .33 && progress < .66) index = 1;
  if(progress >= .66) index = 2;
  panels.forEach((panel,i)=>panel.classList.toggle('active', i===index));
}
window.addEventListener('scroll', updateStory, {passive:true});
window.addEventListener('resize', updateStory);
updateStory();

// Count up
function animateCount(el){
  if(el.dataset.done) return;
  el.dataset.done = '1';
  const target = parseFloat(el.getAttribute('data-count'));
  const isMoney = target > 1000;
  const duration = 1200;
  const start = performance.now();
  function frame(now){
    const p = Math.min(1,(now-start)/duration);
    const eased = 1 - Math.pow(1-p,3);
    const val = target*eased;
    if(isMoney){
      el.textContent = Math.floor(val).toLocaleString();
    }else{
      el.textContent = target % 1 ? val.toFixed(1) : Math.floor(val);
    }
    if(p<1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
const metricObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('[data-count]').forEach(animateCount);
    }
  });
},{threshold:.45});
document.querySelectorAll('.metricsBox').forEach(el=>metricObs.observe(el));

// Gallery behavior
const heroImage = document.getElementById('galleryHeroImage');
const heroTitle = document.getElementById('galleryHeroTitle');
const heroText = document.getElementById('galleryHeroText');
const thumbs = [...document.querySelectorAll('.galleryThumb')];
const tabs = [...document.querySelectorAll('.galleryTab')];
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lightboxImage');

const texts = {
  'Hero frame': 'The lead image should feel like a poster frame from the driving experience — dramatic, close, and loaded with texture.',
  'Low centre of gravity': 'The story imagery should carry the philosophy of the car, not just decorate it.',
  'Nothing between you and the drive': 'This is the emotional high point of the page — the GR86 distilled into one direct statement.',
  'Available grade': 'Even the commercial grade section should feel resolved and premium after the cinematic journey.'
};

thumbs.forEach(t=>{
  t.addEventListener('click',()=>{
    const src = t.dataset.full;
    const title = t.dataset.title;
    if(heroImage) heroImage.src = src;
    if(heroTitle) heroTitle.textContent = title;
    if(heroText) heroText.textContent = texts[title] || '';
    if(lbImg) lbImg.src = src;
    lb?.classList.add('open');
  });
});

tabs.forEach(tab=>{
  tab.addEventListener('click',()=>{
    tabs.forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    const set = tab.dataset.set;
    thumbs.forEach(thumb=>{
      thumb.style.display = (set === 'all' || thumb.dataset.set === set) ? '' : 'none';
    });
  });
});

document.getElementById('lightboxClose')?.addEventListener('click',()=>lb?.classList.remove('open'));
lb?.addEventListener('click',(e)=>{ if(e.target === lb) lb.classList.remove('open'); });
window.addEventListener('keydown',(e)=>{ if(e.key==='Escape') lb?.classList.remove('open'); });

// Active nav link
const navs = [...document.querySelectorAll('.navlinks a')];
const sections = navs.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
const navObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      navs.forEach(a=>a.classList.toggle('active', a.getAttribute('href') === '#'+e.target.id));
    }
  });
},{rootMargin:'-30% 0px -50% 0px', threshold:0});
sections.forEach(s=>navObs.observe(s));
