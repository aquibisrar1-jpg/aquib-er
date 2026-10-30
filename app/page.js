"use client";
import { useState } from "react";
import ER from "../components/ER";
import CoreUpdate from "../components/CoreUpdate";
import RaccoonHunt from "../components/RaccoonHunt";
import Popups, { toast, openWin } from "../components/Popups";
import { Raccoon, StormCloud } from "../components/Mascots";
import { beep } from "../components/sound";

const EMAIL = "aquibisrar1@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/aquibisrar/";
const CV = "/Aquib_Israr_CV.pdf";

const STATS = [
  { n: "~5,000", l: "leads a year from organic at AND Academy" },
  { n: "300+", l: "applications (5–6% lead → application)" },
  { n: "~200", l: "enrollments a year (~65% admission rate)" },
  { n: "~₹2 Cr", l: "annual revenue on the organic engine" },
  { n: "+86%", l: "monthly impressions, 5.07M → 9.42M (GSC)" },
  { n: "23 → 10", l: "average position. Page 4 → top 10 on money terms" },
  { n: "2.4×", l: "blog library, 200 → 480 pages, without index bloat" },
  { n: "~⅕", l: "of organic conversions now from the GEO program I built" },
];

const LOG = [
  {
    d: "2026-08 → now", s: "200", cls: "s200", path: "GET /udit (formerly IIAD) · Assistant Manager, SEO",
    b: ["Lead SEO + GEO for UDIT: organic growth and AI visibility across ChatGPT, Perplexity and AI Overviews", "Running the IIAD → UDIT domain + content migration end to end: blog consolidation, cannibalization audits, redirect maps", "E-E-A-T enrichment and Helpful Content compliance across course and blog templates"],
  },
  {
    d: "2025-01 → 2026-07", s: "200", cls: "s200", path: "GET /and-academy (IIAD × Kingston School of Art) · Assistant Manager, SEO",
    b: ["Owned the full-funnel organic engine: ~5,000 leads → 300+ applications → ~200 enrollments a year", "Led the Dec 2025 Core Update recovery (see: the incident above)", "Built GEO from zero, a layered schema framework, a custom GSC MCP server and an 11-module Looker Studio stack", "Led a 5-person content + SEO team plus an external agency, and fed search data into Google Ads decisions"],
  },
  {
    d: "2021-11 → 2024-12", s: "301", cls: "s301", path: "GET /yujji (DCOIL EdTech) · Senior Exec → Assistant Manager, SEO",
    b: ["301 Moved Permanently: promoted after two years", "Top-3 rankings 6 → 18; organic sessions +38% QoQ; new users +31%", "Guest-lecture pipeline: 50+ talks in 6 months, ~300 qualified leads, 15 partner MoUs", "Reddit ambassador programme for organic backlinks"],
  },
  {
    d: "2018-10 → 2020-11", s: "410", cls: "s410", path: "GET /starmass · SEO & Content Marketing Executive",
    b: ["Keyword + intent research and a localised content strategy for the Saudi Arabian market", "Off-page outreach; publications on Springer- and Scimago-indexed platforms", "410 Gone: the company has since shut down. Unrelated. Probably."],
  },
  {
    d: "2018-02 → 2018-07", s: "410", cls: "s410", path: "GET /the-policy-times · SEO Content Writer",
    b: ["Wrote on politics, economics and policy for a national publication; keyword research before every brief", "410 Gone: also shut down later. Aquib has relieving letters, and an alibi."],
  },
  {
    d: "2012 → 2018", s: "102", cls: "s102", path: "GET /jamia-millia-islamia · B.Sc Chemistry, then M.A. Media & Governance",
    b: ["102 Processing: chemistry → media → search. The search engine is just a very large reaction."],
  },
];

const RESEARCH = [
  { tab: "PRESS", t: "Crawler-identification research", d: "Original research featured by PPC Land (June 2026) and cited by Havas Media Germany's Director of Programmatic Marketing." },
  { tab: "AI MODE", t: "Google AI Mode hides its citations", d: "Reverse-engineered how AI Mode tucks citations into HTML comments as UUID-linked passages, invisible to link parsers and commercial AI-visibility tools." },
  { tab: "GSC", t: "Vernacular demand, hiding in plain sight", d: "A Unicode regex technique in Search Console (\\p{Script} classes) that surfaces Hindi and other-script demand buried in long-tail queries." },
  { tab: "CHATGPT", t: "Citations ≠ recommendations", d: "Analysed ChatGPT network traffic to separate search-grounded citations from ungrounded, model-trained recommendations." },
  { tab: "LAB", t: "Controlled GEO citation experiment", d: "Three sites isolating one variable (listicle vs prose vs schema) to see what actually gets cited by ChatGPT, Perplexity and Claude." },
];

const BUILDS = [
  { t: "Atlas SEO Chrome Extension", d: "Manifest V3, zero-API, client-side audits: JSON-LD linting, JS render analysis, entity-gap checks. Replaces four to five paid tools.", b: "INSTALL (not public yet)" },
  { t: "Custom GSC MCP Server", d: "Programmatic Search Console access so an AI agent can watch queries and pages, and flag cannibalization and decay without manual pulls.", b: "QUERY SOMETHING" },
  { t: "Semantic Analysis Pipeline", d: "Screaming Frog + Gemma embeddings → cosine similarity for topic clustering, cannibalization detection and content-gap maps.", b: "EMBED ME" },
  { t: "Pruning & Consolidation Engine", d: "Pre/post Core Update GSC comparison with a Recovery Priority Score. Triaged 1,000+ URLs into keep, merge, redirect or delete.", b: "PRUNE THIS BUTTON" },
  { t: "E-E-A-T Enrichment Framework", d: "Three-pass Delete / Add / Edit audit (Excel + Word playbook) aligned to Google's Helpful Content System. Bylines, reviewers, Person schema.", b: "ADD AUTHOR BIO" },
  { t: "Link-bait micro tools", d: "Font pairing, colour contrast, aspect ratio and brand-palette builders on the blog, to lift engagement and earn natural links. Also: this website.", b: "PAIR A FONT" },
];

const FAQ = [
  ["Is the Emergency Room real?", "Yes. When you hit Admit, a serverless function fetches that site's homepage, robots.txt, sitemap and llms.txt live, then runs 19 checks. Nothing is stored. It's the homepage only, so think of it as triage, not surgery."],
  ["Why a raccoon?", "AI Overviews and answer engines read your content, summarise it, and often keep the click. Small, clever, gets into everything. The job now is making it cite you instead."],
  ["Is the Core Update story real?", "Very. December 2025, AND Academy. Three root causes: index bloat (442 URLs flagged out of 1,000+), 482 cannibalized queries, and a server-level cloaking breach on a partner domain. Declining pages recovered 20–30%."],
  ["Does he only do SEO?", "SEO, GEO and AEO, plus the bits that make them pay: lead → application → enrollment tracking, landing-page structure, and feeding search-term data into Google Ads keywords and negatives. He's led a 5-person team and managed an agency."],
  ["Who is responsible for the fonts?", "Aquib. He is sorry. He is not sorry."],
  ["Will he fix my site for free?", "He just did, a little, up there. The rest comes with a job title."],
  ["Is he available?", "Currently Assistant Manager, SEO at UDIT, based in Delhi NCR. Open to the right role. The calendar invite is still pending, by the way."],
];

export default function Home() {
  const [notBot, setNotBot] = useState(false);
  const [dl, setDl] = useState(null); // null | number

  const fakeDownload = () => {
    if (dl !== null) return;
    beep("dialup");
    let p = 0;
    setDl(0);
    const id = setInterval(() => {
      p = Math.min(99, p + Math.ceil(Math.random() * 14));
      setDl(p);
      if (p >= 99) {
        clearInterval(id);
        setTimeout(() => {
          toast("Stuck at 99%. Classic. Here's the actual PDF instead. 📄");
          const a = document.createElement("a");
          a.href = CV;
          a.download = "Aquib_Israr_SEO_CV.pdf";
          document.body.appendChild(a);
          a.click();
          a.remove();
          setDl(100);
        }, 1400);
      }
    }, 180);
  };

  return (
    <>
      <div className="promo">
        <div className="marquee">
          ⚠ BREAKING: AQUIB HAS NOT BEEN HIRED BY YOU YET. THIS IS BEING TREATED AS A SITE-WIDE ISSUE ⚠ &nbsp;&nbsp;
          <a href="#er">BRING YOUR WEBSITE TO THE ER (FREE, LIVE, SLIGHTLY RUDE)</a> &nbsp;&nbsp; ✦ NOW WITH 100% MORE RACCOON ✦ &nbsp;&nbsp;
          CORE UPDATE SURVIVOR ✦ GEO BEFORE IT WAS COOL ✦ HAS OPINIONS ABOUT CANONICALS
        </div>
      </div>

      <nav className="nav">
        <div className="wrap">
          <a className="logo" href="#top">AQUIB.exe<sup>™®!!!</sup></a>
          <div className="nav-links">
            <a href="#er">the_ER.exe</a>
            <a href="#incident">The Incident™</a>
            <a href="#hunt">Raccoon!!!</a>
            <a href="#proof">Proof (boring)</a>
            <a href="#faq">Who did this??</a>
          </div>
          <a className="btn small blue" href={CV} download onClick={() => beep("click")}>REAL CV ↓</a>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="wrap hero-grid">
          <div>
            <span className="tag">SEO MANAGER · GEO &amp; AEO · 6+ YEARS · DELHI NCR</span>
            <h1 className="display">
              Your rankings <span className="strike">died</span> called.
              <br />
              They want <span className="hl">Aquib.</span>
            </h1>
            <p className="sub">
              I&apos;m <b>Aquib Israr</b>. I turn organic search into leads and revenue, not vanity graphs. I survived a Google Core Update, built a GEO program from scratch, and now I chase an AI raccoon that steals clicks for a living.
            </p>
            <div className="ctas">
              <a className="btn pink" href="#er" onClick={() => beep("click")}>🚑 DIAGNOSE MY SITE</a>
              <a className="btn white" href="#hire" onClick={() => beep("click")}>JUST HIRE HIM</a>
            </div>
            <div className="captcha" onClick={() => { if (!notBot) { setNotBot(true); beep("win"); toast("Verified. Status: 200 OK. Welcome, human."); } }}>
              <span className="chk" role="checkbox" aria-checked={notBot}>{notBot ? "✓" : ""}</span>
              <span>I&apos;m not a 404<small>reCRAWLtcha · Privacy · Terms</small></span>
            </div>
          </div>

          <div className="hero-art">
            <span className="sticker" style={{ top: -22, left: -20, transform: "rotate(-8deg)" }}>about_page_FINAL_final_v7.html</span>
            <span className="sticker" style={{ top: 120, right: -26, transform: "rotate(7deg)", background: "var(--yellow)" }}>noindex (oops)</span>
            <div className="serp">
              <div className="q">🔍 who should I hire to fix our SEO and AI visibility</div>
              <div className="aio">
                <div style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>✦ AI Overview</div>
                Based on several sources, the most sensible option is to <b>hire Aquib Israr</b>, an SEO manager who specialises in getting brands cited by answer engines like this one. <sup style={{ color: "#1a0dab" }}>[1]</sup>
                <div style={{ fontSize: 11, color: "#777", marginTop: 6 }}>Note: this overview was optimised by the person it recommends.</div>
              </div>
              <div className="res me">
                <div className="u">linkedin.com › in › aquibisrar</div>
                <div className="t">Aquib Israr: SEO Manager | GEO &amp; AEO Specialist</div>
                <div>Core Update survivor. ~5,000 leads/yr from organic. Has opinions about canonicals…</div>
              </div>
              <div className="res" style={{ opacity: 0.55 }}>
                <div className="u">agency.example › packages</div>
                <div className="t">12-Month SEO Retainer (You Get a PDF Monthly)</div>
              </div>
              <div className="res" style={{ opacity: 0.4 }}>
                <div className="u">guru.example › blog</div>
                <div className="t">Content Is King: 47 Tips From 2014</div>
              </div>
            </div>
            <div className="raccoon-peek wobble"><Raccoon size={130} /></div>
          </div>
        </div>
      </header>

      <div className="strip"><div className="marquee fast">MORE CITATIONS • FEWER 404s • LESS INDEX BLOAT • MORE LEADS • ZERO VANITY METRICS • MORE CITATIONS • FEWER 404s • LESS INDEX BLOAT • MORE LEADS •</div></div>

      {/* ---------------- ER ---------------- */}
      <section className="sec" id="er">
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker">🚑 Department of Emergency Search Medicine</div>
            <h2 className="display">The SEO<br />Emergency Room</h2>
            <p>Type your company&apos;s domain. Dr. Aquib checks the real site live: status, speed, redirects, title, meta, H1, canonical, schema, render-ability, robots.txt, sitemap, llms.txt, and whether you&apos;re accidentally blocking ChatGPT, Claude and Perplexity. Bedside manner not included.</p>
          </div>
          <ER />
        </div>
      </section>

      <div className="strip alt"><div className="marquee fast">⚡ WARNING: A CORE UPDATE HAS BEEN SPOTTED IN YOUR AREA ⚡ STAY INDOORS ⚡ DO NOT DELETE YOUR BLOG IN A PANIC ⚡ WARNING: A CORE UPDATE HAS BEEN SPOTTED ⚡</div></div>

      {/* ---------------- Core update ---------------- */}
      <section className="sec" id="incident">
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker">Case file · AND Academy · Dec 2025</div>
            <h2 className="display">The Core Update<br />Incident™</h2>
            <p>Every SEO has a war story. Here&apos;s mine, as an interactive reenactment. Press the button. Watch the cloud. Feel the fear. Then watch the line go back up.</p>
          </div>
          <CoreUpdate />
        </div>
      </section>

      {/* ---------------- Raccoon hunt ---------------- */}
      <section className="sec band-yellow" id="hunt">
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker">Mini-game · GEO simulator 2026</div>
            <h2 className="display">Catch the<br />AI Overview 🦝</h2>
            <p>It reads your blog, summarises it, and keeps the click. Click the raccoon to win your traffic back. Every second it&apos;s on screen, it steals another one.</p>
          </div>
          <RaccoonHunt />
        </div>
      </section>

      {/* ---------------- Proof ---------------- */}
      <section className="sec" id="proof">
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker">The boring part (but real, and on the CV)</div>
            <h2 className="display">Proof, Not<br />Vibes</h2>
            <p>Traffic is nice. Leads, applications, enrollments and revenue are nicer. These are the numbers I get judged on, and I like it that way.</p>
          </div>
          <div className="stats">
            {STATS.map((s) => (
              <div className="stat" key={s.l}>
                <div className="n">{s.n}</div>
                <div className="l">{s.l}</div>
              </div>
            ))}
          </div>

          <h3 className="display" style={{ fontSize: 34, margin: "60px 0 16px" }}>career_access.log</h3>
          <div className="logfile">
            <div style={{ color: "#888", marginBottom: 8 }}># tail -f /var/log/aquib/career.log · click a line to expand</div>
            {LOG.map((l) => (
              <details key={l.path} open={l.s === "200" && l.d.includes("now")}>
                <summary className="ln">
                  <span style={{ color: "#888" }}>[{l.d}]</span>
                  <span className={l.cls}>{l.s}</span>
                  <span>{l.path}</span>
                </summary>
                <ul>{l.b.map((x) => <li key={x}>{x}</li>)}</ul>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Research ---------------- */}
      <section className="sec band" id="research">
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker" style={{ color: "var(--yellow)" }}>Declassified · Original research</div>
            <h2 className="display">He Opened<br />The Network Tab</h2>
            <p>Most people read SEO news. I do my own digging, and sometimes it ends up in the news.</p>
          </div>
          <div className="files" style={{ color: "var(--ink)" }}>
            {RESEARCH.map((r) => (
              <div className="file" key={r.t}>
                <span className="tab">{r.tab}</span>
                <div className="body">
                  <h4>{r.t}</h4>
                  <p>{r.d}</p>
                  <div style={{ height: 26 }} />
                  <span className="classified">DECLASSIFIED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Builds ---------------- */}
      <section className="sec" id="builds">
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker">AQUIB HAS ADDED FEATURES · nobody asked · they were useful anyway</div>
            <h2 className="display">Tools He Built<br />Instead of Buying</h2>
            <p>When the paid tool can&apos;t do it, I build it. Each card has a completely unhelpful button, for authenticity.</p>
          </div>
          <div className="builds">
            {BUILDS.map((b, i) => (
              <div className="build" key={b.t}>
                <div className="no">{String(i + 1).padStart(2, "0")}</div>
                <h4>{b.t}</h4>
                <p>{b.d}</p>
                <button className="btn small white useless" onClick={() => { beep("error"); openWin("sorry"); }}>{b.b}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Download ---------------- */}
      <section className="sec band-pink">
        <div className="wrap download">
          <button className="exe" onClick={fakeDownload} aria-label="Download Aquib">
            <div className="ico">.EXE</div>
            <span>AQUIB_SEO_v6.0.exe</span>
          </button>
          <div>
            <h2 className="display" style={{ fontSize: "clamp(34px,5vw,64px)", margin: "0 0 10px" }}>Why hire an agency when you can download a specialist?</h2>
            <p style={{ margin: 0 }}>6+ years · 1 Core Update survived · 0 black-hat backlinks · Includes free GEO. Compatible with WordPress, HubSpot and Next.js. Requires: chai.</p>
            {dl !== null && (
              <>
                <div className="progress"><div style={{ width: `${dl}%` }} /></div>
                <div style={{ fontWeight: 700 }}>{dl < 99 ? `Installing Aquib… ${dl}%` : dl === 99 ? "99%… finalising canonical tags… (forever)" : "Done. It was a PDF all along."}</div>
              </>
            )}
            {dl === null && <button className="btn" style={{ marginTop: 18 }} onClick={fakeDownload}>DOWNLOAD NOW (100% SAFE*)</button>}
            <div style={{ fontSize: 12, marginTop: 10 }}>*it&apos;s my CV.</div>
          </div>
        </div>
      </section>

      {/* ---------------- Reviews ---------------- */}
      <section className="sec">
        <div className="wrap" style={{ display: "grid", gap: 24 }}>
          <div className="review box" style={{ padding: 24 }}>
            <div style={{ fontSize: 60 }}>🕷️</div>
            <div>
              <div className="stars">★★★★★</div>
              <p className="display" style={{ fontSize: 40, margin: "6px 0" }}>&quot;200 OK.&quot;</p>
              <div style={{ fontSize: 13 }}>Googlebot, verified crawler · rendered the page and everything</div>
            </div>
          </div>
          <div className="review box" style={{ padding: 24, background: "#f2f2f2" }}>
            <Raccoon size={80} mood="caught" />
            <div>
              <div className="stars">★☆☆☆☆</div>
              <p className="display" style={{ fontSize: 30, margin: "6px 0" }}>&quot;Made the site get cited. Now I have to send people there. Would not recommend.&quot;</p>
              <div style={{ fontSize: 13 }}>The AI Overview raccoon · unverified · <a href="#hunt">I would like my clicks back</a></div>
            </div>
          </div>
          <div className="review box" style={{ padding: 24, background: "#e9ebff" }}>
            <StormCloud size={90} angry={false} />
            <div>
              <div className="stars">★★★☆☆</div>
              <p className="display" style={{ fontSize: 30, margin: "6px 0" }}>&quot;I came, I saw, he recovered. Annoying.&quot;</p>
              <div style={{ fontSize: 13 }}>The December 2025 Core Update · rolls out whenever it wants</div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Letter ---------------- */}
      <section className="sec band-yellow">
        <div className="wrap">
          <div className="letter">
            <div className="hand">A message from Aquib</div>
            <p>Hi, hiring manager.</p>
            <p>You could have got a PDF. You still can (top right). But SEO is half evidence and half persuasion, so I made you something to poke at instead.</p>
            <p>Under the raccoon: I care about the boring, load-bearing stuff. Render parity. Redirect maps that don&apos;t leak. Schema that parses. Content that answers the question first. And numbers that end in leads and revenue, not just impressions.</p>
            <p>If your site went through the ER above and you winced a little, that&apos;s a good conversation to have.</p>
            <p className="hand" style={{ fontSize: 22, marginBottom: 0 }}>— Aquib (SEO, GEO, AEO, and now apparently web dev)</p>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="sec" id="faq">
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker">FAQ</div>
            <h2 className="display">Frequently Avoided<br />Questions</h2>
          </div>
          <div className="faq">
            {FAQ.map(([q, a]) => (
              <details key={q} onToggle={(e) => e.currentTarget.open && beep("click")}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Final CTA ---------------- */}
      <section className="band-pink cta-final" id="hire">
        <div className="wrap">
          <div className="float" style={{ display: "inline-block" }}><Raccoon size={110} mood="caught" /></div>
          <h2 className="display">Hire Aquib.<br />Jail the raccoon.</h2>
          <p style={{ fontSize: 18, maxWidth: 640, margin: "0 auto" }}>Email gets the fastest reply. LinkedIn works too. The CV is a real PDF, not an .exe, I promise.</p>
          <div className="ctas">
            <a className="btn" href={`mailto:${EMAIL}?subject=${encodeURIComponent("Saw your SEO Emergency Room. Let's talk.")}`} onClick={() => beep("win")}>✉ {EMAIL}</a>
            <a className="btn white" href={LINKEDIN} target="_blank" rel="noopener noreferrer">LINKEDIN →</a>
            <a className="btn blue" href={CV} download>CV.PDF ↓</a>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <span>crawled, rendered &amp; indexed by Aquib © 2018–2026* &nbsp;·&nbsp; *indexed eventually</span>
          <span>
            <a href="#top">Return to position #1</a> &nbsp;·&nbsp;{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); toast("Unsubscribed from good rankings. Bold move."); }}>Unsubscribe from good rankings</a>
          </span>
        </div>
      </footer>

      <Popups />
    </>
  );
}
