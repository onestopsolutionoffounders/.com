/* ===================================================
   ONE STOP SOLUTION OF FOUNDERS — SCRIPTS v2
   =================================================== */
(function(){
'use strict';

/* ---- YEAR ---- */
const yr = document.getElementById('yr');
if(yr) yr.textContent = new Date().getFullYear();

/* ---- CURSOR GLOW ---- */
const cursor = document.getElementById('cursorGlow');
if(cursor && window.matchMedia('(pointer:fine)').matches){
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
}

/* ---- SCROLL PROGRESS + HEADER ---- */
const header   = document.getElementById('header');
const progress = document.getElementById('readProgress');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;

  header.classList.toggle('scrolled', y > 60);
  if(progress) progress.style.width = (y / docH * 100) + '%';
  if(scrollTopBtn) scrollTopBtn.classList.toggle('show', y > 400);
}, {passive:true});

if(scrollTopBtn){
  scrollTopBtn.addEventListener('click', () =>
    window.scrollTo({top:0, behavior:'smooth'}));
}

/* ---- MOBILE NAV ---- */
const toggle   = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

toggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  toggle.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}));

/* ---- ACTIVE NAV LINK ---- */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav__link');
const sObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#'+e.target.id));
    }
  });
}, {threshold:.35});
sections.forEach(s => sObs.observe(s));

/* ---- AOS (scroll animations) ---- */
const aosEls = document.querySelectorAll('[data-aos]');
const aosObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      const delay = parseInt(e.target.dataset.aosDelay || 0);
      setTimeout(() => e.target.classList.add('aos-animate'), delay);
      aosObs.unobserve(e.target);
    }
  });
}, {threshold:.1, rootMargin:'0px 0px -40px 0px'});
aosEls.forEach(el => aosObs.observe(el));

/* ---- TYPEWRITER ---- */
const tw = document.getElementById('typewriter');
if(tw){
  const words = ['Start Building.', 'Grow Faster.', 'Launch Smarter.', 'Win Together.'];
  let wi = 0, ci = 0, deleting = false;
  function type(){
    const word = words[wi];
    if(!deleting){
      tw.textContent = word.slice(0, ++ci);
      if(ci === word.length){ deleting = true; setTimeout(type, 1800); return; }
    } else {
      tw.textContent = word.slice(0, --ci);
      if(ci === 0){ deleting = false; wi = (wi+1)%words.length; setTimeout(type, 300); return; }
    }
    setTimeout(type, deleting ? 60 : 100);
  }
  setTimeout(type, 800);
}

/* ---- COUNTER ANIMATION ---- */
function animateCount(el){
  const target = parseInt(el.dataset.count);
  const dur    = 1600;
  const step   = 16;
  const inc    = target / (dur / step);
  let current  = 0;
  const t = setInterval(() => {
    current = Math.min(current + inc, target);
    el.textContent = Math.floor(current);
    if(current >= target) clearInterval(t);
  }, step);
}
const counters = document.querySelectorAll('[data-count]');
const cObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){ animateCount(e.target); cObs.unobserve(e.target); }
  });
}, {threshold:.5});
counters.forEach(c => cObs.observe(c));

/* ---- HERO CANVAS PARTICLES ---- */
const canvas = document.getElementById('heroCanvas');
if(canvas){
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], raf;

  function resize(){
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor(){
      this.reset();
    }
    reset(){
      this.x  = Math.random()*W;
      this.y  = Math.random()*H;
      this.r  = Math.random()*1.5+.5;
      this.vx = (Math.random()-.5)*.4;
      this.vy = (Math.random()-.5)*.4;
      this.a  = Math.random()*.6+.1;
      this.c  = Math.random()>.5 ? '79,70,229' : '245,158,11';
    }
    update(){
      this.x += this.vx;
      this.y += this.vy;
      if(this.x<0||this.x>W||this.y<0||this.y>H) this.reset();
    }
    draw(){
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(${this.c},${this.a})`;
      ctx.fill();
    }
  }

  function initParticles(){
    const count = Math.min(120, Math.floor(W*H/8000));
    particles = Array.from({length:count}, () => new Particle());
  }

  function drawConnections(){
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx = particles[i].x-particles[j].x;
        const dy = particles[i].y-particles[j].y;
        const d  = Math.sqrt(dx*dx+dy*dy);
        if(d<100){
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(79,70,229,${.12*(1-d/100)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
  }

  function loop(){
    ctx.clearRect(0,0,W,H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    raf = requestAnimationFrame(loop);
  }

  resize();
  initParticles();
  loop();
  window.addEventListener('resize', () => { resize(); initParticles(); }, {passive:true});

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if(document.hidden) cancelAnimationFrame(raf);
    else loop();
  });
}

/* ---- CHAOS TAGS hover float ---- */
document.querySelectorAll('.ctag').forEach((tag,i) => {
  tag.style.transitionDelay = (i*0.04)+'s';
});

/* ---- CONTACT FORM ---- */
const form = document.getElementById('contactForm');
const msg  = document.getElementById('formMsg');

if(form){
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = form.querySelector('#fname').value.trim();
    const email = form.querySelector('#femail').value.trim();
    const biz   = form.querySelector('#fbiz').value.trim();

    if(!name||!email||!biz){
      showMsg('⚠️ Please fill in all required fields.','#FCA5A5'); return;
    }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      showMsg('⚠️ Please enter a valid email address.','#FCA5A5'); return;
    }

    const btn = form.querySelector('[type=submit]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Build WhatsApp fallback message
    const services = [...form.querySelectorAll('input[name=s]:checked')].map(c=>c.value).join(', ');
    const waMsg = encodeURIComponent(
      `Hi OSSF! 👋\nName: ${name}\nEmail: ${email}\nBusiness: ${biz}\nServices: ${services||'General enquiry'}`
    );

    setTimeout(() => {
      showMsg('✅ Message sent! We\'ll reach out within 48 hours. Redirecting to WhatsApp…','#6EE7B7');
      form.reset();
      btn.textContent = 'Send Message →';
      btn.disabled = false;
      setTimeout(() => {
        window.open(`https://wa.me/918698693484?text=${waMsg}`,'_blank');
      }, 1500);
      setTimeout(() => { msg.textContent=''; }, 6000);
    }, 1200);
  });
}

function showMsg(text, color){
  msg.textContent = text;
  msg.style.color = color;
  if(color !== '#6EE7B7') setTimeout(()=>{msg.textContent='';msg.style.color='';},4000);
}

/* ---- SMOOTH ANCHOR SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el){ e.preventDefault(); window.scrollTo({top:el.getBoundingClientRect().top+scrollY-80,behavior:'smooth'}); }
  });
});

/* ---- KEYBOARD NAV TOGGLE ---- */
toggle.addEventListener('keydown', e => {
  if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggle.click(); }
});

})();
