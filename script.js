// Entry animation
const entry = document.getElementById('entry');
const skipEntry = document.getElementById('skipEntry');
const entryProgress = document.getElementById('entryProgress');
const lights = [...document.querySelectorAll('.light')];
document.body.style.overflow = 'hidden';

function finishEntry(){
  entry.classList.add('done');
  document.body.style.overflow = '';
}

setTimeout(()=>entry.classList.add('go'),120);
lights.forEach((light,index)=>{
  setTimeout(()=>light.classList.add('on'), 300 + (index*180));
});
setTimeout(()=>{
  entryProgress.style.transition = 'width 1.2s linear';
  entryProgress.style.width = '100%';
},800);
setTimeout(finishEntry, 3000);
skipEntry.addEventListener('click', finishEntry);

// Sticky topbar
const topbar = document.getElementById('topbar');
window.addEventListener('scroll',()=>{
  if(window.scrollY > 40) topbar.classList.add('compact');
  else topbar.classList.remove('compact');
},{passive:true});

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
  const rect = storyPin.getBoundingClientRect();
  const total = storyPin.offsetHeight - window.innerHeight;
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
    heroImage.src = src;
    heroTitle.textContent = title;
    heroText.textContent = texts[title] || '';
    lbImg.src = src;
    lb.classList.add('open');
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

document.getElementById('lightboxClose').addEventListener('click',()=>lb.classList.remove('open'));
lb.addEventListener('click',(e)=>{ if(e.target === lb) lb.classList.remove('open'); });
window.addEventListener('keydown',(e)=>{ if(e.key==='Escape') lb.classList.remove('open'); });

// Active nav link
const navs = [...document.querySelectorAll('.navlinks a')];
const sections = navs.map(a=>document.querySelector(a.getAttribute('href')));
const navObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      navs.forEach(a=>a.classList.toggle('active', a.getAttribute('href') === '#'+e.target.id));
    }
  });
},{rootMargin:'-30% 0px -50% 0px', threshold:0});
sections.forEach(s=>s && navObs.observe(s));
