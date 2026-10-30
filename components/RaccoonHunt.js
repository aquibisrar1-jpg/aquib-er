"use client";
import { useEffect, useRef, useState } from "react";
import { beep } from "./sound";

const SECS = 15;
const TAUNTS = ["*steals click*", "zero-click search!!", "summarised ur blog lol", "no citation 4 u", "yoink", "AI Overview'd"];

export default function RaccoonHunt() {
  const [phase, setPhase] = useState("intro");
  const [pos, setPos] = useState({ x: 40, y: 40 });
  const [caught, setCaught] = useState(0);
  const [stolen, setStolen] = useState(0);
  const [time, setTime] = useState(SECS);
  const [poofs, setPoofs] = useState([]);
  const box = useRef(null);
  const live = useRef(false);

  useEffect(() => {
    if (phase !== "play") return;
    const tick = setInterval(() => setTime((t) => t - 1), 1000);
    const hop = setInterval(() => { if (live.current) { setStolen((s) => s + 1); beep("miss"); } move(); }, 850);
    move();
    return () => { clearInterval(tick); clearInterval(hop); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => { if (phase === "play" && time <= 0) { setPhase("over"); beep("win"); } }, [time, phase]);

  function move() {
    const b = box.current?.getBoundingClientRect();
    const w = b?.width || 500, h = b?.height || 340;
    setPos({ x: Math.random() * (w - 90), y: 14 + Math.random() * (h - 100) });
    live.current = true;
  }
  function hit(e) {
    e.stopPropagation();
    if (!live.current) return;
    live.current = false;
    beep("catch");
    setCaught((c) => c + 1);
    const b = box.current.getBoundingClientRect();
    const id = Math.random();
    setPoofs((p) => [...p, { id, x: e.clientX - b.left, y: e.clientY - b.top, t: ["CAUGHT!", "CITED!", "+1 CLICK", "GOTCHA"][Math.floor(Math.random() * 4)] }]);
    setTimeout(() => setPoofs((p) => p.filter((q) => q.id !== id)), 700);
    setTimeout(move, 120);
  }
  const start = () => { setCaught(0); setStolen(0); setTime(SECS); setPhase("play"); beep("open"); };

  const rank =
    caught >= 14 ? "GEO SPECIALIST. Frankly, you should apply for my job." :
    caught >= 9 ? "Solid. The raccoon fears you a reasonable amount." :
    caught >= 4 ? "The raccoon got most of it. Very 2025 of you." :
    "The raccoon has your traffic, your leads and your lunch.";

  return (
    <div className="win98 yellowwin">
      <div className="tbar"><span>🦝 catch_the_ai_overview.exe</span><span className="tb-btns"><span>_</span><span>?</span></span></div>
      <div className="wbody">
        <div className="hud">
          <span>⏱ {phase === "play" ? time : SECS}s</span>
          <span style={{ color: "#008000" }}>CLICKS RECOVERED: {caught}</span>
          <span style={{ color: "#c00" }}>CLICKS STOLEN: {stolen}</span>
        </div>
        <div className="hunt" ref={box}>
          <div className="serpbg"><b>Google: best design college in india</b>{Array.from({ length: 14 }).map((_, i) => <div key={i} style={{ width: `${40 + ((i * 37) % 55)}%` }} />)}</div>
          {phase === "play" && (
            <button className="target" style={{ left: pos.x, top: pos.y }} onClick={hit} aria-label="Catch the raccoon">
              🦝<span className="taunt">{TAUNTS[(caught + stolen) % TAUNTS.length]}</span>
            </button>
          )}
          {poofs.map((p) => <span key={p.id} className="poof" style={{ left: p.x, top: p.y }}>{p.t}</span>)}
          {phase === "intro" && (
            <div className="overlay"><div>
              <div style={{ fontSize: 80 }} className="bob">🦝</div>
              <p style={{ font: "bold 28px 'Comic Sans MS', 'Comic Neue'" }}>A wild AI Overview appeared!</p>
              <p style={{ font: "15px 'Times New Roman'", maxWidth: 440, margin: "8px auto 14px" }}>It sits on top of your rankings, summarises your content and keeps the click. Catch it for {SECS} seconds. This is my day job.</p>
              <button className="gbtn" onClick={start}>START HUNT</button>
            </div></div>
          )}
          {phase === "over" && (
            <div className="overlay"><div>
              <div style={{ fontSize: 60 }}>🦝🔒</div>
              <p style={{ font: "bold 28px 'Comic Sans MS', 'Comic Neue'" }}>{caught} recovered · {stolen} stolen</p>
              <p style={{ font: "bold 15px Arial", margin: "6px 0" }}>{rank}</p>
              <p style={{ font: "14px 'Times New Roman'", maxWidth: 520, margin: "0 auto 12px" }}>For the record: at AND Academy I built a GEO program from scratch that now drives about <b>a fifth of organic conversions</b>, tracked with a share-of-answers dashboard across ChatGPT, Perplexity, Gemini and AI Overviews. You can&apos;t beat the raccoon. You can make it cite you.</p>
              <button className="gbtn yellow" onClick={start}>AGAIN!!!</button>
            </div></div>
          )}
        </div>
      </div>
    </div>
  );
}
