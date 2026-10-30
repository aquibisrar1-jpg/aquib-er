"use client";
import { useEffect, useRef, useState } from "react";
import { beep } from "./sound";

const LOADING = [
  "C:\\> CONNECTING AT 56K...",
  "C:\\> asking Googlebot nicely for the homepage",
  "C:\\> checking pulse (HTTP status)",
  "C:\\> counting redirect hops. please hold",
  "C:\\> reading the <head>. it is a mess in there",
  "C:\\> parsing JSON-LD. or attempting to",
  "C:\\> knocking on /robots.txt",
  "C:\\> are GPTBot, ClaudeBot, PerplexityBot allowed in?",
  "C:\\> looking for /llms.txt (bold of me)",
  "C:\\> checking if the raccoon got in",
  "C:\\> writing prescription",
];
const QUICK = ["wikipedia.org", "vercel.com", "notion.so", "your-competitor.com"];

export default function ER() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState("idle");
  const [lines, setLines] = useState([]);
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const timer = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);

  async function run(target) {
    const u = (target ?? url).trim();
    if (!u) { setErr("The ER needs a patient. Type a domain."); setState("error"); beep("error"); return; }
    if (u === "your-competitor.com") { setErr("Ha. Type their real domain. I'm not judging. (I'm judging a little.)"); setState("error"); beep("error"); return; }
    setUrl(u); setState("loading"); setErr(""); setData(null); setLines([LOADING[0]]);
    beep("dialup");
    let i = 1;
    clearInterval(timer.current);
    timer.current = setInterval(() => { if (i < LOADING.length) { setLines((l) => [...l, LOADING[i++]]); beep("tick"); } }, 480);
    const minWait = new Promise((r) => setTimeout(r, 3400));
    try {
      const [res] = await Promise.all([fetch(`/api/checkup?url=${encodeURIComponent(u)}`), minWait]);
      const json = await res.json();
      clearInterval(timer.current);
      if (!res.ok) throw new Error(json.error || "Unknown condition.");
      setData(json); setState("done");
      beep(json.score >= 65 ? "win" : "doom");
    } catch (e) {
      clearInterval(timer.current);
      setErr(e.message); setState("error"); beep("error");
    }
  }

  const color = (s) => (s >= 85 ? "#39ff14" : s >= 65 ? "#ff0" : "#ff3030");

  return (
    <div className="win98">
      <div className="tbar">
        <span>✚ definitely_a_real_doctor.exe</span>
        <span className="tb-btns"><span>_</span><span>□</span><span>?</span></span>
      </div>
      <div className="menubar"><span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>P</u>atient</span><span><u>H</u>elp (no)</span></div>
      <div className="wbody">
        <form className="er-form" onSubmit={(e) => { e.preventDefault(); run(); }}>
          <input aria-label="Your website domain" placeholder="yourcompany.com" value={url} onChange={(e) => setUrl(e.target.value)} autoComplete="off" spellCheck="false" />
          <button className="gbtn small" type="submit" disabled={state === "loading"}>{state === "loading" ? "OPERATING…" : "ADMIT PATIENT 🚑"}</button>
        </form>
        <div className="er-quick">
          No domain handy? Try:{QUICK.map((q) => <button key={q} type="button" onClick={() => run(q)}>{q}</button>)}
        </div>

        {state === "idle" && (
          <div className="patient">
            <div className="em">🛏️</div>
            <h3>Patient: your website.</h3>
            <div className="vitals"><span>Pulse: unknown.</span><span>Prognosis: let&apos;s find out.</span></div>
          </div>
        )}

        {state === "loading" && (
          <div className="monitor" aria-live="polite">
            <svg className="ekg" viewBox="0 0 600 50" preserveAspectRatio="none"><path d="M0 25 H120 L135 8 L150 42 L165 25 H260 L275 4 L290 46 L305 25 H420 L435 10 L450 40 L465 25 H600" /></svg>
            {lines.map((l, i) => <div key={i}>{l}</div>)}
            <span className="blink">█</span>
          </div>
        )}

        {state === "error" && <div className="er-err" role="alert">⚠️ {err}</div>}

        {state === "done" && data && (
          <div>
            <div className="patient">
              <div className="em">{data.score >= 85 ? "😎" : data.score >= 65 ? "🤒" : data.score >= 45 ? "🤕" : "💀"}</div>
              <h3>Patient: {data.host}</h3>
              <div className="vitals">
                <span>Pulse: <b>{data.status}</b></span><span>Response: <b>{data.ms}ms</b></span><span>Redirect hops: <b>{data.hops}</b></span>
              </div>
              <div className="bigscore" style={{ color: color(data.score) }}>{data.score}/100</div>
              <svg className={`ekg ${data.status !== 200 ? "flat" : ""}`} viewBox="0 0 600 50" preserveAspectRatio="none" style={{ background: "#000", marginTop: 6 }}>
                <path d={data.status === 200 ? "M0 25 H120 L135 8 L150 42 L165 25 H260 L275 4 L290 46 L305 25 H420 L435 10 L450 40 L465 25 H600" : "M0 25 H600"} />
              </svg>
            </div>
            <div className="dx">🩺 DIAGNOSIS: {data.verdict}<br /><span style={{ fontWeight: "normal", fontSize: 13 }}>{data.fails} critical finding{data.fails === 1 ? "" : "s"}. {data.checks.length} checks, run live just now on the real site.</span></div>

            <div className="results inset">
              <table>
                <thead><tr><th>Check</th><th>Result</th><th>Doctor&apos;s note</th></tr></thead>
                <tbody>
                  {data.checks.map((c) => (
                    <tr key={c.id}>
                      <td><b>{c.label}</b></td>
                      <td><span className={`st ${c.status}`}>{c.status === "pass" ? "OK" : c.status === "warn" ? "HMM" : "YIKES"}</span><br /><small>{c.value}</small></td>
                      <td>{c.joke}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ font: "bold 15px 'Comic Sans MS', 'Comic Neue'", margin: "16px 0 6px" }}>🚪 Who&apos;s allowed in the building? (robots.txt vs AI crawlers)</p>
              <table>
                <thead><tr><th>Crawler</th><th>Who</th><th>Door</th></tr></thead>
                <tbody>
                  {data.ai.map((b) => (
                    <tr key={b.ua}>
                      <td>{b.ua}</td><td>{b.owner}</td>
                      <td><span className={`st ${b.state === "blocked" ? "fail" : "pass"}`}>{b.state === "blocked" ? "🚫 BLOCKED" : "✅ OPEN"}</span> <small>{b.via}</small></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
              <small style={{ font: "12px Arial", maxWidth: 360 }}>Homepage only, from outside, in about 3 seconds. The real treatment covers render parity, cannibalization, index bloat, entities and AI citation share.</small>
              <a className="gbtn pink small" href={`mailto:aquibisrar1@gmail.com?subject=${encodeURIComponent(`My site is in the ER: ${data.host} (${data.score}/100)`)}&body=${encodeURIComponent(`Hi Aquib,\n\nYour ER gave ${data.host} a ${data.score}/100. Let's talk.\n\n`)}`}>BOOK DR. AQUIB →</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
