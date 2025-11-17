
(function(){ 
  var JUP_REF="5AnFdijpAt5jhyhtP2ccMHVjMzC1LFAwRKEQiCtQsdHPz";
  var RAY_REF="FpJWQNTP71qeWgrV2Pq1Ugyx8bMh5YQYaXqEegKM7Ewg";
  var LANG_KEY='juplite_lang';

  function detectLang(){ 
    var stored=localStorage.getItem(LANG_KEY);
    if(stored) return stored;
    var nav=(navigator.language||'en').toLowerCase();
    return nav.indexOf('ru')===0?'ru':'en';
  }
  function setLang(l){ localStorage.setItem(LANG_KEY,l); }
  function applyI18n(dict){
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k=el.getAttribute('data-i18n');
      if(dict[k]) el.textContent=dict[k];
    });
  }
  function highlightLang(current){
    document.querySelectorAll('[data-lang]').forEach(function(btn){
      btn.classList.toggle('active',btn.getAttribute('data-lang')===current);
    });
  }
  function initBanner(lang){
    fetch('/assets/config.json').then(r=>r.json()).then(function(cfg){
      var banner=document.getElementById('promo-banner'); if(!banner) return;
      var params=new URLSearchParams(location.search);
      var promo=params.get('promo');
      var show=cfg.zeroFee || (promo && promo.toLowerCase()==='zerofee');
      if(!show){ banner.style.display='none'; return; }
      banner.style.display='flex';
      banner.querySelector('.txt').textContent = lang==='ru' ? cfg.bannerTextRu : cfg.bannerTextEn;
    }).catch(function(){});
  }
  function setIframePair(){
    var frame=document.getElementById('jup-frame'); if(!frame) return;
    var params=new URLSearchParams(location.search);
    var pair=params.get('pair');
    var url=new URL('https://jup.ag/swap');
    if(pair) url.pathname='/swap/'+pair;
    url.searchParams.set('ref',JUP_REF);
    frame.src=url.toString();
  }
  function initRay(){
    var ray=document.getElementById('ray-btn');
    if(ray) ray.href='https://raydium.io/swap/?referrer='+RAY_REF;
  }
  

  function initMobileMenu(){
    var header=document.querySelector('.header');
    var nav=document.querySelector('.nav');
    var toggle=document.getElementById('menu-toggle');
    if(!header || !nav || !toggle) return;
    toggle.addEventListener('click',function(){
      var isOpen=header.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded',isOpen?'true':'false');
    });
    nav.querySelectorAll('a,button').forEach(function(el){
      el.addEventListener('click',function(){
        if(window.innerWidth<=768){
          header.classList.remove('menu-open');
          toggle.setAttribute('aria-expanded','false');
        }
      });
    });
  }

  function wireLangButtons(){
    document.querySelectorAll('[data-lang]').forEach(function(btn){
      btn.addEventListener('click',function(){
        var l=btn.getAttribute('data-lang');
        setLang(l);
        var url=new URL(location.href);
        url.searchParams.set('lang',l);
        location.href=url.toString();
      });
    });
  }
  function loadLang(){
    var qs=new URLSearchParams(location.search);
    var forced=qs.get('lang');
    var chosen=forced || detectLang();
    if(forced) setLang(forced);
    highlightLang(chosen);
    var file=chosen==='ru'?'/assets/ru.json':'/assets/en.json';
    return fetch(file).then(r=>r.json()).then(function(dict){
      applyI18n(dict);
      initBanner(chosen);
    }).catch(function(){ initBanner(chosen); });
  }
  function loadAnalytics(){
    var s=document.createElement('script');s.defer=true;s.src='/assets/analytics.js';document.head.appendChild(s);
  }
  document.addEventListener('DOMContentLoaded',function(){
    loadAnalytics();
    loadLang().then(function(){
      setIframePair();
      initRay();
    initMobileMenu();
      wireLangButtons();
    });
  });
})();
