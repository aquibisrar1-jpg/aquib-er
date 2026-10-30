"use client";
import { useRef, useState } from "react";
import { beep } from "./sound";
import { confetti } from "./fx";
import { toast } from "./Popups";

const NO_LABELS = ["No", "No?", "Nope", "N-no", "no (are you sure)", "no (301 → yes)", "NO (noindex)"];
const MAX = NO_LABELS.length;

export default function HireDialog() {
  const [pos, setPos] = useState(null);
  const [tries, setTries] = useState(0);
  const [yes, setYes] = useState(false);
  const area = useRef(null);

  const flee = () => {
    if (tries >= MAX) return;
    const b = area.current?.getBoundingClientRect();
    const w = b?.width || 360, h = b?.height || 160;
    setPos({ x: 10 + Math.random() * Math.max(10, w - 150), y: 10 + Math.random() * Math.max(10, h - 50) });
    const t = tries + 1;
    setTries(t);
    beep(t >= MAX ? "doom" : "miss");
    if (t === MAX) setTimeout(() => toast("The NO button has been noindexed. It no longer exists in search results, or here."), 500);
  };

  return (
    <div className="win98 hire98">
      <div className="tbar"><span>❓ hire_decision.exe</span><span className="tb-btns"><span>?</span></span></div>
      <div className="wbody">
        {!yes ? (
          <>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 40 }}>🤔</span>
              <p style={{ font: "bold 20px 'Comic Sans MS', 'Comic Neue', cursive", margin: 0 }}>Should we hire Aquib?</p>
            </div>
            <div className="hire-area" ref={area}>
              <button className="gbtn small hire-yes" onClick={() => { setYes(true); beep("win"); confetti(); }}>YES!!!</button>
              {tries < MAX && (
                <button
                  className="w98 hire-no"
                  style={pos ? { left: pos.x, top: pos.y, right: "auto" } : undefined}
                  onPointerEnter={(e) => e.pointerType === "mouse" && flee()}
                  onClick={(e) => { e.preventDefault(); flee(); }}
                >
                  {NO_LABELS[tries]}
                </button>
              )}
              {tries >= MAX && <span className="hire-gone">404: option not found</span>}
            </div>
            {tries > 0 && tries < MAX && <small style={{ font: "11px Arial" }}>The NO button has escaped {tries} time{tries === 1 ? "" : "s"}.</small>}
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 46 }}>🎉🦝🔒</div>
            <p style={{ font: "bold 20px 'Comic Sans MS', 'Comic Neue', cursive", margin: "6px 0" }}>Excellent decision. Very white-hat of you.</p>
            <p style={{ font: "14px 'Times New Roman'", marginBottom: 10 }}>Next step: one email. He replies faster than Googlebot recrawls.</p>
            <a className="gbtn" href={`mailto:aquibisrar1@gmail.com?subject=${encodeURIComponent("We clicked YES. Let's talk.")}`}>✉️ SEND THE YES</a>
          </div>
        )}
      </div>
    </div>
  );
}
