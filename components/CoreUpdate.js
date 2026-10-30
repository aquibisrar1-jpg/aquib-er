"use client";
import { useEffect, useState } from "react";
import { beep } from "./sound";

const STEPS = [
  "Dec 2025: a normal Tuesday at AND Academy. Leads coming in. Nobody suspects a thing.",
  "⛈️ THE CORE UPDATE ARRIVES. Top-of-funnel pages drown. Graph goes 📉.",
  "🩺 3 root causes: 442 bloated URLs (from a 1,000+ URL audit), 482 cannibalized queries, 1 server-level cloaking breach on a partner domain (yes, really).",
  "💊 Prune, merge, redirect. Render-parity fixes. Internal-linking overhaul. Declining pages recover 20–30%. Then the whole site keeps climbing.",
];
const CALM = "M10 120 C60 112, 100 98, 150 92";
const DROP = " C175 90, 185 165, 215 175";
const UP = " C260 182, 300 125, 340 100 S 420 50, 490 22";

export default function CoreUpdate() {
  const [stage, setStage] = useState(0);
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    if (!auto) return;
    if (stage >= 3) { setAuto(false); return; }
    const id = setTimeout(() => {
      const n = stage + 1;
      setStage(n);
      beep(n === 1 ? "doom" : n === 3 ? "win" : "error");
    }, 1500);
    return () => clearTimeout(id);
  }, [auto, stage]);

  const path = CALM + (stage >= 1 ? DROP : "") + (stage >= 3 ? UP : "");
  const blocks = stage === 0 ? 4 : stage === 1 ? 1 : stage === 2 ? 3 : 24;

  return (
    <div className="win98 pinkwin">
      <div className="tbar"><span>⛈️ core_update_incident.exe</span><span className="tb-btns"><span>?</span></span></div>
      <div className="wbody">
        <p style={{ font: "bold 22px 'Comic Sans MS', 'Comic Neue'", marginBottom: 8 }}>Rankings: {stage === 0 ? "fine" : stage < 3 ? "NOT fine" : "better than fine"}.</p>
        <div className="graph98">
          <span className={`storm ${stage === 1 ? "shake" : ""}`} style={{ left: stage === 0 ? "80%" : stage < 3 ? "34%" : "110%", top: stage === 0 ? -6 : 10 }}>⛈️</span>
          <svg viewBox="0 0 500 200" preserveAspectRatio="none" aria-label="Impressions graph">
            {[40, 80, 120, 160].map((y) => <line key={y} x1="0" x2="500" y1={y} y2={y} stroke="#ddd" strokeWidth="2" />)}
            <path key={stage} d={path} fill="none" stroke={stage === 1 || stage === 2 ? "#e00" : stage === 3 ? "#00a000" : "#000080"} strokeWidth="5" strokeLinecap="round" style={{ strokeDasharray: 1400, animation: "draw 1.2s ease-out" }} />
            {stage === 3 && <text x="380" y="18" fontFamily="Comic Sans MS" fontSize="16" fontWeight="bold" fill="#00a000">9.42M!!</text>}
          </svg>
          <style>{`@keyframes draw { from { stroke-dashoffset: 1400; } }`}</style>
        </div>
        <div style={{ font: "11px Arial", margin: "4px 0 8px" }}>GSC: monthly organic impressions (dramatised, numbers real)</div>
        <div className="progress98" aria-label="recovery progress">{Array.from({ length: blocks }).map((_, i) => <i key={i} />)}</div>
        <ol className="steps98">
          {STEPS.map((s, i) => <li key={i} className={stage >= i ? "on" : ""}>{s}</li>)}
        </ol>
        {stage === 3 && (
          <div className="nums98">
            <div>+86%<small>impressions 5.07M→9.42M</small></div>
            <div>23→10<small>avg. position</small></div>
            <div>p4→top10<small>priority terms</small></div>
          </div>
        )}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <button className="gbtn pink small" onClick={() => { setStage(0); setAuto(true); beep("open"); }}>{stage === 0 ? "SUMMON THE CORE UPDATE" : "↻ AGAIN"}</button>
          {stage > 0 && stage < 3 && !auto && <button className="gbtn small" onClick={() => { setStage(3); beep("win"); }}>DEPLOY AQUIB</button>}
        </div>
        <p style={{ font: "11px Arial", marginTop: 10 }}>Any resemblance to your last core update is deeply unfortunate.</p>
      </div>
    </div>
  );
}
