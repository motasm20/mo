/* ===== Theme (dark/light) ===== */
(function initTheme(){
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  // Bij eerste bezoek: systeemvoorkeur
  const saved = localStorage.getItem('theme');
  if(saved){
    if(saved === 'light') root.classList.add('light');
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches){
    root.classList.add('light');
  }
  const set = (mode)=> {
    if(mode === 'light'){ root.classList.add('light'); localStorage.setItem('theme','light'); }
    else { root.classList.remove('light'); localStorage.setItem('theme','dark'); }
  };
  btn?.addEventListener('click', ()=>{
    const light = root.classList.contains('light');
    set(light ? 'dark' : 'light');
  });
  // Toets T
  window.addEventListener('keydown', (e)=>{ if(e.key.toLowerCase()==='t') btn?.click(); });
})();

/* ===== Mobile menu ===== */
(function initMobileMenu(){
  const menu = document.getElementById('menu');
  const toggle = document.getElementById('mobile-toggle');
  if(!menu || !toggle) return;
  toggle.addEventListener('click', ()=>{
    const showing = menu.style.display === 'flex';
    menu.style.display = showing ? 'none' : 'flex';
  });
  // Sluit menu na klik (mobiel)
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', ()=>{
    if(window.innerWidth <= 640) menu.style.display = 'none';
  }));
  // Reset bij resize
  window.addEventListener('resize', ()=>{
    if(window.innerWidth > 640) menu.style.display = '';
  });
})();

/* ===== Smooth scroll ===== */
(function initSmoothScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const id = a.getAttribute('href');
      if(id && id.length > 1){
        const el = document.querySelector(id);
        if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); }
      }
    });
  });
})();

/* ===== Active link on scroll ===== */
(function initActiveLink(){
  const links = Array.from(document.querySelectorAll('#menu a'));
  const sections = links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  let ticking = false;
  function onScroll(){
    if(ticking) return;
    window.requestAnimationFrame(()=>{
      const pos = window.scrollY + 120;
      let active = null;
      for(const sec of sections){
        if(sec.offsetTop <= pos) active = sec.id;
      }
      links.forEach(a=>a.classList.toggle('active', '#'+active === a.getAttribute('href')));
      ticking = false;
    });
    ticking = true;
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();

/* ===== Project filter ===== */
(function initProjectFilter(){
  const buttons = document.querySelectorAll('.filter button');
  const cards = document.querySelectorAll('.project-card');
  if(!buttons.length || !cards.length) return;

  function applyFilter(kind){
    cards.forEach(c=>{
      const show = kind === 'all' || c.classList.contains(kind);
      c.style.display = show ? '' : 'none';
      c.classList.toggle('reveal', true);
      if(show) setTimeout(()=> c.classList.add('reveal-in'), 10);
      else c.classList.remove('reveal-in');
    });
  }
  buttons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      buttons.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });
  // default
  applyFilter('all');
})();

/* ===== Scroll reveal animations ===== */
(function initReveal(){
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('reveal-in');
        obs.unobserve(entry.target);
      }
    });
  }, {threshold: 0.15});
  document.querySelectorAll('.reveal, .card, .project-card').forEach(el=> obs.observe(el));
})();

/* ===== Contact formulier (mailto) ===== */
(function initContact(){
  const form = document.querySelector('#contact form');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const inputs = form.querySelectorAll('input, textarea');
    const vals = {};
    inputs.forEach(i=> vals[i.placeholder?.toLowerCase()] = i.value.trim());
    const subject = encodeURIComponent(`Portfolio contact — ${vals['naam']||''}`);
    const body = encodeURIComponent(
      `Van: ${vals['naam']||''} <${vals['e-mail']||''}>\n\n${vals['bericht']||''}\n\n---\nVerzonden via portfolio`
    );
    window.location.href = `mailto:motasm@example.com?subject=${subject}&body=${body}`;
  });
})();
