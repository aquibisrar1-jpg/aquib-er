"use client";
import { useEffect, useRef, useState } from "react";
import { beep } from "./sound";
import { confetti } from "./fx";

export function blackHat() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("aq-blackhat"));
}

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const SPAM = [
  "best seo", "cheap seo", "seo delhi", "seo near me", "best seo near me cheap", "hire seo", "seo seo seo", "#1 seo",
  "buy backlinks", "seo expert delhi ncr cheap best", "top 10 seo", "seo guru", "rank fast", "page 1 guaranteed",
  "free seo", "seo company", "best design college", "aquib seo", "seo services", "seo agency cheap",
];

export default function BlackHat() {
  const [stage, setStage] = useState(null); // null | spam | penalty | form | approved
  const [rank, setRank] = useState(48);
  const [letter, setLetter] = useState("Dear Google,\n\nI'm sorry. I hired a black-hat SEO who promised page 1 in 7 days.\nI have removed the hidden text, the 10,000 links and my dignity.\nGoing forward, I will hire someone who knows where the line is (Aquib).\n\nRegards,\nA reformed website");
  const seq = useRef([]);
  const oldTitle = useRef("");

  useEffect(() => {
    const go = () => setStage((s) => s || "spam");
    const key = (e) => {
      seq.current = [...seq.current, e.key.length === 1 ? e.key.toLowerCase() : e.key].slice(-KONAMI.length);
      if (KONAMI.every((k, i) => seq.current[i] === k)) go();
    };
    window.addEventListener("aq-blackhat", go);
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("aq-blackhat", go); window.removeEventListener("keydown", key); };
  }, []);

  useEffect(() => {
    if (stage === "spam") {
      oldTitle.current = document.title;
      document.title = "SEO SEO SEO | Best SEO Cheap SEO Delhi SEO Near Me #1 SEO";
      document.documentElement.classList.add("blackhat");
      beep("doom");
      setRank(48);
      let r = 48;
      const climb = setInterval(() => { r = Math.max(1, r - Math.ceil(Math.random() * 9)); setRank(r); beep("tick"); }, 450);
      const end = setTimeout(() => { clearInterval(climb); setStage("penalty"); beep("error"); }, 6500);
      return () => { clearInterval(climb); clearTimeout(end); };
    }
    if (stage === null) {
      document.documentElement.classList.remove("blackhat");
      if (oldTitle.current) document.title = oldTitle.current;
    }
  }, [stage]);

  if (!stage) return null;

  return (
    <>
      {(stage === "spam" || stage === "penalty") && (
        <div className="spam-layer" aria-hidden="true">
          {Array.from({ length: 140 }).map((_, i) => (
            <span key={i} style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, fontSize: 10 + ((i * 7) % 26), transform: `rotate(${(i % 7) * 9 - 27}deg)`, color: ["#f00", "#00f", "#0a0", "#f0f", "#fff"][i % 5] }}>
              {SPAM[i % SPAM.length]}
            </span>
          ))}
          <div className="spam-banner blink">🔗 BUY 10,000 BACKLINKS ₹499 🔗 KEYWORD DENSITY: 94% 🔗</div>
          <div className="spam-rank">YOUR RANKING: #{rank} 📈🚀</div>
          <div className="spam-hidden">hidden white text: best seo best seo best seo best seo best seo best seo best seo best seo</div>
        </div>
      )}

      {stage !== "spam" && (
        <div className="gsc" role="dialog" aria-label="Manual action">
          <div className="gsc-top"><span>☰</span> <b>Search Console</b> <small>(a parody)</small><span style={{ marginLeft: "auto" }}>{window.location.host} ▾</span></div>
          <div className="gsc-main">
            <div className="gsc-side">
              <div>Overview</div><div>Performance</div><div>URL inspection</div><div>Pages</div>
              <div className="on">Manual actions</div><div>Security issues</div>
            </div>
            <div className="gsc-content">
              {stage === "penalty" && (
                <>
                  <h2>Manual actions</h2>
                  <div className="gsc-alert">⚠️ <b>3 issues detected</b> · Some or all of your pages are not shown in Google Search results.</div>
                  {[["Pure spam", "Aggressive spam techniques such as auto-generated gibberish and cloaking."], ["Hidden text and keyword stuffing", "White-on-white text. 'best seo' 412 times. We counted."], ["Unnatural links to your site", "10,000 links from sites called things like cheap-links-4u.biz."]].map(([t, d]) => (
                    <div className="gsc-row" key={t}><div><b>{t}</b><br /><small>{d}</small></div><span>Affects: <b>All pages</b></span></div>
                  ))}
                  <p className="gsc-moral">Your ranking went from #48 to #1 in six seconds. Then to nowhere. This is what black-hat SEO does. Aquib knows exactly where the line is, and stays on the right side of it.</p>
                  <button className="gsc-btn" onClick={() => setStage("form")}>REQUEST REVIEW</button>
                </>
              )}
              {stage === "form" && (
                <>
                  <h2>Request review</h2>
                  <p>Explain what you fixed. Be honest. Google can tell.</p>
                  <textarea value={letter} onChange={(e) => setLetter(e.target.value)} rows={9} />
                  <button className="gsc-btn" onClick={() => { setStage("approved"); beep("win"); confetti(["✅", "🙏", "📈", "🧼"]); }}>SUBMIT REQUEST</button>
                </>
              )}
              {stage === "approved" && (
                <>
                  <h2>✅ Reconsideration request approved</h2>
                  <p>Manual action revoked. Your site may take a while to recover. (In real life: weeks. Sometimes months.)</p>
                  <p className="gsc-moral">Moral: the fastest way back to page 1 is not to leave it in the first place. Hire someone who knows the rules well enough to know which ones not to break.</p>
                  <button className="gsc-btn" onClick={() => { setStage(null); setTimeout(() => document.getElementById("hire")?.scrollIntoView({ behavior: "smooth" }), 60); }}>RETURN TO THE (WHITE-HAT) SITE</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
