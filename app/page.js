"use client";
import { useEffect, useState } from "react";
import ER from "../components/ER";
import CoreUpdate from "../components/CoreUpdate";
import RaccoonHunt from "../components/RaccoonHunt";
import Popups, { toast, openWin } from "../components/Popups";
import { beep } from "../components/sound";
import Vision, { setVision } from "../components/Vision";
import BlackHat, { blackHat } from "../components/BlackHat";
import IndexCV from "../components/IndexCV";
import HireDialog from "../components/HireDialog";

const EMAIL = "aquibisrar1@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/aquibisrar/";
const CV = "/Aquib_Israr_CV.pdf";

const STATS = [
  ["~5,000", "leads a year from organic at AND Academy"],
  ["300+", "applications a year (5–6% lead → application)"],
  ["~200", "enrollments a year (~65% admission rate)"],
  ["~₹2 Cr", "annual revenue riding on the organic engine"],
  ["+86%", "monthly impressions in GSC, 5.07M → 9.42M"],
  ["23 → 10", "average position. Money terms from page 4 into the top 10"],
  ["2.4×", "blog library, 200 → 480 pages, without index bloat"],
  ["~⅕", "of organic conversions now come from the GEO program I built"],
];

const LOG = [
  ["2026-08 → now", "200", "s200", "GET /udit (formerly IIAD)  Assistant Manager, SEO", "Lead SEO + GEO. Running the IIAD → UDIT domain + content migration end to end: blog consolidation, cannibalization audits, redirect maps. E-E-A-T across course + blog templates."],
  ["2025-01 → 2026-07", "200", "s200", "GET /and-academy  Assistant Manager, SEO", "Owned the full-funnel organic engine (~5,000 leads → 300+ applications → ~200 enrollments a year). Led the Dec 2025 Core Update recovery. Built GEO from zero, a layered schema framework, a custom GSC MCP server and an 11-module Looker Studio stack. Led a 5-person team + an agency."],
  ["2021-11 → 2024-12", "301", "s301", "GET /yujji  Senior Exec → Assistant Manager, SEO", "301 Moved Permanently: promoted after two years. Top-3 rankings 6 → 18. Organic sessions +38% QoQ. Guest-lecture pipeline: 50+ talks, ~300 qualified leads, 15 MoUs."],
  ["2018-10 → 2020-11", "410", "s410", "GET /starmass  SEO & Content Marketing Executive", "Keyword + intent research for the Saudi market, localised content, outreach, Springer/Scimago publications. 410 Gone: the company has since shut down. Unrelated. Probably."],
  ["2018-02 → 2018-07", "410", "s410", "GET /the-policy-times  SEO Content Writer", "Politics, economics and policy, keyword-researched. 410 Gone: also shut down later. Aquib has relieving letters, and an alibi."],
  ["2012 → 2018", "102", "s102", "GET /jamia-millia-islamia  B.Sc Chemistry → M.A. Media & Governance", "102 Processing: chemistry → media → search. A search engine is just a very large reaction."],
];

const RESEARCH = [
  ["📰", "PRESS", "Crawler-identification research", "Featured by PPC Land (June 2026) and cited by Havas Media Germany's Director of Programmatic Marketing."],
  ["🕵️", "AI MODE", "AI Mode hides its citations", "Reverse-engineered how Google AI Mode tucks citations into HTML comments as UUID-linked passages, invisible to link parsers and paid AI-visibility tools."],
  ["🔤", "GSC", "Vernacular demand, hiding", "A Unicode regex trick in Search Console (\\p{Script} classes) that surfaces Hindi and other-script demand buried in long-tail queries."],
  ["🤖", "CHATGPT", "Citations ≠ recommendations", "Analysed ChatGPT network traffic to separate search-grounded citations from model-trained recommendations."],
  ["🧪", "LAB", "Controlled GEO experiment", "Three sites, one variable (listicle vs prose vs schema), to see what actually gets cited by ChatGPT, Perplexity and Claude."],
];

const BUILDS = [
  ["atlas_seo_extension.crx", "Manifest V3, zero-API, client-side audits: JSON-LD linting, JS render analysis, entity gaps. Replaces 4–5 paid tools.", "proprietary"],
  ["gsc_mcp_server.zip", "Custom Google Search Console MCP server. Lets an AI agent watch queries and pages and flag cannibalization and decay.", "in use"],
  ["semantic_pipeline.py", "Screaming Frog + Gemma embeddings → cosine similarity for topic clusters, cannibalization and content gaps.", "in use"],
  ["pruning_engine.xls", "Pre/post Core Update comparison with a Recovery Priority Score. Triaged 1,000+ URLs: keep, merge, redirect, delete.", "battle-tested"],
  ["eeat_framework.doc", "Three-pass Delete / Add / Edit audit aligned to Google's Helpful Content System. Bylines, reviewers, Person schema.", "battle-tested"],
  ["linkbait_tools.html", "Font pairing, colour contrast, aspect ratio and palette builders on the blog to earn natural links. Also: this website.", "you are here"],
];

const FAQ = [
  ["Is the Emergency Room real?", "Yes. A serverless function fetches that site's homepage, robots.txt, sitemap and llms.txt live and runs 19 checks. Nothing is stored. Homepage only, so it's triage, not surgery."],
  ["Why a raccoon?", "AI Overviews read your content, summarise it, and keep the click. Small, clever, gets into everything. The job now is making it cite you."],
  ["Is the Core Update story real?", "Very. December 2025, AND Academy. Index bloat (442 URLs flagged), 482 cannibalized queries, and a server-level cloaking breach on a partner domain. Declining pages recovered 20–30%."],
  ["Does he only do SEO?", "SEO, GEO and AEO, plus the bits that make them pay: lead → application → enrollment tracking, landing pages, and search data fed into Google Ads keywords and negatives. Has led a 5-person team and managed an agency."],
  ["Who is responsible for the fonts?", "Aquib. He is sorry. He is not sorry."],
  ["Will he fix my site for free?", "He just did, a little, up there. The rest comes with a job title."],
  ["Is he available?", "Currently Assistant Manager, SEO at UDIT, Delhi NCR. Open to the right role. The meeting request is still pending, by the way."],
];

export default function Home() {
  const [count, setCount] = useState(404404);
  const [paused, setPaused] = useState(false);
  const [notBot, setNotBot] = useState(false);
  const [dl, setDl] = useState(null);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setCount((c) => c + Math.ceil(Math.random() * 7)), 900);
    return () => clearInterval(id);
  }, [paused]);

  useEffect(() => {
    document.body.style.animationPlayState = paused ? "paused" : "";
    document.querySelectorAll(".ticker span, .marq span, .blink, .bob, .spin").forEach((el) => (el.style.animationPlayState = paused ? "paused" : "running"));
  }, [paused]);

  const fakeDownload = () => {
    if (dl !== null && dl < 100) return;
    beep("dialup");
    let p = 0;
    setDl(0);
    const id = setInterval(() => {
      p = Math.min(99, p + Math.ceil(Math.random() * 12));
      setDl(p);
      beep("tick");
      if (p >= 99) {
        clearInterval(id);
        setTimeout(() => {
          toast("Stuck at 99%. Classic. Here's the actual CV instead. 📄");
          const a = document.createElement("a");
          a.href = CV; a.download = "Aquib_Israr_SEO_CV.pdf";
          document.body.appendChild(a); a.click(); a.remove();
          setDl(100); beep("coin");
        }, 1500);
      }
    }, 200);
  };

  return (
    <>
      <div className="beg">
        <span>🔍 Google has still <u>NOT</u> ranked me #1 for &quot;hire SEO person&quot;. Email me so I feel indexed.</span>
        <a href="#hire">HIRE AQUIB →</a>
      </div>
      <div className="ticker"><span>🔥 NEW!!! SEO THAT ACTUALLY ENDS IN LEADS ★ LESS INDEX BLOAT, MORE ENROLLMENTS ★ NOW WITH LIVE WEBSITE CHECKUPS ★ CORE UPDATE SURVIVOR ★ GEO BEFORE IT WAS COOL ★ HAS STRONG OPINIONS ABOUT CANONICAL TAGS ★ 🦝 RACCOON SIGHTED ON THIS PAGE ★</span></div>
      <div className="webstats">
        YOU ARE VISITOR <b className="counter">{String(count).padStart(9, "0").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b>
        <small>(or maybe not, Aquib blocked his own analytics in robots.txt)</small>
        <button onClick={() => setPaused((p) => !p)}>{paused ? "OK RESUME ▶" : "MAKE IT STOP ⏸"}</button>
      </div>

      <header className="site-header">
        <a className="logo" href="#top">🔍 Aquib<sup>™®!!!</sup></a>
        <nav>
          <a href="#er">fix_my_site.exe</a>
          <a href="#features">Features!!!</a>
          <a href="#proof">Proof??</a>
          <a href="#faq">Who did this??</a>
        </nav>
        <div className="hdr-btns">
          <button className="gbtn small yellow" onClick={() => setVision("googlebot")} title="See this page the way Google does">👁️ GOOGLEBOT VISION</button>
          <button className="gbtn small blue" onClick={() => setVision("chatgpt")} title="Summarise this page like an AI Overview">✦ CHATGPT VISION</button>
          <a className="gbtn small" href={CV} download>MY CV!!! ↓</a>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="hero" id="top">
        <span className="floaty bob" style={{ left: "8%", top: 70 }}>👻</span>
        <span className="floaty bob" style={{ right: "9%", top: 60, animationDelay: ".6s" }}>💼</span>
        <span className="floaty bob" style={{ left: "17%", bottom: 140, animationDelay: "1.2s" }}>🔥</span>
        <span className="sticker-r spin" aria-hidden="true">📀</span>

        <div className="collage" aria-label="Meme collage: Googlebot in a tie has entered the chat">
          <div className="impact" style={{ color: "#fff", fontSize: 16 }}>SEO HAS ENTERED THE CHAT</div>
          <div className="scene">
            <span style={{ fontSize: 70, left: 58, top: 24 }}>🕷️</span>
            <span style={{ fontSize: 34, left: 76, top: 92 }}>👔</span>
            <span style={{ fontSize: 30, left: 16, top: 40 }}>📞</span>
            <span style={{ fontSize: 26, right: 10, top: 8 }}>💸</span>
            <span style={{ fontSize: 26, left: 8, bottom: 6 }}>🔥</span>
            <span style={{ fontSize: 26, right: 12, bottom: 8 }}>🐈</span>
          </div>
          <div className="cap">he found your missing traffic</div>
          <div className="cap2">Fig. 1: Googlebot reviewing this website. Easily bribed with schema.</div>
        </div>
        <div className="stamp-round"><div>AI<br />READY<small>(robots.txt allows it)</small></div></div>
        <div className="postit">
          <div style={{ fontSize: 11 }}>about_page_FINAL_final_v7.html</div>
          <div className="ghost">👻</div>
          <div className="note">i&apos;ve been on page 4 since 2022</div>
        </div>
        <div className="hire-diff wordart blue">HIRE<br />DIFFERENT!!!</div>

        <div className="badge">⭐ #1 SEO PERSON IN THIS PARTICULAR TAB ⭐</div>
        <h1>
          <span className="l1">Bestest SEO™</span>
          <span className="l2 wordart">Ranking Specialist</span>
          <span className="l3">for Ranking-Hungry Teams</span>
        </h1>
        <p className="tagline">Rankings? It&apos;s done bhai.</p>
        <div className="ctas">
          <a className="gbtn" href="#er">✨ FIX MY RANKINGS ✨</a>
          <a className="gbtn pink" href="#hire">TAKE ME TO REAL AQUIB ↗</a>
        </div>
        <div>
          <span className="fakecheck" role="checkbox" aria-checked={notBot} tabIndex={0}
            onClick={() => { if (!notBot) { setNotBot(true); beep("win"); toast("Verified. Status: 200 OK. Welcome, human."); } }}>
            <span className="box">{notBot ? "✓" : ""}</span>
            <span>Prove you are NOT a 404<small>reCRAWLtcha · Privacy · Terms</small></span>
          </span>
        </div>
      </section>

      <div className="construction"><div>🚧 THIS WEBSITE IS UNDER CONSTRUCTION, LIKE EVERY SITE MIGRATION EVER 🚧</div></div>
      <div className="marq"><span>✶ MORE CITATIONS ✶ FEWER 404s ✶ LESS INDEX BLOAT ✶ MORE LEADS ✶ ZERO VANITY METRICS ✶ MORE CITATIONS ✶ FEWER 404s ✶ LESS INDEX BLOAT ✶ MORE LEADS ✶</span></div>

      {/* ============ FEATURES ============ */}
      <section className="panel stars" id="features" style={{ backgroundImage: "inherit" }}>
        <div className="panel-in">
          <h2 className="sec-title" style={{ color: "#ff3b00", textShadow: "3px 3px #ff0, 5px 5px #000" }}>Your SEO is broken. You know it.</h2>
          <p className="sec-sub">Aquib fixes it with real™ search skills (6+ years, all startups, zero black hat)</p>
          <div className="cards">
            <div className="card c1">
              <div className="art" style={{ background: "repeating-linear-gradient(45deg,#fff 0 12px,#fff9b0 12px 24px)" }}>
                🐛<span className="chip" style={{ right: 10, bottom: 12, transform: "rotate(-6deg)" }}>FOUND IT.</span>
              </div>
              <div className="num">01 · TECHNICAL SEO</div>
              <h3>Find the bugs before Google does.</h3>
              <p>Render parity (is your content in the HTML, or only after JavaScript?), index bloat, redirect maps, cannibalization, schema that actually parses. The boring stuff that holds everything up.</p>
              <button className="useless" onClick={() => openWin("sorry")}>unhelpful button</button>
            </div>
            <div className="card c2">
              <div className="art" style={{ background: "#ff5fd0" }}>
                <span className="chip" style={{ left: 12, top: 18, transform: "rotate(-5deg)" }}>is this site trustworthy?</span>
                <span className="chip" style={{ right: 12, bottom: 18, transform: "rotate(4deg)", background: "#b8ff9a" }}>according to [1], yes 🔗</span>
              </div>
              <div className="num">02 · GEO + AEO</div>
              <h3>Get cited by the robots.</h3>
              <p>ChatGPT, Perplexity, Gemini, AI Overviews. Definition-first answers, layered schema, entity work and share-of-answers tracking, so the AI recommends you instead of summarising you.</p>
              <button className="useless" onClick={() => openWin("sorry")}>unhelpful button</button>
            </div>
            <div className="card c3">
              <div className="art" style={{ background: "#000", color: "#39ff14", font: "bold 16px 'Courier New'", flexDirection: "column" }}>
                <div>traffic.exe → leads.exe</div><div>→ revenue.exe</div><div className="blink" style={{ color: "red" }}>● REC</div>
              </div>
              <div className="num">03 · GROWTH</div>
              <h3>Traffic that pays rent.</h3>
              <p>Tracked from query to lead to application to enrollment. At AND Academy that was ~5,000 leads, ~200 enrollments and ~₹2 Cr a year. Impressions are nice. Revenue is nicer.</p>
              <button className="useless" onClick={() => openWin("sorry")}>unhelpful button</button>
            </div>
          </div>
          <div className="blueband">LESS &quot;WE&apos;RE WORKING ON IT.&quot; MORE &quot;WE&apos;RE ON PAGE 1.&quot; 🚀</div>
        </div>
      </section>

      {/* ============ ER ============ */}
      <section className="panel stripes-pink" id="er">
        <div className="panel-in">
          <div className="bar-label"><span>🚑 THE SEO EMERGENCY ROOM™</span><i>BUILT BY AQUIB. TESTED ON YOUR WEBSITE.</i></div>
          <div className="er-grid">
            <div className="er-pitch">
              <div className="vabt">VERY ADVANCED DOCTOR TECHNOLOGY.</div>
              <h2 className="impact-stack"><span className="y">FIX</span><br /><span className="r">MY RANKINGS.</span></h2>
              <div className="whitebox">Website feeling slow? Not ranking? Ignored by ChatGPT? Type your domain. Dr. Aquib will check the real site, live, and be rude about it.</div>
              <ul>
                <li>❤️ Pulse, speed &amp; redirect chains</li>
                <li>🏷️ Title, meta, H1, canonical, lang</li>
                <li>🧬 Schema (JSON-LD) &amp; Open Graph</li>
                <li>👀 Is your copy in the HTML, or hiding behind JavaScript?</li>
                <li>🤖 robots.txt vs GPTBot, ClaudeBot, PerplexityBot &amp; friends</li>
                <li>🗺️ sitemap.xml &amp; llms.txt</li>
              </ul>
              <p style={{ font: "bold 13px 'Times New Roman'", marginTop: 10 }}>NO REFUNDS IF IT WORKS.</p>
            </div>
            <ER />
          </div>
        </div>
      </section>

      <div className="construction"><div>⚡ WARNING: A CORE UPDATE HAS BEEN SPOTTED IN YOUR AREA. DO NOT DELETE YOUR BLOG IN A PANIC ⚡</div></div>

      {/* ============ CLICK SOMETHING ============ */}
      <section className="panel stripes-cyan" id="click">
        <div className="panel-in">
          <div className="bar-label"><span>🦝 AQUIB HAS ADDED FEATURES</span><i>NO ONE ASKED HIM TO DO THIS</i></div>
          <h2 className="cos impact-stack"><span className="r">COME ON.</span><br /><span className="r">CLICK SOMETHING.</span></h2>
          <p style={{ background: "#ffef5c", border: "2px solid #000", display: "inline-block", padding: "4px 10px", font: "bold 15px 'Times New Roman'", marginBottom: 20 }}>Your SEO person should have war stories. Here are two, as video games.</p>
          <div className="click-row">
            <CoreUpdate />
            <div id="raccoon"><RaccoonHunt /></div>
          </div>
        </div>
      </section>

      {/* ============ DOWNLOAD ============ */}
      <section className="wrap" style={{ marginTop: 10 }}>
        <div className="win98 yellowwin">
          <div className="tbar"><span>internet_download_centre.html</span><span style={{ font: "bold 11px Arial" }}>VERY SAFE. MANY GREEN BUTTONS.</span></div>
          <div className="wbody dlc">
            <div>
              <h2>Why hire an agency<br />when you can download a specialist?</h2>
              <p style={{ font: "14px 'Times New Roman'", marginTop: 6 }}>6+ years · 1 Core Update survived · 0 black-hat backlinks · Requires: chai.</p>
              {dl !== null && (
                <div className="dlprog">
                  <div className="progress98" style={{ maxWidth: 420 }}>{Array.from({ length: Math.round((dl / 100) * 26) }).map((_, i) => <i key={i} />)}</div>
                  <p style={{ font: "bold 13px Arial", marginTop: 6 }}>{dl < 99 ? `Installing Aquib… ${dl}%` : dl === 99 ? "99%… finalising canonical tags… (forever)" : "Done. It was a PDF all along."}</p>
                </div>
              )}
            </div>
            <button className="gbtn" onClick={fakeDownload}>↓ DOWNLOAD<br />QUALIFIED_SEO.exe</button>
          </div>
        </div>

        <div className="review">
          <span className="lab">ONE COMPLETELY UNHELPFUL REVIEW</span>
          <div className="q">“200.”</div>
          <div className="who">— Googlebot. Verified crawler. Rendered the page. Refused to elaborate.</div>
        </div>

        <div className="unsub">
          <b>Unsubscribe from &quot;content is king&quot;.</b>
          <a href="#hire" style={{ fontFamily: "'Comic Sans MS', 'Comic Neue'", fontWeight: "bold" }}>I would like actual rankings please →</a>
        </div>
      </section>

      {/* ============ PROOF ============ */}
      <section className="panel stripes-lime" id="proof">
        <div className="panel-in">
          <div className="bar-label"><span>📊 THE BORING PART</span><i>(BUT REAL, AND ON THE CV)</i></div>
          <h2 className="sec-title wordart green">Proof, Not Vibes</h2>
          <p className="sec-sub">Traffic is nice. Leads, enrollments and revenue are nicer. <span className="newgif">NEW!</span></p>
          <table className="guestbook">
            <tbody>
              {Array.from({ length: STATS.length / 2 }).map((_, r) => (
                <tr key={r}>
                  {STATS.slice(r * 2, r * 2 + 2).map(([n, l]) => [<td key={n} className="n">{n}</td>, <td key={l} className="l">{l}</td>])}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="win98 notepad" style={{ marginTop: 28 }}>
            <div className="tbar"><span>📝 career_access.log - Notepad</span><span className="tb-btns"><span>_</span><span>□</span><span>✕</span></span></div>
            <div className="menubar"><span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>S</u>earch</span><span><u>H</u>elp</span></div>
            <div className="wbody">
              <div className="inset">
                {"# tail -f /var/log/aquib/career.log\n\n"}
                {LOG.map(([d, s, cls, path, desc]) => (
                  <div key={path} style={{ marginBottom: 12 }}>
                    [{d}] <span className={cls}>{s}</span> {path}{"\n"}<span style={{ color: "#555" }}>    {desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ RESEARCH ============ */}
      <section className="panel" id="research" style={{ background: "#000080", borderColor: "#0ff" }}>
        <div className="panel-in">
          <h2 className="sec-title" style={{ color: "#ff0", fontFamily: "Impact, sans-serif", letterSpacing: 1 }}>THE X-FILES: HE OPENED THE NETWORK TAB 👽</h2>
          <p className="sec-sub" style={{ color: "#fff" }}>Most people read SEO news. Aquib does his own digging, and sometimes it ends up in the news.</p>
          <div className="folders">
            {RESEARCH.map(([i, tag, t, d]) => (
              <div className="folder" key={t}>
                <div className="ico">📁{i}</div>
                <span className="tag">{tag}</span>
                <h4>{t}</h4>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BUILDS ============ */}
      <section className="wrap" id="builds" style={{ margin: "28px auto" }}>
        <div className="win98">
          <div className="tbar"><span>🛠️ C:\AQUIB\TOOLS_HE_BUILT_INSTEAD_OF_BUYING</span><span className="tb-btns"><span>_</span><span>□</span><span>✕</span></span></div>
          <div className="wbody">
            <table className="dltable">
              <thead><tr><th>Name</th><th>Description</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {BUILDS.map(([n, d, s]) => (
                  <tr key={n}>
                    <td className="name">💾 {n}</td><td>{d}</td><td>{s}</td>
                    <td><button className="w98" onClick={() => openWin("sorry")}>Download</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ font: "11px Arial", marginTop: 8 }}>{BUILDS.length} object(s) · 0 bytes free · Downloads disabled, for everyone&apos;s safety.</p>
          </div>
        </div>
      </section>

      {/* ============ LETTER ============ */}
      <section className="wrap" style={{ margin: "28px auto" }}>
        <div className="win98 letter98">
          <div className="tbar"><span>✉️ A message from Aquib</span><span className="tb-btns"><span>✕</span></span></div>
          <div className="wbody">
            <p>Hello dear hiring manager!!</p>
            <p>You could have got a PDF. You still can (top right, or the green button). But SEO is half evidence and half persuasion, so I made you something to poke at instead.</p>
            <p>Under the raccoon, I care about the boring, load-bearing stuff: render parity, redirect maps that don&apos;t leak, schema that parses, content that answers the question first, and numbers that end in leads and revenue.</p>
            <p>If your site went through the ER and you winced a little, that&apos;s a good conversation to have.</p>
            <p><b>Regards, Aquib</b> 👍 <i>(SEO, GEO, AEO, and now apparently webmaster)</i></p>
          </div>
        </div>
      </section>

      {/* ============ INDEX MY CV ============ */}
      <section className="panel stripes-pink" id="indexing">
        <div className="panel-in">
          <div className="bar-label"><span>📄 CV INDEXING DEPARTMENT</span><i>EVERY SEO HAS LIVED THIS</i></div>
          <h2 className="sec-title impact-stack"><span className="r">PLEASE INDEX</span> <span className="y">MY CV.</span></h2>
          <p className="sec-sub">Google hasn&apos;t indexed it yet. Maybe you can help. Click until it works (that&apos;s the SEO experience).</p>
          <IndexCV />
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="panel stripes-cyan" id="faq">
        <div className="panel-in">
          <h2 className="sec-title wordart gold">Frequently Avoided Questions</h2>
          <p className="sec-sub">Click a question. Nothing bad will happen. Probably.</p>
          <div className="faq">
            {FAQ.map(([q, a]) => (
              <details key={q}><summary>{q}</summary><p>{a}</p></details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL ============ */}
      <section className="final" id="hire">
        <div className="badge" style={{ display: "inline-block", background: "#ffef5c", border: "3px dashed red", padding: "6px 14px", fontWeight: "bold", transform: "rotate(-2deg)" }}>🏆 VOTED BEST SEO PERSON BY HIS OWN WEBSITE 🏆</div>
        <h2 className="wordart" style={{ marginTop: 16 }}>VERY GOOD<br />SEO PERSON.</h2>
        <p style={{ fontSize: 20, fontWeight: "bold", marginTop: 14 }}>Email gets the fastest reply. The CV is a real PDF, not an .exe. I promise.</p>
        <div className="ctas">
          <a className="gbtn" href={`mailto:${EMAIL}?subject=${encodeURIComponent("Saw your SEO Emergency Room. Let's talk.")}`}>✉️ EMAIL AQUIB SO HE GETS HIRED</a>
          <a className="gbtn blue" href={LINKEDIN} target="_blank" rel="noopener noreferrer">LINKEDIN ↗</a>
          <a className="gbtn pink" href={CV} download>CV.PDF ↓</a>
        </div>
        <p className="times" style={{ marginTop: 18 }}>{EMAIL} · Delhi NCR</p>
        <div style={{ marginTop: 30 }}><HireDialog /></div>
      </section>

      <footer className="footer">
        <div>done by Aquib © 2018–2026* · <a href="#top">Return to position #1</a> · <a href="#" onClick={(e) => { e.preventDefault(); toast("Unsubscribed from good rankings. Bold move."); }}>Unsubscribe from good rankings</a></div>
        <div style={{ fontSize: 11, marginTop: 4 }}>*indexed eventually. Best viewed in Netscape Navigator at 800×600.</div>
        <div style={{ marginTop: 8 }}><button className="bh-link" onClick={() => blackHat()}>😈 rank faster (do not click)</button></div>
        <div className="webring">[ <a href="#top">◀ prev</a> | <a href="#er">SEO Doctors Webring</a> | <a href="#hire">next ▶</a> ]</div>
      </footer>

      <Popups />
      <Vision />
      <BlackHat />
    </>
  );
}
