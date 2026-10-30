"use client";
import { useEffect, useState } from "react";
import { StormCloud } from "./Mascots";
import { beep } from "./sound";

// stage 0: calm, 1: storm hits, 2: diagnosis, 3: recovery
const STEPS = [
  { t: "Dec 2025: a normal Tuesday", d: "AND Academy's organic engine humming along. Leads coming in. Nobody suspects a thing." },
  { t: "THE CORE UPDATE ARRIVES", d: "Google's December 2025 Core Update rolls in like a Delhi monsoon. Top-of-funnel pages drown. Graph goes 📉." },
  { t: "Dr. Aquib diagnoses 3 root causes", d: "Index bloat: a 1,000+ URL audit flagged 442 URLs. 482 cannibalized queries fighting each other. And a server-level cloaking breach on a partner domain (yes, really)." },
  { t: "Treatment & recovery", d: "Prune, merge and redirect. Render-parity fixes. An internal-linking overhaul. Declining pages recovered 20–30%, then the whole site kept climbing." },
];

const LINE_CALM = "M10 150 C60 140, 100 120, 150 112";
const LINE_DROP = " C175 110, 185 190, 215 205";
const LINE_RECOVER = " C260 215, 300 150, 340 120 S 420 60, 490 30";

export default function CoreUpdate() {
  const [stage, setStage] = useState(0);
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    if (!auto) return;
    if (stage >= 3) { setAuto(false); return; }
    const id = setTimeout(() => {
      const next = stage + 1;
      setStage(next);
      beep(next === 1 ? "doom" : next === 3 ? "win" : "click");
    }, 1500);
    return () => clearTimeout(id);
  }, [auto, stage]);

  const path = LINE_CALM + (stage >= 1 ? LINE_DROP : "") + (stage >= 3 ? LINE_RECOVER : "");

  return (
    <div className="incident">
      <div>
        <div className="graph">
          <div className="stage-cloud" style={{ transform: stage === 1 || stage === 2 ? "translate(-120px, 40px) scale(1.1)" : stage === 3 ? "translate(200px,-60px) scale(.6)" : "translate(80px,-20px) scale(.7)", opacity: stage === 3 ? 0 : 1 }}>
            <div className={stage === 1 ? "shake" : "float"}>
              <StormCloud size={140} angry={stage < 3} />
            </div>
          </div>
          <div className="legend">
            <span>GSC: monthly organic impressions</span>
            <span>{stage === 3 ? "📈 9.42M" : stage >= 1 ? "📉 help" : "5.07M"}</span>
          </div>
          <svg viewBox="0 0 500 240" aria-label="Impressions graph">
            {[40, 90, 140, 190].map((y) => (
              <line key={y} x1="0" x2="500" y1={y} y2={y} stroke="#eee" strokeWidth="2" />
            ))}
            <path key={stage} d={path} fill="none" stroke={stage === 1 || stage === 2 ? "var(--red)" : stage === 3 ? "var(--green)" : "var(--blue)"} strokeWidth="6" strokeLinecap="round"
              style={{ strokeDasharray: 1400, strokeDashoffset: 0, animation: "draw 1.2s ease-out" }} />
            {stage === 2 && (
              <g fontFamily="monospace" fontSize="13" fontWeight="700">
                <text x="225" y="170" fill="var(--red)">← 442 bloated URLs</text>
                <text x="225" y="188" fill="var(--red)">← 482 cannibalized queries</text>
                <text x="225" y="206" fill="var(--red)">← 1 cloaking breach (!!)</text>
              </g>
            )}
            {stage === 3 && <circle cx="490" cy="30" r="9" fill="var(--yellow)" stroke="#111" strokeWidth="3" />}
          </svg>
          <style>{`@keyframes draw { from { stroke-dashoffset: 1400; } }`}</style>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
            <button className="btn pink small" onClick={() => { setStage(0); setAuto(true); beep("click"); }}>
              {stage === 0 ? "▶ SUMMON THE CORE UPDATE" : "↺ REPLAY THE INCIDENT"}
            </button>
            {stage > 0 && stage < 3 && !auto && (
              <button className="btn small" onClick={() => { setStage(3); beep("win"); }}>DEPLOY AQUIB</button>
            )}
          </div>
        </div>
        {stage === 3 && (
          <div className="bignums">
            <div className="bignum"><div className="n">+86%</div><div className="l">impressions (5.07M→9.42M)</div></div>
            <div className="bignum"><div className="n">23→10</div><div className="l">avg. position</div></div>
            <div className="bignum"><div className="n">p4→top10</div><div className="l">priority terms</div></div>
          </div>
        )}
      </div>
      <div className="steps">
        {STEPS.map((s, i) => (
          <div key={i} className={`step ${stage >= i ? "on" : ""}`}>
            <b>{String(i + 1).padStart(2, "0")} · {s.t}</b>
            <div style={{ fontSize: 14, marginTop: 4 }}>{s.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
