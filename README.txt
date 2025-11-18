Juplite v3.1 — Lighthouse-optimized skeleton

Files:
- index.html   — main landing with Jupiter Plugin, EN/RU, SEO, structured data, cache-busting
- swap.html    — direct swap page (/swap?pair=SOL-USDC) with referral and cache-busting
- mobile.html  — mobile / PWA view with Phantom / Solflare deep links and wallet detection
- manifest.json — PWA manifest (start_url=/mobile, scope=/, icons 192/256/384/512)
- styles.css   — dark theme styles, responsive, Lighthouse friendly
- script.js    — common JS helper (year in footer)

Icons referenced (must be provided by you):
- /favicon.ico
- /icon-192.png
- /icon-256.png
- /icon-384.png
- /icon-512.png
- /ui-logo-64.png
- /og.jpg

Steps to use:
1) Replace existing files in your juplite.com repo with these.
2) Make sure icons above exist in the root folder.
3) Deploy.
4) Run Lighthouse against:
   - https://juplite.com/
   - https://juplite.com/swap?pair=SOL-USDC
   - https://juplite.com/mobile
