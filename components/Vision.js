"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { beep } from "./sound";

export function setVision(mode) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("aq-vision", { detail: mode }));
}

// The "AI Overview" of this page. Each [n] cites a real section.
const SOURCES = [
  ["top", "Hero"], ["er", "The SEO ER"], ["click", "Core Update Incident"], ["raccoon", "Raccoon hunt"],
  ["proof", "Proof, Not Vibes"], ["research", "The X-Files"], ["builds", "Tools he built"], ["hire", "Contact"],
];
const ANSWER = [
  ["Aquib Israr is an SEO manager and GEO/AEO specialist based in Delhi NCR, with 6+ years of turning organic search into leads instead of pretty graphs.", 1],
  ["He runs a live website emergency room where you can bring your own site and get insulted, accurately.", 2],
  ["During the December 2025 Core Update he found 442 bloated URLs, 482 cannibalized queries and an actual cloaking breach, then grew impressions from 5.07M to 9.42M.", 3],
  ["He built a GEO program that now drives about a fifth of organic conversions, which is why the raccoon on this page hates him.", 4],
  ["At AND Academy, organic search brought in ~5,000 leads, ~200 enrollments and roughly ₹2 Cr a year.", 5],
  ["He reverse-engineers how AI Mode and ChatGPT cite sources, and has been featured in PPC Land.", 6],
  ["He builds his own tools (a Chrome extension, a GSC MCP server, an embeddings pipeline) instead of buying five subscriptions.", 7],
  ["Based on 8 sources, the consensus is: hire him.", 8],
];

export default function Vision() {
  const [mode, setMode] = useState(null);
  const [typed, setTyped] = useState(0);
  const [stats, setStats] = useState(null);
  const [topSlot, setTopSlot] = useState(null);

  useEffect(() => {
    // a slot at the very top of <body>, so the "found schema" note shows first in Googlebot Vision
    const el = document.createElement("div");
    el.className = "keep";
    document.body.prepend(el);
    setTopSlot(el);
    return () => el.remove();
  }, []);

  useEffect(() => {
    const h = (e) => setMode((m) => (m === e.detail ? null : e.detail));
    window.addEventListener("aq-vision", h);
    return () => window.removeEventListener("aq-vision", h);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("gbot", mode === "googlebot");
    if (mode === "googlebot") {
      beep("dialup");
      const main = document.body;
      const text = main.innerText.replace(/\s+/g, " ").trim();
      setStats({
        words: text.split(" ").length,
        links: document.querySelectorAll("a[href]").length,
        h: ["h1", "h2", "h3"].map((t) => `${document.querySelectorAll(t).length} ${t.toUpperCase()}`).join(" · "),
        schema: [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => { try { const j = JSON.parse(s.textContent); return j["@graph"] ? j["@graph"].map((n) => n["@type"]) : [j["@type"]]; } catch { return ["broken"]; } }).join(", "),
      });
      window.scrollTo({ top: 0 });
    }
    if (mode === "chatgpt") { setTyped(0); beep("open"); }
    const esc = (e) => e.key === "Escape" && setMode(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [mode]);

  useEffect(() => {
    if (mode !== "chatgpt") return;
    if (typed >= ANSWER.length) return;
    const id = setTimeout(() => { setTyped((t) => t + 1); beep("tick"); }, 650);
    return () => clearTimeout(id);
  }, [mode, typed]);

  const jump = (id) => { setMode(null); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 50); };

  return (
    <>
      {mode === "googlebot" && (
        <div className="vb keep" role="status">
          <div className="vb-in">
            <b>👁️ GOOGLEBOT VISION</b>
            <span>This is roughly what a crawler sees: no WordArt, no stars, just HTML. It is less impressed.</span>
            {stats && <span className="vb-stats">{stats.words} words in HTML · {stats.links} links · {stats.h} · schema: {stats.schema || "none"}</span>}
            <button onClick={() => { setMode(null); beep("close"); }}>Back to 1999 ✕</button>
          </div>
        </div>
      )}
      {mode === "googlebot" && topSlot && createPortal(
        <pre className="gbot-only keep">{`<!-- Googlebot found this structured data. Aquib practises what he preaches. -->
<script type="application/ld+json">
{ "@graph": [ "ProfilePage", "WebSite",
  { "@type": "Person", "name": "Aquib Israr",
  "jobTitle": "SEO Manager | GEO & AEO Specialist",
  "knowsAbout": ["SEO", "GEO", "AEO", "Technical SEO", "Structured Data"] } ] }
</script>`}</pre>,
        topSlot
      )}

      {mode === "chatgpt" && (
        <div className="cgv" role="dialog" aria-label="AI Overview of this page" onClick={(e) => e.target === e.currentTarget && setMode(null)}>
          <div className="cgv-card">
            <div className="cgv-head">
              <span>✦ AI Overview</span>
              <button onClick={() => setMode(null)} aria-label="Close">✕</button>
            </div>
            <div className="cgv-q">🔍 who is aquib israr and should we hire him</div>
            <div className="cgv-body">
              {ANSWER.slice(0, typed).map(([t, n], i) => (
                <span key={i}>{t} <button className="cite" onClick={() => jump(SOURCES[n - 1][0])} title={SOURCES[n - 1][1]}>{n}</button>{" "}</span>
              ))}
              {typed < ANSWER.length && <span className="blink">▍</span>}
            </div>
            {typed >= ANSWER.length && (
              <>
                <div className="cgv-src">
                  {SOURCES.map(([id, label], i) => (
                    <button key={id} onClick={() => jump(id)}><b>{i + 1}</b> {label}</button>
                  ))}
                </div>
                <div className="cgv-note">🦝 Note: one source (the raccoon) disputes this summary. This overview was optimised by the person it describes, which is exactly the point.</div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
