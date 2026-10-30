"use client";
import { useEffect, useRef, useState } from "react";
import { Raccoon } from "./Mascots";
import { beep } from "./sound";

const GAME_SECONDS = 15;
const TAUNTS = ["*steals click*", "zero-click search!!", "summarised ur blog lol", "no citation 4 u", "yoink", "AI Overview'd"];

export default function RaccoonHunt() {
  const [phase, setPhase] = useState("intro"); // intro | play | over
  const [pos, setPos] = useState({ x: 40, y: 40 });
  const [caught, setCaught] = useState(0);
  const [stolen, setStolen] = useState(0);
  const [time, setTime] = useState(GAME_SECONDS);
  const [poofs, setPoofs] = useState([]);
  const boxRef = useRef(null);
  const visible = useRef(false);

  useEffect(() => {
    if (phase !== "play") return;
    const tick = setInterval(() => setTime((t) => t - 1), 1000);
    const hop = setInterval(() => {
      if (visible.current) setStolen((s) => s + 1);
      move();
    }, 850);
    move();
    return () => { clearInterval(tick); clearInterval(hop); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (phase === "play" && time <= 0) { setPhase("over"); beep("win"); }
  }, [time, phase]);

  function move() {
    const b = boxRef.current?.getBoundingClientRect();
    const w = b?.width || 600, h = b?.height || 380;
    setPos({ x: Math.random() * (w - 100), y: Math.random() * (h - 100) });
    visible.current = true;
  }

  function hit(e) {
    e.stopPropagation();
    if (!visible.current) return;
    visible.current = false;
    beep("catch");
    setCaught((c) => c + 1);
    const b = boxRef.current.getBoundingClientRect();
    const id = Math.random();
    setPoofs((p) => [...p, { id, x: e.clientX - b.left, y: e.clientY - b.top, t: ["CAUGHT!", "CITED!", "+1 CLICK", "GOTCHA"][Math.floor(Math.random() * 4)] }]);
    setTimeout(() => setPoofs((p) => p.filter((q) => q.id !== id)), 700);
    setTimeout(move, 120);
  }

  function start() {
    setCaught(0); setStolen(0); setTime(GAME_SECONDS); setPhase("play"); beep("click");
  }

  const rank =
    caught >= 14 ? "GEO SPECIALIST. Frankly, you should apply for my job." :
    caught >= 9 ? "Solid. The raccoon fears you a reasonable amount." :
    caught >= 4 ? "The raccoon got most of it. Very 2025 of you." :
    "The raccoon has your traffic, your leads and your lunch.";

  return (
    <div>
      <div className="hunt-hud">
        <span>⏱ {phase === "play" ? time : GAME_SECONDS}s</span>
        <span style={{ color: "var(--green)" }}>🫳 Clicks recovered: {caught}</span>
        <span style={{ color: "var(--red)" }}>🦝 Clicks stolen: {stolen}</span>
      </div>
      <div className="hunt" ref={boxRef}>
        <div className="fake-serp">
          <b style={{ color: "#999" }}>Google · best design college in india</b>
          {Array.from({ length: 14 }).map((_, i) => <div key={i} style={{ width: `${40 + ((i * 37) % 55)}%` }} />)}
        </div>
        {phase === "play" && (
          <button className="target" style={{ left: pos.x, top: pos.y }} onClick={hit} aria-label="Catch the raccoon">
            <Raccoon size={92} />
            <span className="hand" style={{ position: "absolute", top: -14, left: 60, fontSize: 13, background: "#fff", border: "2px solid #111", padding: "0 6px", whiteSpace: "nowrap" }}>
              {TAUNTS[(caught + stolen) % TAUNTS.length]}
            </span>
          </button>
        )}
        {poofs.map((p) => <span key={p.id} className="poof" style={{ left: p.x, top: p.y }}>{p.t}</span>)}
        {phase === "intro" && (
          <div className="overlay">
            <div>
              <div className="wobble" style={{ display: "inline-block" }}><Raccoon size={120} /></div>
              <h3>A wild AI Overview appeared</h3>
              <p style={{ maxWidth: 460, margin: "0 auto 16px" }}>It sits on top of your rankings, summarises your content and keeps the click. Catch it {GAME_SECONDS} seconds straight. This is my day job.</p>
              <button className="btn pink" onClick={start}>START HUNT</button>
            </div>
          </div>
        )}
        {phase === "over" && (
          <div className="overlay">
            <div>
              <div style={{ display: "inline-block" }}><Raccoon size={100} mood="caught" /></div>
              <h3>{caught} recovered · {stolen} stolen</h3>
              <p style={{ maxWidth: 520, margin: "0 auto 8px", fontWeight: 700 }}>{rank}</p>
              <p style={{ maxWidth: 560, margin: "0 auto 16px", fontSize: 14 }}>
                For the record: at AND Academy I built a GEO program from scratch that now drives about <b>a fifth of organic conversions</b>, tracked with a share-of-answers dashboard across ChatGPT, Perplexity, Gemini and AI Overviews. You can&apos;t beat the raccoon. You can make it cite you.
              </p>
              <button className="btn" onClick={start}>AGAIN!!!</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
