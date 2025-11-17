
(function() {
  fetch('/assets/config.json').then(r=>r.json()).then(cfg=>{
    if(cfg.ga4 && cfg.ga4 !== 'G-XXXXXXX') {
      var s1=document.createElement('script');s1.async=true;
      s1.src='https://www.googletagmanager.com/gtag/js?id='+cfg.ga4;document.head.appendChild(s1);
      var s2=document.createElement('script');
      s2.innerHTML="window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','"+cfg.ga4+"');";
      document.head.appendChild(s2);
    }
    if(cfg.plausible_domain && cfg.plausible_domain!=='example.com') {
      var ps=document.createElement('script');ps.defer=true;
      ps.setAttribute('data-domain',cfg.plausible_domain);
      ps.src='https://plausible.io/js/script.js';document.head.appendChild(ps);
    }
  }).catch(function(){});
})();