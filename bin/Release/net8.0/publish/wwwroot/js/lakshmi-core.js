// --- MAIN SITE LOGIC ---
window.addEventListener('load', () => {
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    if(pre) { pre.style.opacity = '0'; pre.style.visibility = 'hidden'; }
  }, 1500);
});

window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if(nav) {
      if (window.scrollY > 40) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
  }
  updateSubnavActiveState();
});

// Hero Slideshow
const heroVideo = document.getElementById('hero-video');
const heroSlides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;
function startSlideshow() {
  if(heroVideo) { heroVideo.style.opacity = '0'; setTimeout(() => { heroVideo.style.display = 'none'; }, 1000); }
  if(heroSlides.length > 0) {
      heroSlides.forEach(slide => slide.classList.remove('active'));
      heroSlides[0].classList.add('active');
      setInterval(nextSlide, 6000);
  }
}
function nextSlide() {
  heroSlides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % heroSlides.length;
  heroSlides[currentSlide].classList.add('active');
}
if (heroVideo) {
  heroVideo.onended = startSlideshow;
  setTimeout(startSlideshow, 8000);
}

// Typewriter
const typeText = document.getElementById('typewriter');
if(typeText) {
    const phrases = ["modern textile.", "modern fashion.", "global brands."];
    let phraseIndex = 0, charIndex = 0, isDeleting = false;
    function type() {
      const current = phrases[phraseIndex];
      if (isDeleting) {
        typeText.textContent = current.substring(0, charIndex - 1); charIndex--;
      } else {
        typeText.textContent = current.substring(0, charIndex + 1); charIndex++;
      }
      if (!isDeleting && charIndex === current.length) {
        isDeleting = true; setTimeout(type, 1200);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; setTimeout(type, 500);
      } else {
        setTimeout(type, isDeleting ? 30 : 60);
      }
    }
    type();
}

// Theme Toggle
function toggleTheme() {
  const html = document.documentElement;
  const icon = document.getElementById('themeIcon');
  if (html.getAttribute('data-theme') === 'light') {
    html.setAttribute('data-theme', 'dark'); icon.classList.replace('fa-moon', 'fa-sun');
  } else {
    html.setAttribute('data-theme', 'light'); icon.classList.replace('fa-sun', 'fa-moon');
  }
}

// Scroll Observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      if (entry.target.querySelector('.stat-num')) runCounters(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

function runCounters(container) {
  const nums = container.querySelectorAll('.stat-num');
  nums.forEach(num => {
    const target = +num.getAttribute('data-count');
    let count = 0;
    const inc = target / 50;
    const timer = setInterval(() => {
      count += inc;
      if (count >= target) { num.innerText = target + (target === 100 ? '%' : '+'); clearInterval(timer); }
      else { num.innerText = Math.ceil(count); }
    }, 30);
  });
}

// Subnav logic
function updateSubnavActiveState() {
  const sections = document.querySelectorAll('section');
  const subnavLinks = document.querySelectorAll('.subnav-link');
  let activeSectionId = null;
  const aboutSec = document.getElementById('about');
  
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= (window.innerHeight / 2) && rect.bottom >= (window.innerHeight / 2)) {
      activeSectionId = section.id;
    }
  });
  if (aboutSec && window.scrollY < aboutSec.offsetTop - 200) activeSectionId = 'about';
  subnavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').substring(1) === activeSectionId) link.classList.add('active');
  });
}

// --- DONUT LOGIC INTEGRATION ---
(function(){
    const donutRoot = document.getElementById('donutRoot');
    if(!donutRoot) return;

  // Process Data Sync
  const phases = [
    { label: 'Yarn', desc: 'Premium organic cotton sourcing. 25,000 spindles producing combed, compact and siro yarns ensuring defect-free base.', vid: 'https://cdn.pixabay.com/video/2021/09/11/88235-602915735_small.mp4' },
    { label: 'Winding', desc: 'Automated winding processes ensuring high tensile strength and uniformity for the knitting stage.', vid: 'https://cdn.pixabay.com/video/2016/10/22/5999-188371391_small.mp4' },
    { label: 'Knitting', desc: 'Mayer & Cie circular knitting machines creating Jersey, Pique, Fleece, and Interlock fabrics with auto-stripers.', vid: 'https://cdn.pixabay.com/video/2020/04/18/36465-412204996_small.mp4' },
    { label: 'Dyeing', desc: 'Soft-flow HTHP dyeing with spectrophotometer colour matching. Zero Liquid Discharge (ZLD) eco-friendly processing.', vid: 'https://cdn.pixabay.com/video/2016/11/21/6462-192534568_small.mp4' },
    { label: 'Sewing', desc: 'Automated cutting and 1,200 sewing stations. Dedicated lines for tees, polos and activewear with inline QCs.', vid: 'https://cdn.pixabay.com/video/2020/07/02/43639-436357304_small.mp4' },
    { label: 'Dispatch', desc: 'Final AQL 2.5 audits, sustainable packaging, and global logistics handling for on-time delivery.', vid: 'https://cdn.pixabay.com/video/2021/04/24/72120-541249929_small.mp4' },
  ];

  const size = 520;
  const center = size / 2;
  const outerRadius = 210;
  const innerRadius = 110;
  const slices = phases.length;

  const gradients = [
    ['#0284c7','#38bdf8'], ['#0ea5e9','#7dd3fc'], ['#0369a1','#0ea5e9'], ['#1d4ed8','#60a5fa'], ['#4338ca','#818cf8'], ['#6366f1','#a5b4fc']
  ];

  const svg = document.getElementById('donutSvg');
  const defs = document.getElementById('defsArea');
  const rotGroup = document.getElementById('rotGroup');
  const centerTitle = document.getElementById('centerTitle');
  const root = document.getElementById('donutRoot');
  const labelNodes = [];
  let selected = 0;

  const pdNum = document.getElementById('pdNum');
  const pdTitle = document.getElementById('pdTitle');
  const pdDesc = document.getElementById('pdDesc');
  const pdVideo = document.getElementById('pdVideo');
  const detailCard = document.getElementById('detailCard');

  function polar(cx, cy, r, angleRad){
    return { x: cx + Math.cos(angleRad) * r, y: cy + Math.sin(angleRad) * r };
  }

  function createGradients(){
    for (let i=0;i<slices;i++){
      const id = 'grad-'+i;
      const g = document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
      g.setAttribute('id', id); g.setAttribute('x1','0'); g.setAttribute('x2','1'); g.setAttribute('y1','0'); g.setAttribute('y2','1');
      const stop1 = document.createElementNS('http://www.w3.org/2000/svg','stop');
      stop1.setAttribute('offset','0%'); stop1.setAttribute('stop-color', gradients[i % gradients.length][0]);
      const stop2 = document.createElementNS('http://www.w3.org/2000/svg','stop');
      stop2.setAttribute('offset','100%'); stop2.setAttribute('stop-color', gradients[i % gradients.length][1]);
      g.appendChild(stop1); g.appendChild(stop2); defs.appendChild(g);
    }
  }

  function describeSlice(startAngle, endAngle){
    const p1 = polar(center, center, outerRadius, startAngle);
    const p2 = polar(center, center, outerRadius, endAngle);
    const p3 = polar(center, center, innerRadius, endAngle);
    const p4 = polar(center, center, innerRadius, startAngle);
    const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${p4.x} ${p4.y} Z`;
  }

  function build(){
    createGradients();
    rotGroup.innerHTML = '';
    const anglePer = (Math.PI * 2) / slices;

    for (let i=0;i<slices;i++){
      const start = i * anglePer - Math.PI/2;
      const end = start + anglePer;
      const mid = (start + end) / 2;
      const g = document.createElementNS('http://www.w3.org/2000/svg','g');
      g.setAttribute('data-index', i);
      
      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d', describeSlice(start,end));
      path.setAttribute('fill', `url(#grad-${i})`);
      path.setAttribute('class', 'slice-path');
      path.addEventListener('click', ()=> select(i));
      path.style.transformOrigin = `${center}px ${center}px`;

      g.appendChild(path);
      rotGroup.appendChild(g);

      const label = document.createElement('div');
      label.className = 'donut-label';
      const labelBtn = document.createElement('button');
      labelBtn.className = 'label-btn';
      labelBtn.innerHTML = `
        <div class="label-icon"><i class="fa-solid fa-chevron-right" style="font-size:10px;"></i></div>
        <div style="text-align:left; flex:1;">
          <div style="font-weight:700;">${phases[i].label}</div>
        </div>
      `;
      labelBtn.onclick = () => select(i);
      label.appendChild(labelBtn);
      root.appendChild(label);
      labelNodes.push({ node: label, midAngle: mid, idx: i });
    }
    positionLabels();
    applySelection();
  }

  function positionLabels(){
    const labelRadius = (innerRadius + outerRadius)/2 + 65;
    for (const obj of labelNodes){
      const pos = polar(center, center, labelRadius, obj.midAngle);
      obj.node.style.left = `${pos.x}px`;
      obj.node.style.top = `${pos.y}px`;
    }
  }

  function applySelection(){
    rotGroup.querySelectorAll('g').forEach(g => g.style.transform = 'translate(0px,0px)');
    const anglePer = (Math.PI * 2) / slices;
    const mid = (selected * anglePer - Math.PI/2) + anglePer/2;
    const pop = 15;
    const tx = Math.cos(mid) * pop;
    const ty = Math.sin(mid) * pop;
    const selGroup = rotGroup.querySelector(`g[data-index="${selected}"]`);
    if(selGroup) selGroup.style.transform = `translate(${tx}px, ${ty}px)`;

    centerTitle.textContent = phases[selected].label;

    labelNodes.forEach(obj=>{
      const btn = obj.node.querySelector('.label-btn');
      if(obj.idx === selected) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    detailCard.classList.remove('active');
    setTimeout(() => {
        pdNum.textContent = `0${selected + 1}`;
        pdTitle.textContent = phases[selected].label + " Phase";
        pdDesc.textContent = phases[selected].desc;
        pdVideo.src = phases[selected].vid;
        detailCard.classList.add('active');
    }, 100);
  }

  function select(i){ selected = i; applySelection(); }
  function next(){ selected = (selected + 1) % slices; applySelection(); }
  function prev(){ selected = (selected - 1 + slices) % slices; applySelection(); }

  const spinBtn = document.getElementById('spinToggle');
  spinBtn.addEventListener('click', ()=>{
    if(rotGroup.classList.contains('spin')) {
      rotGroup.classList.remove('spin');
      spinBtn.innerHTML = '<i class="fa-solid fa-play" style="margin-right:6px;"></i> Auto';
    } else {
      rotGroup.classList.add('spin');
      spinBtn.innerHTML = '<i class="fa-solid fa-pause" style="margin-right:6px;"></i> Pause';
    }
  });

  document.getElementById('nextBtn').addEventListener('click', next);
  document.getElementById('prevBtn').addEventListener('click', prev);
  build();
})();