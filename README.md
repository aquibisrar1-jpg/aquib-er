# Aquib's SEO Emergency Room™®!!!

A chaotic, interactive "hire me" site for Aquib Israr (SEO / GEO / AEO).
Built with Next.js 14 (but it looks like 1999) (App Router). It has one serverless API route, `/api/checkup`, which runs the live site audit.

## Deploy to Vercel (about 5 minutes)

**Option A: GitHub (recommended)**
1. Create a new GitHub repo (for example `aquib-er`) and upload this folder's contents (everything except `node_modules` and `.next`).
2. Go to vercel.com → Add New → Project → import the repo.
3. Keep the defaults (Framework: Next.js) and click Deploy.
4. Optional: Project → Settings → Domains → add a custom domain, or rename the project so the URL reads `aquib-er.vercel.app`.

**Option B: CLI**
```bash
npm install
npx vercel        # log in, accept defaults
npx vercel --prod
```

## Run locally
```bash
npm install
npm run dev       # http://localhost:3000
```

## Where to edit things
- `app/page.js`: all the copy, stats, career log, research, builds, FAQ, contact links (top of file)
- `components/Popups.js`: the Win95 popups, the raccoon chat, the CAPTCHA, toasts, sound toggle
- `components/ER.js` + `app/api/checkup/route.js`: the live SEO Emergency Room (19 checks plus an AI-crawler robots.txt table)
- `components/CoreUpdate.js`: the Core Update Incident reenactment
- `components/RaccoonHunt.js`: the "Catch the AI Overview" mini-game
- `components/Mascots.js`: the raccoon and the storm cloud (original SVGs)
- `public/Aquib_Israr_CV.pdf`: replace this to update the CV download

## Notes
- Design: 90s GeoCities style, with Comic Sans, Times New Roman, Impact, a Windows 98 taskbar and popups. Comic Neue and Anton load only as fallbacks on phones that don't have Comic Sans or Impact (Android).
- Sound effects are on by default. They start after the visitor's first click, because browsers block sound before that. The taskbar has a SOUND ON/OFF toggle.
- The checkup fetches only the homepage, robots.txt, sitemap.xml and llms.txt. It blocks private and localhost addresses, caps responses at 2 MB, times out after 9 seconds, and stores nothing.
- Some sites (Cloudflare-protected ones, for example) may block the checker's requests. The ER shows a funny error when that happens.

## Microsoft Clarity (see how hiring managers use the site)
1. clarity.microsoft.com → New project → website URL: your live address.
2. Settings → Setup → copy the Project ID (looks like `abc12de34f`).
3. Vercel → your project → Settings → Environment Variables → add
   Name: `NEXT_PUBLIC_CLARITY_ID`  Value: your ID → Save.
4. Deployments → ⋯ on the latest one → Redeploy. Clarity starts recording within ~2 hours.

## Custom domain later?
Add `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com` in Vercel environment variables (or edit `app/site.js`),
so canonical, sitemap, robots.txt and the link preview all point to the new domain.
