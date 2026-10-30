"use client";
import { esc } from "./fx";

// What Dr. Aquib actually prescribes for each finding. Serious advice, funny paper.
const RX = {
  status: "Make the homepage return a clean 200. Check server errors, CDN/firewall rules and redirect loops.",
  ttfb: "Cut server response time below ~800 ms: page caching, a CDN, and fewer server-side redirects.",
  redirects: "Collapse the chain into one 301 straight to the final https URL, then update internal links to point there directly.",
  https: "Force HTTPS with a single 301 and switch on HSTS.",
  title: "Rewrite the title to roughly 50–60 characters: main topic first, brand last.",
  desc: "Write a 140–160 character meta description that answers the searcher's question and earns the click.",
  h1: "Ship exactly one H1 in the server HTML that says what the page is about.",
  canonical: "Add a self-referencing canonical tag on the homepage and on every indexable page.",
  noindex: "URGENT: remove the noindex (meta robots or X-Robots-Tag) from the homepage. Today.",
  lang: 'Add a lang attribute to the <html> tag, e.g. lang="en-IN".',
  viewport: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.',
  schema: "Add Organization + WebSite JSON-LD (see Rx 2), then validate it in Google's Rich Results Test.",
  og: "Add og:title, og:description and a 1200×630 og:image so shared links look clickable.",
  alt: "Give content images descriptive alt text. Use empty alt only for decoration.",
  render: "Server-render the main copy and internal links. Many AI crawlers never run JavaScript.",
  sitemap: "Publish an XML sitemap, reference it in robots.txt, and submit it in Search Console.",
  robots: "Publish a robots.txt (see Rx 1) that points to your sitemap.",
  llms: "Optional but cheap: publish /llms.txt (see Rx 3) to brief AI models about your key pages.",
  aicrawl: "Unblock the AI search crawlers (see Rx 1) so ChatGPT, Perplexity and Claude can cite you.",
};

function brandName(d) {
  const raw = d.meta?.siteName || (d.title || "").split(/\s[|\-–—:]\s/).pop() || d.host;
  return raw.trim() || d.host;
}

function abs(u, base) {
  try { return u ? new URL(u, base).toString() : ""; } catch { return ""; }
}

export function openPrescription(d) {
  const origin = new URL(d.finalUrl).origin;
  const name = brandName(d);
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const rxNo = "RX-" + Math.abs([...d.host].reduce((h, c) => (h << 5) - h + c.charCodeAt(0), 0) % 999999).toString().padStart(6, "0");
  const findings = d.checks.filter((c) => c.status !== "pass");
  const blocked = d.ai.filter((b) => b.state === "blocked");

  const robotsFix = blocked.length
    ? `# Add these groups to ${origin}/robots.txt\n# (a bot-specific group overrides "User-agent: *")\n\n` +
      blocked.map((b) => `User-agent: ${b.ua}\nAllow: /`).join("\n\n") +
      `\n\n# Optional: keep blocking training-only bots if you prefer\n# User-agent: GPTBot\n# Disallow: /\n\nSitemap: ${d.meta?.sitemaps?.[0] || origin + "/sitemap.xml"}`
    : d.meta?.hasRobots
    ? `# Your robots.txt already lets the AI search crawlers in. Nothing to change.\n# Just make sure it lists your sitemap:\nSitemap: ${d.meta?.sitemaps?.[0] || origin + "/sitemap.xml"}`
    : `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml`;

  const org = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${origin}/#organization`,
        name,
        url: origin + "/",
        ...(abs(d.meta?.logo, origin) ? { logo: abs(d.meta.logo, origin) } : {}),
        ...(d.meta?.description ? { description: d.meta.description } : {}),
        sameAs: ["https://www.linkedin.com/company/REPLACE_ME", "https://www.instagram.com/REPLACE_ME"],
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: origin + "/",
        name,
        publisher: { "@id": `${origin}/#organization` },
        ...(d.meta?.lang ? { inLanguage: d.meta.lang } : {}),
      },
    ],
  };
  const jsonld = `<script type="application/ld+json">\n${JSON.stringify(org, null, 2)}\n</script>`;

  const llms = `# ${name}\n\n> ${d.meta?.description || "One or two sentences on what you do and who it's for."}\n\n## Key pages\n- [Home](${origin}/): what we do\n- [About](${origin}/about): who we are\n- [Contact](${origin}/contact): how to reach us\n\n## Optional\n- [Blog](${origin}/blog): guides and answers`;

  const stamp = d.score >= 85 ? "STABLE" : d.score >= 65 ? "TREATABLE" : d.score >= 45 ? "CRITICAL" : "CODE BLUE";

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Prescription for ${esc(d.host)} · Dr. Aquib's SEO ER</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#e9e4d4;font-family:"Times New Roman",serif;color:#111}
.page{max-width:800px;margin:24px auto;background:#fffdf5;border:2px solid #111;padding:36px 42px;position:relative;box-shadow:6px 6px 0 #0003}
.top{display:flex;justify-content:space-between;gap:16px;border-bottom:3px double #111;padding-bottom:12px}
.doc h1{font-family:"Comic Sans MS","Comic Neue",cursive;font-size:28px;margin:0}
.doc small{display:block;font-size:12px}
.rx{font-size:72px;line-height:1;font-weight:bold;color:#b00}
.meta{display:grid;grid-template-columns:1fr 1fr;gap:4px 18px;font-size:14px;margin:14px 0;padding:10px;border:1px dashed #111}
h2{font-size:18px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #111;margin:22px 0 8px}
ol{padding-left:22px}li{margin:6px 0;font-size:15px}li b{font-family:Arial,sans-serif;font-size:13px}
pre{background:#111;color:#39ff14;font:12px/1.45 "Courier New",monospace;padding:12px;white-space:pre-wrap;word-break:break-word;border:2px solid #111}
.stamp{position:absolute;right:40px;top:150px;transform:rotate(-14deg);border:5px double #b00;color:#b00;font:bold 26px Impact,Arial Black,sans-serif;padding:4px 12px;opacity:.75}
.sign{display:flex;justify-content:space-between;align-items:flex-end;margin-top:30px;gap:20px;flex-wrap:wrap}
.sig{font-family:"Brush Script MT","Segoe Script","Comic Sans MS",cursive;font-size:34px;border-bottom:1px solid #111;padding:0 20px}
.foot{font-size:12px;margin-top:18px;border-top:3px double #111;padding-top:8px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}
.bar{max-width:800px;margin:16px auto 0;display:flex;gap:10px;justify-content:flex-end;padding:0 8px}
.bar button{font:bold 15px "Comic Sans MS",cursive;background:linear-gradient(#90ff5c,#22d400);border:4px outset #b4ff8f;border-radius:10px;box-shadow:3px 3px #000;padding:8px 16px;cursor:pointer}
.ok{color:#080}
@media print{body{background:#fff}.bar{display:none}.page{box-shadow:none;margin:0;border:0}}
@media(max-width:600px){.page{padding:22px 16px}.stamp{top:110px;right:14px;font-size:18px}.meta{grid-template-columns:1fr}}
</style></head><body>
<div class="bar"><button onclick="window.print()">🖨️ Print / Save as PDF</button></div>
<div class="page">
  <div class="top">
    <div class="doc"><h1>Dr. Aquib Israr, MBBS*</h1>
      <small>*Master of Backlinks &amp; Bot Studies · SEO, GEO &amp; AEO</small>
      <small>The SEO Emergency Room · ${esc(location.host)} · Delhi NCR</small></div>
    <div class="rx">℞</div>
  </div>
  <div class="stamp">${stamp}</div>
  <div class="meta">
    <div><b>Patient:</b> ${esc(d.host)}</div><div><b>Date:</b> ${esc(today)}</div>
    <div><b>Rx no.:</b> ${rxNo}</div><div><b>Vitals score:</b> ${d.score}/100</div>
    <div><b>Pulse:</b> HTTP ${d.status}</div><div><b>Response:</b> ${d.ms} ms · ${d.hops} redirect hop(s)</div>
  </div>
  <p><b>Diagnosis:</b> ${esc(d.verdict)}</p>

  <h2>Findings &amp; treatment</h2>
  ${findings.length ? `<ol>${findings.map((c) => `<li><b>[${c.status === "fail" ? "CRITICAL" : "MINOR"}] ${esc(c.label)} (${esc(c.value)})</b><br>${esc(RX[c.id] || c.joke)}</li>`).join("")}</ol>` : `<p class="ok">No problems found on the homepage. Annoyingly healthy. The real work is in content, internal links and AI citations.</p>`}

  <h2>Rx 1 · robots.txt for AI search crawlers</h2>
  <pre>${esc(robotsFix)}</pre>

  <h2>Rx 2 · Homepage JSON-LD (paste into &lt;head&gt;)</h2>
  <pre>${esc(jsonld)}</pre>
  <p style="font-size:13px">Replace the REPLACE_ME links with your real social profiles, then validate in the Rich Results Test.</p>

  ${d.checks.find((c) => c.id === "llms")?.status !== "pass" ? `<h2>Rx 3 · Starter /llms.txt</h2><pre>${esc(llms)}</pre>` : ""}

  <h2>Dosage</h2>
  <p>Apply before the next core update. Take with chai. Re-run the ER after each fix. If symptoms persist (rankings still on page 4), consult a specialist.</p>

  <div class="sign">
    <div style="font-size:13px">This checkup covered the homepage only, from the outside.<br>Full surgery (render parity, cannibalization, entities, AI citation share) is available on request.</div>
    <div style="text-align:center"><div class="sig">Aquib Israr</div><small>Signature (legally binding*)</small></div>
  </div>
  <div class="foot"><span>✉ aquibisrar1@gmail.com · linkedin.com/in/aquibisrar</span><span>*not legally binding. Valid until Google changes its mind.</span></div>
</div></body></html>`;

  const w = window.open("", "_blank");
  if (!w) return false;
  w.document.open();
  w.document.write(html);
  w.document.close();
  return true;
}
