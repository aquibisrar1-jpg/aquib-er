"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { beep, setSound, soundOn, onSoundChange } from "./sound";

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

function Win({ id, title, x, y, w = 320, onClose, children, z, onFocus, cls = "" }) {
  const [pos, setPos] = useState({ x, y });
  const drag = useRef(null);
  useEffect(() => {
    const vw = window.innerWidth, vh = window.innerHeight;
    setPos((p) => ({ x: Math.max(8, Math.min(p.x, vw - w - 16)), y: Math.max(10, Math.min(p.y, vh - 330)) }));
  }, [w]);
  const down = (e) => { onFocus?.(); drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y }; e.currentTarget.setPointerCapture(e.pointerId); };
  const move = (e) => { if (drag.current) setPos({ x: e.clientX - drag.current.dx, y: Math.max(0, e.clientY - drag.current.dy) }); };
  return (
    <div className={`win98 pop ${cls}`} style={{ left: pos.x, top: pos.y, width: w, zIndex: 60 + z }} onPointerDown={onFocus} role="dialog" aria-label={title}>
      <div className="tbar" onPointerDown={down} onPointerMove={move} onPointerUp={() => (drag.current = null)}>
        <span>{title}</span>
        <button className="xx" onClick={(e) => { e.stopPropagation(); beep("close"); onClose(id); }} aria-label="Close">✕</button>
      </div>
      <div className="wbody">{children}</div>
    </div>
  );
}

export default function Popups() {
  const [open, setOpen] = useState([]);
  const [toastMsg, setToastMsg] = useState("");
  const [sound, setSoundState] = useState(true);
  const [helper, setHelper] = useState(0); // 0 hidden, 1..n lines
  const [helperGone, setHelperGone] = useState(false);
  const [serpflix, setSerpflix] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [clock, setClock] = useState("");
  const [sel, setSel] = useState([]);
  const shown = useRef(new Set());

  const show = useCallback((id) => {
    setOpen((o) => [...o.filter((x) => x !== id), id].slice(-2)); // max 2 at once, like a polite 1999 website
    shown.current.add(id);
    beep("error");
  }, []);
  const once = useCallback((id) => { if (!shown.current.has(id)) show(id); }, [show]);
  const close = useCallback((id) => setOpen((o) => o.filter((x) => x !== id)), []);
  const focus = (id) => setOpen((o) => [...o.filter((x) => x !== id), id]);

  useEffect(() => onSoundChange(setSoundState), []);
  useEffect(() => { setSoundState(soundOn()); }, []);

  // global click blip on every link/button (the authentic 1999 experience)
  useEffect(() => {
    const h = (e) => { if (e.target.closest("a,button,summary,.fakecheck")) beep("click"); };
    document.addEventListener("pointerdown", h);
    return () => document.removeEventListener("pointerdown", h);
  }, []);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const t = (e) => setToastMsg(e.detail);
    const w = (e) => show(e.detail);
    window.addEventListener("aq-toast", t);
    window.addEventListener("aq-win", w);
    return () => { window.removeEventListener("aq-toast", t); window.removeEventListener("aq-win", w); };
  }, [show]);
  useEffect(() => { if (!toastMsg) return; beep("open"); const id = setTimeout(() => setToastMsg(""), 3400); return () => clearTimeout(id); }, [toastMsg]);

  useEffect(() => {
    const timers = [setTimeout(() => once("robots"), 8000), setTimeout(() => setHelper(1), 4000)];
    const triggers = { features: "ad", click: "msg", proof: "captcha", faq: "calendar", builds: "uac" };
    const io = new IntersectionObserver((es) => es.forEach((en) => {
      if (en.isIntersecting && triggers[en.target.id]) setTimeout(() => once(triggers[en.target.id]), 700);
    }), { threshold: 0.3 });
    Object.keys(triggers).forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    let idle;
    const reset = () => { clearTimeout(idle); idle = setTimeout(() => { if (!shown.current.has("serpflix")) { shown.current.add("serpflix"); setSerpflix(true); beep("doom"); } }, 40000); };
    ["scroll", "pointermove", "keydown"].forEach((ev) => window.addEventListener(ev, reset, { passive: true }));
    reset();
    return () => { timers.forEach(clearTimeout); io.disconnect(); clearTimeout(idle); ["scroll", "pointermove", "keydown"].forEach((ev) => window.removeEventListener(ev, reset)); };
  }, [once]);

  const verify = () => {
    if (PAGES.every((p, i) => p.ok === sel.includes(i))) { beep("win"); toast("✅ Verified: you are not a 404. You'd make a decent SEO, honestly."); close("captcha"); }
    else {
      beep("error");
      const bad = PAGES.filter((p, i) => sel.includes(i) && !p.ok).map((p) => p.p);
      toast(bad.length ? `❌ You indexed ${bad[0]}. Index bloat detected. This is how core updates happen.` : "❌ You noindexed real pages. Your traffic has left the chat.");
    }
  };
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const zi = (id) => open.indexOf(id);

  const W = {
    robots: (
      <Win key="robots" id="robots" title="robots_for_humans.txt - Notepad" x={vw - 380} y={110} onClose={close} z={zi("robots")} onFocus={() => focus("robots")}>
        <div className="inset" style={{ font: "12px 'Courier New'", whiteSpace: "pre-wrap" }}>{`User-agent: Hiring-Manager
Allow: /hire-aquib
Allow: /the-er   # try it, it's real
Disallow: /12-month-agency-retainers
Disallow: /vanity-metrics
Crawl-delay: 0   # he replies fast
Sitemap: linkedin.com/in/aquibisrar`}</div>
        <div className="actions">
          <button className="w98" onClick={() => { toast("Respecting robots.txt. Good bot. 🤖"); close("robots"); }}>Obey</button>
          <button className="w98" onClick={() => { toast("Ignoring robots.txt? That's what Bytespider would do."); close("robots"); }}>Ignore</button>
        </div>
      </Win>
    ),
    msg: (
      <Win key="msg" id="msg" title="Message from Aquib" x={vw / 2 - 150} y={180} w={300} onClose={close} z={zi("msg")} onFocus={() => focus("msg")}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 36 }}>ℹ️</span>
          <p style={{ font: "15px 'Times New Roman'", margin: 0 }}>Hello dear hiring manager!!<br />I have optimised this website for <b>maximum ranking</b>.<br />Regards, Aquib 👍</p>
        </div>
        <div className="actions" style={{ justifyContent: "center" }}><button className="w98" onClick={() => close("msg")}>OK (it is not ranking)</button></div>
      </Win>
    ),
    ad: (
      <Win key="ad" id="ad" title="ADVERTISEMENT (unfortunately)" x={vw - 360} y={150} w={300} onClose={close} z={zi("ad")} onFocus={() => focus("ad")}>
        <div className="adbox">
          <div className="redbar">SPONSORED · NOT BY GOOGLE</div>
          <div style={{ fontSize: 34 }}>🔗🔗🔗</div>
          <h4>Hot backlinks<br />in your area!!</h4>
          <p style={{ font: "13px Arial", margin: "6px 0 0" }}>10,000 DA-90 links for ₹499. Page 1 guaranteed. Trust me bro.</p>
          <a className="cta" href="#faq" onClick={(e) => { e.preventDefault(); beep("doom"); toast("💀 Manual action received. Kidding. But that's how it happens."); close("ad"); }}>Buy links now →</a>
          <small style={{ font: "11px Arial" }}>This ad was rejected by Aquib, who earns links with real tools.</small>
        </div>
      </Win>
    ),
    captcha: (
      <Win key="captcha" id="captcha" title="noindexCAPTCHA™" x={40} y={110} w={330} onClose={close} z={zi("captcha")} onFocus={() => focus("captcha")}>
        <div style={{ background: "#1a5bff", color: "#fff", padding: 8, font: "13px Arial" }}>Select all pages that <b>should be indexed</b>.<br /><small>If there are none, click verify and pray.</small></div>
        <div className="capgrid">
          {PAGES.map((p, i) => <button key={p.p} className={sel.includes(i) ? "sel" : ""} onClick={() => setSel((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]))}>{p.p}</button>)}
        </div>
        <div className="actions"><button className="w98" onClick={() => setSel([])}>↻</button><button className="w98" onClick={verify}>VERIFY</button></div>
      </Win>
    ),
    calendar: (
      <Win key="calendar" id="calendar" title="📅 Meeting Request - Outlook Express" x={60} y={140} w={330} onClose={close} z={zi("calendar")} onFocus={() => focus("calendar")}>
        <div className="inset" style={{ font: "13px Arial" }}>
          <b>Subject:</b> 30-min crawl budget alignment ☕<br /><b>From:</b> Aquib Israr<br /><b>When:</b> whenever you&apos;re free<br /><b>Where:</b> Google Meet / chai<br /><br />
          Agenda: (1) your ER score (2) why the raccoon is winning (3) when I can start
        </div>
        <div className="actions">
          <a className="w98" href="mailto:aquibisrar1@gmail.com?subject=Accepted%3A%2030-min%20crawl%20budget%20alignment" onClick={() => close("calendar")}>Accept</a>
          <button className="w98" onClick={() => { toast("Tentative. Aquib will now rewrite his meta description and wait by the phone."); close("calendar"); }}>Tentative</button>
          <button className="w98" onClick={() => { beep("error"); toast("Declined. Your rankings have been notified."); close("calendar"); }}>Decline</button>
        </div>
      </Win>
    ),
    uac: (
      <Win key="uac" id="uac" title="Ranking Control" x={vw / 2 - 170} y={170} w={340} onClose={close} z={zi("uac")} onFocus={() => focus("uac")}>
        <div style={{ display: "flex", gap: 10 }}>
          <span style={{ fontSize: 36 }}>🛡️</span>
          <div style={{ font: "13px Arial" }}><b>Do you want to allow Google to change your rankings without warning?</b><br /><br />Publisher: Google LLC<br />Frequency: several times a year, and whenever it feels like it</div>
        </div>
        <div className="actions">
          <button className="w98" onClick={() => { toast("Correct. You never had a choice."); close("uac"); }}>Yes</button>
          <button className="w98" onClick={() => { toast("Also yes. Hire someone who has seen this before."); close("uac"); }}>No (also yes)</button>
        </div>
      </Win>
    ),
    sorry: (
      <Win key="sorry" id="sorry" title="Error" x={vw / 2 - 150} y={200} w={300} onClose={close} z={zi("sorry")} onFocus={() => focus("sorry")}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 34 }}>❌</span>
          <p style={{ font: "13px Arial", margin: 0 }}>This button does nothing.<br />Unlike Aquib, who ships things.</p>
        </div>
        <div className="actions" style={{ justifyContent: "center" }}><button className="w98" onClick={() => close("sorry")}>Fair</button></div>
      </Win>
    ),
  };

  const HELP = [
    "Hi! I'm Crawly, your Googlebot assistant. It looks like you're trying to hire an SEO person.",
    "Would you like help? Option A: hire Aquib. Option B: also hire Aquib.",
    "I crawled this whole page. Every link works. That is rarer than you think.",
  ];

  return (
    <>
      {open.map((id) => W[id])}

      {toastMsg && (
        <div className="win98 toast98" role="status">
          <div className="tbar"><span>System message</span><button className="xx" onClick={() => setToastMsg("")}>✕</button></div>
          <div className="wbody"><span style={{ fontSize: 26 }}>💬</span><span>{toastMsg}</span></div>
        </div>
      )}

      {!helperGone && helper > 0 && (
        <div className="helper">
          <div className="bubble">
            {HELP[helper - 1]}
            <div className="row">
              {helper < HELP.length && <button className="w98" onClick={() => setHelper((h) => h + 1)}>Tell me more</button>}
              <button className="w98" onClick={() => { setHelperGone(true); go("hire"); }}>Hire Aquib</button>
              <button className="w98" onClick={() => setHelperGone(true)}>Go away</button>
            </div>
          </div>
          <button className="spider" onClick={() => setHelper((h) => (h % HELP.length) + 1)} aria-label="Crawly the Googlebot assistant">🕷️</button>
        </div>
      )}

      {serpflix && (
        <div className="serpflix" role="dialog" aria-label="Are you still on page 4?">
          <div className="logo-sf">SERPFLIX</div>
          <button className="x" onClick={() => setSerpflix(false)} aria-label="Close">✕</button>
          <div>
            <h2>Are you still on page 4?</h2>
            <p>Your website has been on page 4 of Google<br />for <b style={{ color: "#fff" }}>11 MONTHS</b></p>
            <button className="b1" onClick={() => { setSerpflix(false); toast("Continuing to month 12. Bold."); }}>▶ Continue to Month 12</button>
            <button className="b2" onClick={() => { setSerpflix(false); go("hire"); }}>Try page 1 with Aquib ↗</button>
          </div>
          <div className="bar"><i /></div>
        </div>
      )}

      {startOpen && (
        <div className="startmenu">
          <div className="side"><b>Aquib</b>98</div>
          <ul>
            {[["🚑", "The ER", "er"], ["⛈️", "Core Update Incident", "click"], ["🦝", "Catch the raccoon", "raccoon"], ["📊", "Proof", "proof"], ["🛠️", "Downloads", "builds"], ["❓", "FAQ", "faq"], ["✉️", "Hire Aquib", "hire"]].map(([i, t, id]) => (
              <li key={id}><a href={`#${id}`} onClick={() => setStartOpen(false)}>{i} {t}</a></li>
            ))}
            <li><a href="/Aquib_Israr_CV.pdf" download onClick={() => setStartOpen(false)}>📄 CV.pdf</a></li>
            <li><a href="#top" onClick={(e) => { e.preventDefault(); setStartOpen(false); window.dispatchEvent(new CustomEvent("aq-vision", { detail: "googlebot" })); }}>👁️ Googlebot Vision</a></li>
            <li><a href="#top" onClick={(e) => { e.preventDefault(); setStartOpen(false); window.dispatchEvent(new CustomEvent("aq-vision", { detail: "chatgpt" })); }}>✦ ChatGPT Vision</a></li>
            <li><a href="#indexing" onClick={() => setStartOpen(false)}>🔍 Index my CV</a></li>
            <li><a href="#top" onClick={(e) => { e.preventDefault(); setStartOpen(false); window.dispatchEvent(new Event("aq-quick")); }}>⏱️ 30-second version</a></li>
            <li><a href="#top" onClick={(e) => { e.preventDefault(); setStartOpen(false); window.dispatchEvent(new Event("aq-blackhat")); }}>😈 Black Hat Mode</a></li>
          </ul>
        </div>
      )}

      <div className="taskbar">
        <button className={`start ${startOpen ? "on" : ""}`} onClick={() => setStartOpen((s) => !s)}>✳️ start</button>
        <span className="task">📄 aquib_seo_er.html</span>
        {open.slice(-1).map((id) => <span key={id} className="task">🗔 {id}.exe</span>)}
        <span className="tray">
          <button className={`snd ${sound ? "" : "off"}`} onClick={() => setSound(!sound)} aria-pressed={sound}>{sound ? "♪ SOUND ON" : "♪ SOUND OFF"}</button>
          <span style={{ font: "12px 'Times New Roman'" }}>{clock}</span>
          <span className="online">AQUIB IS ONLINE</span>
        </span>
      </div>
    </>
  );
}
