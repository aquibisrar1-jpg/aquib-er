import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import dns from "node:dns/promises";
import net from "node:net";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UA =
  "Mozilla/5.0 (compatible; AquibER/1.0; +https://www.linkedin.com/in/aquibisrar/) SEO-Emergency-Room";
const MAX_BYTES = 2_000_000;

const AI_BOTS = [
  { ua: "GPTBot", owner: "OpenAI (training)" },
  { ua: "OAI-SearchBot", owner: "ChatGPT search" },
  { ua: "ChatGPT-User", owner: "ChatGPT browsing" },
  { ua: "ClaudeBot", owner: "Anthropic" },
  { ua: "PerplexityBot", owner: "Perplexity" },
  { ua: "Google-Extended", owner: "Gemini training" },
  { ua: "CCBot", owner: "Common Crawl" },
  { ua: "Bytespider", owner: "ByteDance" },
];

/* ---------- safety: no poking private networks ---------- */
function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 10 || a === 127 || a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127) ||
      a >= 224
    );
  }
  const l = ip.toLowerCase();
  return l === "::1" || l === "::" || l.startsWith("fc") || l.startsWith("fd") || l.startsWith("fe80") || l.startsWith("::ffff:127.") || l.startsWith("::ffff:10.") || l.startsWith("::ffff:192.168.");
}

async function assertPublicHost(hostname) {
  if (!hostname || hostname === "localhost" || hostname.endsWith(".local") || hostname.endsWith(".internal"))
    throw new Error("PRIVATE_HOST");
  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) throw new Error("PRIVATE_HOST");
    return;
  }
  const addrs = await dns.lookup(hostname, { all: true });
  if (!addrs.length || addrs.some((a) => isPrivateIp(a.address))) throw new Error("PRIVATE_HOST");
}

async function readCapped(res) {
  const reader = res.body?.getReader();
  if (!reader) return "";
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    chunks.push(value);
    if (total > MAX_BYTES) { reader.cancel(); break; }
  }
  return new TextDecoder("utf-8").decode(Buffer.concat(chunks.map((c) => Buffer.from(c))));
}

async function safeFetch(url, { follow = true, timeout = 9000 } = {}) {
  let current = url;
  const hops = [];
  for (let i = 0; i < 6; i++) {
    const u = new URL(current);
    if (!/^https?:$/.test(u.protocol)) throw new Error("BAD_PROTOCOL");
    await assertPublicHost(u.hostname);
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeout);
    const started = Date.now();
    let res;
    try {
      res = await fetch(current, {
        redirect: "manual",
        signal: ctrl.signal,
        headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8" },
      });
    } finally {
      clearTimeout(t);
    }
    const ms = Date.now() - started;
    if (follow && res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      hops.push({ url: current, status: res.status });
      current = new URL(res.headers.get("location"), current).toString();
      continue;
    }
    return { res, finalUrl: current, hops, ms };
  }
  throw new Error("TOO_MANY_REDIRECTS");
}

async function fetchText(url, timeout = 6000) {
  try {
    const { res } = await safeFetch(url, { timeout });
    const text = res.ok ? await readCapped(res) : "";
    return { status: res.status, text, type: res.headers.get("content-type") || "" };
  } catch {
    return { status: 0, text: "", type: "" };
  }
}

/* ---------- robots.txt parsing ---------- */
function parseRobots(txt) {
  const groups = [];
  let cur = null;
  let lastWasAgent = false;
  const sitemaps = [];
  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    const val = line.slice(idx + 1).trim();
    if (key === "user-agent") {
      if (!cur || !lastWasAgent) { cur = { agents: [], rules: [] }; groups.push(cur); }
      cur.agents.push(val.toLowerCase());
      lastWasAgent = true;
    } else {
      lastWasAgent = false;
      if (key === "sitemap") sitemaps.push(val);
      else if (cur && (key === "disallow" || key === "allow")) cur.rules.push({ type: key, path: val });
    }
  }
  return { groups, sitemaps };
}

function botAccess(groups, bot) {
  const b = bot.toLowerCase();
  let g = groups.find((x) => x.agents.some((a) => a !== "*" && b.includes(a)));
  let viaStar = false;
  if (!g) { g = groups.find((x) => x.agents.includes("*")); viaStar = true; }
  if (!g) return { state: "allowed", via: "no rules" };
  const blockedRoot = g.rules.some((r) => r.type === "disallow" && (r.path === "/" || r.path === "/*"));
  const allowedRoot = g.rules.some((r) => r.type === "allow" && (r.path === "/" || r.path === ""));
  if (blockedRoot && !allowedRoot) return { state: "blocked", via: viaStar ? "User-agent: *" : `User-agent: ${bot}` };
  const n = g.rules.filter((r) => r.type === "disallow" && r.path).length;
  const via = (viaStar ? "User-agent: *" : `User-agent: ${bot}`) + (n ? ` (${n} path${n === 1 ? "" : "s"} off-limits)` : "");
  return { state: "allowed", via };
}

/* ---------- the doctor ---------- */
function check(id, label, status, value, joke) {
  return { id, label, status, value, joke };
}

export async function GET(req) {
  const input = (new URL(req.url).searchParams.get("url") || "").trim();
  if (!input || input.length > 300) return NextResponse.json({ error: "Type a domain, doctor needs a patient." }, { status: 400 });

  let start;
  try {
    start = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
  } catch {
    return NextResponse.json({ error: "That is not a URL. That is a cry for help." }, { status: 400 });
  }

  let page;
  try {
    page = await safeFetch(start.toString());
  } catch (e) {
    const msg =
      e.message === "PRIVATE_HOST"
        ? "Nice try. The ER does not treat localhost."
        : e.name === "AbortError"
        ? "Patient took 9+ seconds to respond. Googlebot already left."
        : e.message === "TOO_MANY_REDIRECTS"
        ? "Redirect chain longer than a Delhi wedding. Gave up after 6 hops."
        : "Patient is unresponsive (DNS or connection failed). Check the spelling, or call a priest.";
    return NextResponse.json({ error: msg }, { status: 422 });
  }

  const { res, finalUrl, hops, ms } = page;
  const html = await readCapped(res);
  const $ = cheerio.load(html);
  const origin = new URL(finalUrl).origin;
  const host = new URL(finalUrl).hostname;

  const [robots, llms, sitemapDefault] = await Promise.all([
    fetchText(`${origin}/robots.txt`),
    fetchText(`${origin}/llms.txt`),
    fetchText(`${origin}/sitemap.xml`),
  ]);

  const checks = [];

  // Status & speed
  checks.push(
    res.status === 200
      ? check("status", "Pulse (HTTP status)", "pass", "200 OK", "Heartbeat detected. We love a living patient.")
      : check("status", "Pulse (HTTP status)", "fail", String(res.status), `Homepage returns ${res.status}. That's not a homepage, that's a crime scene.`)
  );
  checks.push(
    ms < 800
      ? check("ttfb", "Response time", "pass", `${ms} ms`, "Fast. Googlebot didn't even have time to sigh.")
      : ms < 2000
      ? check("ttfb", "Response time", "warn", `${ms} ms`, "Acceptable. Googlebot checked its phone once.")
      : check("ttfb", "Response time", "fail", `${ms} ms`, "Googlebot made chai, drank it, and came back. Still loading.")
  );
  checks.push(
    hops.length === 0
      ? check("redirects", "Redirect hops", "pass", "0", "Straight in. No maze. Respect.")
      : hops.length === 1
      ? check("redirects", "Redirect hops", "pass", "1", `One hop (${hops[0].status}). Normal. Probably http→https or www.`)
      : check("redirects", "Redirect hops", "warn", String(hops.length), `${hops.length} hops before the homepage. Every hop leaks a little link equity and a little of my will to live.`)
  );
  checks.push(
    finalUrl.startsWith("https://")
      ? check("https", "HTTPS", "pass", "yes", "Padlock present. Chrome won't shame you.")
      : check("https", "HTTPS", "fail", "no", "No HTTPS in 2026. The raccoon is already inside.")
  );

  // Title & meta
  const title = $("title").first().text().trim();
  checks.push(
    !title
      ? check("title", "Title tag", "fail", "missing", "No title. Google will write one for you, and you will not like it.")
      : title.length > 65
      ? check("title", "Title tag", "warn", `${title.length} chars`, `"${title.slice(0, 70)}…" gets truncated in the SERP. Cut the fluff.`)
      : title.length < 20
      ? check("title", "Title tag", "warn", `${title.length} chars`, `"${title}". Short. Mysterious. Not ranking for much.`)
      : check("title", "Title tag", "pass", `${title.length} chars`, `"${title}". Clean. Fits the SERP.`)
  );
  const desc = $('meta[name="description"]').attr("content")?.trim() || "";
  checks.push(
    !desc
      ? check("desc", "Meta description", "fail", "missing", "No meta description. You've handed your SERP snippet to a random paragraph.")
      : desc.length > 165
      ? check("desc", "Meta description", "warn", `${desc.length} chars`, "Too long. Google is going to cut it mid-sent…")
      : check("desc", "Meta description", "pass", `${desc.length} chars`, "Present and sized right. A rare sighting.")
  );

  // H1
  const h1s = $("h1");
  checks.push(
    h1s.length === 1
      ? check("h1", "H1 heading", "pass", "1", `"${h1s.first().text().trim().slice(0, 60)}". One H1. As nature intended.`)
      : h1s.length === 0
      ? check("h1", "H1 heading", "fail", "0", "Zero H1s in the server HTML. Either it's JS-rendered or it was never there. Both are worrying.")
      : check("h1", "H1 heading", "warn", String(h1s.length), `${h1s.length} H1s. Everybody is the main character. Nobody is.`)
  );

  // Canonical
  const canonical = $('link[rel="canonical"]').attr("href");
  checks.push(
    canonical
      ? check("canonical", "Canonical tag", "pass", "present", "Canonical set. Duplicate content has been told to sit down.")
      : check("canonical", "Canonical tag", "warn", "missing", "No canonical. Google is picking your 'real' URL by vibes.")
  );

  // Robots meta
  const robotsMeta = ($('meta[name="robots"]').attr("content") || "") + " " + (res.headers.get("x-robots-tag") || "");
  checks.push(
    /noindex/i.test(robotsMeta)
      ? check("noindex", "Indexability", "fail", "NOINDEX", "The homepage says NOINDEX. Someone shipped staging to prod. Breathe.")
      : check("noindex", "Indexability", "pass", "indexable", "No noindex. The doors are open.")
  );

  // Lang & viewport
  const lang = $("html").attr("lang");
  checks.push(
    lang
      ? check("lang", "Language attribute", "pass", lang, `lang="${lang}". Search engines know what language you're shouting in.`)
      : check("lang", "Language attribute", "warn", "missing", "No lang attribute. Google is guessing. Badly, sometimes.")
  );
  checks.push(
    $('meta[name="viewport"]').length
      ? check("viewport", "Mobile viewport", "pass", "set", "Mobile-ready. Mobile-first indexing approves.")
      : check("viewport", "Mobile viewport", "fail", "missing", "No viewport meta. Your phone users are pinch-zooming in anger.")
  );

  // Schema
  const types = new Set();
  let schemaErrors = 0;
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).contents().text());
      const walk = (n) => {
        if (Array.isArray(n)) return n.forEach(walk);
        if (n && typeof n === "object") {
          if (n["@type"]) [].concat(n["@type"]).forEach((t) => types.add(String(t)));
          if (n["@graph"]) walk(n["@graph"]);
        }
      };
      walk(data);
    } catch {
      schemaErrors++;
    }
  });
  const typeList = [...types];
  checks.push(
    schemaErrors
      ? check("schema", "Structured data", "fail", `${schemaErrors} broken block(s)`, "JSON-LD that doesn't parse. Machines tried to read your résumé and found a ransom note.")
      : typeList.length === 0
      ? check("schema", "Structured data", "fail", "none", "Zero JSON-LD. To an AI engine you are a vibe, not an entity.")
      : typeList.length < 3
      ? check("schema", "Structured data", "warn", typeList.join(", "), "Some schema. A start. Entities want friends: Organization, WebSite, BreadcrumbList…")
      : check("schema", "Structured data", "pass", typeList.slice(0, 6).join(", "), "Proper schema stack. Knowledge Graph nods politely.")
  );

  // OG
  checks.push(
    $('meta[property="og:title"]').length && $('meta[property="og:image"]').length
      ? check("og", "Open Graph", "pass", "title + image", "Links will look good on LinkedIn. Important. Ask me how I know.")
      : check("og", "Open Graph", "warn", "incomplete", "Shared links will show up as a sad grey box.")
  );

  // Images alt
  const imgs = $("img");
  const noAlt = imgs.filter((_, el) => !$(el).attr("alt")?.trim()).length;
  checks.push(
    imgs.length === 0
      ? check("alt", "Image alt text", "warn", "0 images in HTML", "No images in server HTML. Lazy-loaded via JS? Crawlers may see a blank wall.")
      : noAlt / imgs.length > 0.3
      ? check("alt", "Image alt text", "warn", `${noAlt}/${imgs.length} missing`, "Lots of images with no alt. Screen readers and image search are both confused.")
      : check("alt", "Image alt text", "pass", `${imgs.length - noAlt}/${imgs.length} labelled`, "Images are labelled. Accessibility and image SEO say thanks.")
  );

  // Content in raw HTML (CSR smell)
  const bodyText = $("body").clone().find("script,style,noscript").remove().end().text().replace(/\s+/g, " ").trim();
  const words = bodyText ? bodyText.split(" ").length : 0;
  checks.push(
    words < 150
      ? check("render", "Content in raw HTML", "fail", `${words} words`, "Barely any text before JavaScript runs. Many AI crawlers don't run JS. To them, this page is a loading spinner.")
      : words < 400
      ? check("render", "Content in raw HTML", "warn", `${words} words`, "Thin server-rendered copy. Check what's hiding behind client-side rendering.")
      : check("render", "Content in raw HTML", "pass", `${words} words`, "Real copy in the server response. AI crawlers can actually read you.")
  );

  // Sitemap
  const robotsParsed = robots.status === 200 ? parseRobots(robots.text) : { groups: [], sitemaps: [] };
  const hasSitemap = robotsParsed.sitemaps.length > 0 || (sitemapDefault.status === 200 && /<(urlset|sitemapindex)/i.test(sitemapDefault.text));
  checks.push(
    hasSitemap
      ? check("sitemap", "XML sitemap", "pass", robotsParsed.sitemaps.length ? "declared in robots.txt" : "/sitemap.xml", "Sitemap found. Googlebot has a map. Will it read it? Unclear. But it has one.")
      : check("sitemap", "XML sitemap", "warn", "not found", "No sitemap found. Googlebot is wandering the building with a torch.")
  );
  checks.push(
    robots.status === 200
      ? check("robots", "robots.txt", "pass", "present", "robots.txt exists and is readable.")
      : check("robots", "robots.txt", "warn", robots.status ? String(robots.status) : "unreachable", "No robots.txt. Every bot treats it as 'come on in, shoes on'.")
  );

  // llms.txt
  const hasLlms = llms.status === 200 && llms.text.length > 20 && !/<html/i.test(llms.text.slice(0, 500));
  checks.push(
    hasLlms
      ? check("llms", "llms.txt", "pass", "present", "An llms.txt! Very forward-thinking. The raccoon is impressed and slightly scared.")
      : check("llms", "llms.txt", "warn", "missing", "No llms.txt. Not a ranking factor (yet), but a cheap way to brief the robots.")
  );

  // AI crawlers
  const ai = AI_BOTS.map((b) => ({ ...b, ...botAccess(robotsParsed.groups, b.ua) }));
  const blockedSearch = ai.filter((b) => b.state === "blocked" && ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot"].includes(b.ua));
  checks.push(
    blockedSearch.length
      ? check("aicrawl", "AI answer-engine access", "fail", `${blockedSearch.length} blocked`, `You're blocking ${blockedSearch.map((b) => b.ua).join(", ")}. Then wondering why ChatGPT never recommends you.`)
      : check("aicrawl", "AI answer-engine access", "pass", "open", "AI search crawlers can get in. Now we make them cite you.")
  );

  const score = Math.round(
    (checks.reduce((s, c) => s + (c.status === "pass" ? 1 : c.status === "warn" ? 0.5 : 0), 0) / checks.length) * 100
  );
  const fails = checks.filter((c) => c.status === "fail").length;
  const verdict =
    score >= 85
      ? "Stable. Annoyingly healthy. The real problems are probably in content and citations. That's where I come in."
      : score >= 65
      ? "Walking wounded. Fixable in a sprint. The raccoon is circling."
      : score >= 45
      ? "Critical but conscious. Recommend immediate SEO intervention and one (1) Aquib."
      : "Code blue. Somebody page the SEO guy. Oh wait, I'm right here.";

  return NextResponse.json(
    {
      host,
      finalUrl,
      status: res.status,
      ms,
      hops: hops.length,
      title,
      score,
      fails,
      verdict,
      checks,
      ai,
      schemaTypes: typeList,
      meta: {
        description: desc,
        siteName: $('meta[property="og:site_name"]').attr("content")?.trim() || "",
        ogImage: $('meta[property="og:image"]').attr("content")?.trim() || "",
        lang: lang || "",
        canonical: canonical || "",
        logo: $('link[rel~="icon"]').attr("href") || "",
        sitemaps: robotsParsed.sitemaps.slice(0, 3),
        hasRobots: robots.status === 200,
      },
      checkedAt: new Date().toISOString(),
    },
    { headers: { "cache-control": "s-maxage=600, stale-while-revalidate=3600" } }
  );
}
