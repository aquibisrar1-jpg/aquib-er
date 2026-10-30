"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Raccoon } from "./Mascots";
import { beep, setSound } from "./sound";

export function toast(msg) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("aq-toast", { detail: msg }));
}
export function openWin(id) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("aq-win", { detail: id }));
}

const PAGES = [
  { p: "/about", ok: true },
  { p: "/thank-you", ok: false },
  { p: "/blog/what-is-ux", ok: true },
  { p: "/cart?sid=8f3a91", ok: false },
  { p: "/courses/ux-design", ok: true },
  { p: "/tag/tag/tag/page/47", ok: false },
  { p: "/staging-v2-FINAL", ok: false },
  { p: "/contact", ok: true },
  { p: "/?utm_source=lol", ok: false },
];

function Win({ id, title, x, y, w = 320, onClose, children, z, onFocus }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x, y });
  const drag = useRef(null);

  useEffect(() => {
    // keep inside viewport on mount
    const vw = window.innerWidth, vh = window.innerHeight;
    setPos((p) => ({ x: Math.max(8, Math.min(p.x, vw - w - 16)), y: Math.max(70, Math.min(p.y, vh - 260)) }));
  }, [w]);

  const down = (e) => {
    onFocus?.();
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e) => {
    if (!drag.current) return;
    setPos({ x: e.clientX - drag.current.dx, y: Math.max(0, e.clientY - drag.current.dy) });
  };
  const up = () => (drag.current = null);

  return (
    <div className="win" ref={ref} style={{ left: pos.x, top: pos.y, width: w, zIndex: 60 + z }} onPointerDown={onFocus} role="dialog" aria-label={title}>
      <div className="bar" onPointerDown={down} onPointerMove={move} onPointerUp={up}>
        <span>{title}</span>
        <button className="x" onClick={(e) => { e.stopPropagation(); beep("click"); onClose(id); }} aria-label="Close">✕</button>
      </div>
      <div className="content">{children}</div>
    </div>
  );
}

export default function Popups() {
  const [open, setOpen] = useState([]); // array of ids, last = top
  const [toastMsg, setToastMsg] = useState("");
  const [sound, setSoundState] = useState(false);
  const [chat, setChat] = useState(false);
  const [chatStep, setChatStep] = useState(0);
  const [sel, setSel] = useState([]);
  const shown = useRef(new Set());

  const show = useCallback((id) => {
    setOpen((o) => (o.includes(id) ? [...o.filter((x) => x !== id), id] : [...o, id]));
    shown.current.add(id);
    beep("error");
  }, []);
  const once = useCallback((id) => { if (!shown.current.has(id)) show(id); }, [show]);
  const close = useCallback((id) => setOpen((o) => o.filter((x) => x !== id)), []);
  const focus = (id) => setOpen((o) => [...o.filter((x) => x !== id), id]);

  useEffect(() => {
    const t = (e) => { setToastMsg(e.detail); };
    const w = (e) => show(e.detail);
    window.addEventListener("aq-toast", t);
    window.addEventListener("aq-win", w);
    return () => { window.removeEventListener("aq-toast", t); window.removeEventListener("aq-win", w); };
  }, [show]);

  useEffect(() => {
    if (!toastMsg) return;
    const id = setTimeout(() => setToastMsg(""), 3200);
    return () => clearTimeout(id);
  }, [toastMsg]);

  // timed + scroll-triggered chaos
  useEffect(() => {
    const timers = [
      setTimeout(() => once("robots"), 7000),
      setTimeout(() => setChat(true), 14000),
    ];
    const triggers = { proof: "captcha", builds: "ad", faq: "calendar", incident: "uac" };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && triggers[en.target.id]) {
          const w = triggers[en.target.id];
          setTimeout(() => once(w), 900);
        }
      });
    }, { threshold: 0.35 });
    Object.keys(triggers).forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });

    let idle;
    const resetIdle = () => { clearTimeout(idle); idle = setTimeout(() => once("page4"), 45000); };
    ["scroll", "pointermove", "keydown"].forEach((ev) => window.addEventListener(ev, resetIdle, { passive: true }));
    resetIdle();
    return () => {
      timers.forEach(clearTimeout); io.disconnect(); clearTimeout(idle);
      ["scroll", "pointermove", "keydown"].forEach((ev) => window.removeEventListener(ev, resetIdle));
    };
  }, [once]);

  const verifyCaptcha = () => {
    const correct = PAGES.every((p, i) => p.ok === sel.includes(i));
    if (correct) {
      beep("win");
      toast("✅ Verified: you are not a 404. You'd make a decent SEO, honestly.");
      close("captcha");
    } else {
      beep("error");
      const bad = PAGES.filter((p, i) => sel.includes(i) && !p.ok).map((p) => p.p);
      toast(bad.length ? `❌ You indexed ${bad[0]}. Index bloat detected. This is how core updates happen.` : "❌ You noindexed real pages. Traffic has left the chat.");
    }
  };

  const goContact = () => document.getElementById("hire")?.scrollIntoView({ behavior: "smooth" });

  const W = {
    robots: (
      <Win key="robots" id="robots" title="robots_for_humans.txt" x={typeof window !== "undefined" ? window.innerWidth - 380 : 900} y={120} onClose={close} z={open.indexOf("robots")} onFocus={() => focus("robots")}>
        <pre style={{ margin: "0 0 10px", background: "#fff", padding: 10, border: "2px inset #fff", fontSize: 12, whiteSpace: "pre-wrap" }}>
{`User-agent: Hiring-Manager
Allow: /hire-aquib
Allow: /the-er (try it, it's real)
Disallow: /12-month-agency-retainers
Disallow: /vanity-metrics
Crawl-delay: 0  # he replies fast
Sitemap: linkedin.com/in/aquibisrar`}
        </pre>
        <div className="actions">
          <button className="w95btn" onClick={() => { toast("Respecting robots.txt. Good bot. 🤖"); close("robots"); }}>Obey</button>
          <button className="w95btn" onClick={() => { toast("Ignoring robots.txt? That's what Bytespider would do."); close("robots"); }}>Ignore</button>
        </div>
      </Win>
    ),
    captcha: (
      <Win key="captcha" id="captcha" title="noindexCAPTCHA™" x={60} y={110} w={340} onClose={close} z={open.indexOf("captcha")} onFocus={() => focus("captcha")}>
        <p style={{ background: "var(--blue)", color: "#fff", padding: 8, margin: 0 }}>
          Select all pages that <b>should be indexed</b>.<br />
          <small>If there are none, you are AND Academy in Dec 2025. (I fixed it.)</small>
        </p>
        <div className="capgrid">
          {PAGES.map((p, i) => (
            <button key={p.p} className={sel.includes(i) ? "sel" : ""} onClick={() => { beep("click"); setSel((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i])); }}>
              {p.p}
            </button>
          ))}
        </div>
        <div className="actions">
          <button className="w95btn" onClick={() => setSel([])}>↻</button>
          <button className="w95btn" onClick={verifyCaptcha}>VERIFY</button>
        </div>
      </Win>
    ),
    ad: (
      <Win key="ad" id="ad" title="⚠ ADVERTISEMENT ⚠" x={typeof window !== "undefined" ? window.innerWidth - 360 : 900} y={160} w={300} onClose={close} z={open.indexOf("ad")} onFocus={() => focus("ad")}>
        <div className="ad">
          <b className="blink">HOT BACKLINKS IN YOUR AREA!!</b>
          10,000 DA-90 links for ₹499.<br />Guaranteed page 1. Trust me bro.
        </div>
        <p style={{ marginTop: 10, fontSize: 12 }}>Aquib&apos;s note: please don&apos;t. I earn links with tools people actually use (font pairing, colour contrast, palette builders) and a Reddit ambassador programme.</p>
        <div className="actions">
          <button className="w95btn" onClick={() => { beep("doom"); toast("💀 Manual action received. Just kidding. But that's how it happens."); close("ad"); }}>BUY NOW</button>
          <button className="w95btn" onClick={() => close("ad")}>Report spam</button>
        </div>
      </Win>
    ),
    calendar: (
      <Win key="calendar" id="calendar" title="📅 Invitation: crawl_budget_alignment" x={80} y={140} w={330} onClose={close} z={open.indexOf("calendar")} onFocus={() => focus("calendar")}>
        <p><b>30-min crawl budget alignment ☕</b><br />Organiser: Aquib Israr<br />When: whenever you&apos;re free (he&apos;s flexible)<br />Where: Google Meet / chai</p>
        <p style={{ fontSize: 12 }}>Agenda: 1) your site&apos;s ER score 2) why the raccoon is winning 3) when I can start</p>
        <div className="actions">
          <a className="w95btn" href="mailto:aquibisrar1@gmail.com?subject=Accepted%3A%2030-min%20crawl%20budget%20alignment" onClick={() => close("calendar")}>Accept</a>
          <button className="w95btn" onClick={() => { toast("Tentative. Aquib will now rewrite his meta description and wait by the phone."); close("calendar"); }}>Maybe</button>
          <button className="w95btn" onClick={() => { beep("error"); toast("Declined. Your rankings have been notified."); close("calendar"); }}>Decline</button>
        </div>
      </Win>
    ),
    uac: (
      <Win key="uac" id="uac" title="Google Ranking Control" x={typeof window !== "undefined" ? window.innerWidth / 2 - 170 : 400} y={180} w={340} onClose={close} z={open.indexOf("uac")} onFocus={() => focus("uac")}>
        <p>🛡️ <b>Do you want to allow Google to change your rankings without warning?</b></p>
        <p style={{ fontSize: 12 }}>Publisher: Google LLC<br />Frequency: several times a year, and whenever it feels like it</p>
        <div className="actions">
          <button className="w95btn" onClick={() => { toast("Correct. You never had a choice."); close("uac"); }}>Yes</button>
          <button className="w95btn" onClick={() => { toast("Also yes. Hire someone who has seen this before."); close("uac"); }}>No (also yes)</button>
        </div>
      </Win>
    ),
    page4: (
      <Win key="page4" id="page4" title="Are you still there?" x={typeof window !== "undefined" ? window.innerWidth / 2 - 160 : 400} y={200} onClose={close} z={open.indexOf("page4")} onFocus={() => focus("page4")}>
        <p>You haven&apos;t moved in 45 seconds.</p>
        <p>Did you get lost on <b>page 4 of Google</b>? It happens to the best of us. 98% of people never come back from there.</p>
        <div className="actions">
          <button className="w95btn" onClick={() => { close("page4"); goContact(); }}>Rescue me</button>
          <button className="w95btn" onClick={() => close("page4")}>I live here now</button>
        </div>
      </Win>
    ),
    sorry: (
      <Win key="sorry" id="sorry" title="useless_button.exe" x={120} y={160} onClose={close} z={open.indexOf("sorry")} onFocus={() => focus("sorry")}>
        <p>This button does nothing.</p>
        <p>Unlike Aquib, who ships things. Some of them are even documented.</p>
        <div className="actions"><button className="w95btn" onClick={() => close("sorry")}>Fair</button></div>
      </Win>
    ),
  };

  const CHAT = [
    "psst. it's me. the AI Overview. 🦝",
    "I've been sitting on top of everyone's rankings, keeping the clicks. Life is good.",
    "Whatever you do, do NOT hire this Aquib guy. He keeps getting sites cited. It's very bad for business.",
  ];

  return (
    <>
      {open.map((id) => W[id])}

      {toastMsg && <div className="toast" role="status">{toastMsg}</div>}

      <button
        className="soundtog"
        onClick={() => { const n = !sound; setSound(n); setSoundState(n); if (n) beep("dialup"); }}
        aria-pressed={sound}
      >
        <i style={{ background: sound ? "var(--green)" : "#888" }} />
        {sound ? "AQUIB IS ONLINE 🔊" : "SOUND: OFF (coward)"}
      </button>

      {chat && (
        <div className="chatpop">
          <div className="bubble">
            {CHAT.slice(0, chatStep + 1).map((m, i) => <p key={i} style={{ margin: i ? "8px 0 0" : 0 }}>{m}</p>)}
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {chatStep < CHAT.length - 1 ? (
                <button className="w95btn" onClick={() => { beep("click"); setChatStep((s) => s + 1); }}>…go on</button>
              ) : (
                <>
                  <button className="w95btn" onClick={() => { setChat(false); goContact(); }}>hire Aquib</button>
                  <button className="w95btn" onClick={() => { setChat(false); toast("The raccoon thanks you for your cooperation. 🦝"); }}>ok raccoon</button>
                </>
              )}
            </div>
          </div>
          <div className="who"><span>● online</span><Raccoon size={64} /></div>
        </div>
      )}
    </>
  );
}
