"use client";
import { useEffect, useRef, useState } from "react";
import { beep } from "./sound";
import { Raccoon } from "./Mascots";

const LOADING = [
  "> admitting patient…",
  "> asking Googlebot nicely for the homepage…",
  "> checking pulse (HTTP status)…",
  "> counting redirect hops. please hold.",
  "> reading the <head>. it's a mess in there.",
  "> parsing JSON-LD. or attempting to.",
  "> knocking on /robots.txt…",
  "> checking if GPTBot, ClaudeBot & Perplexity are allowed in the building…",
  "> looking for /llms.txt (bold of me)…",
  "> checking if the raccoon got in…",
  "> writing prescription…",
];

const QUICK = ["wikipedia.org", "vercel.com", "notion.so", "your-competitor.com"];

export default function ER() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState("idle"); // idle | loading | done | error
  const [lines, setLines] = useState([]);
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const timer = useRef(null);
  const resultRef = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);

  async function run(target) {
    const u = (target ?? url).trim();
    if (!u) {
      setErr("The ER needs a patient. Type a domain.");
      setState("error");
      beep("error");
      return;
    }
    if (u === "your-competitor.com") {
      setErr("Ha. Put in their real domain. I'm not judging. (I'm judging a little.)");
      setState("error");
      return;
    }
    setUrl(u);
    setState("loading");
    setErr("");
    setData(null);
    setLines([LOADING[0]]);
    beep("dialup");
    let i = 1;
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      if (i < LOADING.length) setLines((l) => [...l, LOADING[i++]]);
    }, 520);
    const minWait = new Promise((r) => setTimeout(r, 3200));
    try {
      const [res] = await Promise.all([fetch(`/api/checkup?url=${encodeURIComponent(u)}`), minWait]);
      const json = await res.json();
      clearInterval(timer.current);
      if (!res.ok) throw new Error(json.error || "Unknown condition.");
      setData(json);
      setState("done");
      beep(json.score >= 65 ? "win" : "doom");
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch (e) {
      clearInterval(timer.current);
      setErr(e.message);
      setState("error");
      beep("error");
    }
  }

  const scoreColor = (s) => (s >= 85 ? "var(--green)" : s >= 65 ? "#d98400" : "var(--red)");

  return (
    <div className="er">
      <form
        className="er-form"
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
      >
        <input
          aria-label="Your website domain"
          placeholder="yourcompany.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          autoComplete="off"
          spellCheck="false"
        />
        <button className="btn pink" type="submit" disabled={state === "loading"}>
          {state === "loading" ? "OPERATING…" : "ADMIT PATIENT 🚑"}
        </button>
      </form>
      <div className="er-quick">
        <span>No domain handy? Try:</span>
        {QUICK.map((q) => (
          <button key={q} type="button" onClick={() => run(q)}>
            {q}
          </button>
        ))}
      </div>

      {state === "loading" && (
        <div className="monitor" aria-live="polite">
          <svg className="ekg" viewBox="0 0 600 60" preserveAspectRatio="none">
            <path d="M0 30 H120 L135 10 L150 50 L165 30 H260 L275 5 L290 55 L305 30 H420 L435 12 L450 48 L465 30 H600" />
          </svg>
          {lines.map((l, i) => (
            <div className="line" key={i}>
              {l}
            </div>
          ))}
          <span className="blink">█</span>
        </div>
      )}

      {state === "error" && (
        <div className="er-error" role="alert">
          ⚠ {err}
        </div>
      )}

      {state === "done" && data && (
        <div className="chart" ref={resultRef}>
          <div className="chart-head">
            <div>
              <span className="tag">PATIENT FILE #{String(Math.abs(hash(data.host)) % 99999).padStart(5, "0")}</span>
              <h3 style={{ marginTop: 10 }}>{data.host}</h3>
              <div style={{ fontSize: 13, marginTop: 6 }}>
                Pulse: <b>{data.status}</b> · Response: <b>{data.ms} ms</b> · Redirect hops: <b>{data.hops}</b> · Admitted:{" "}
                {new Date(data.checkedAt).toLocaleString()}
              </div>
              <svg className={`ekg ${data.status !== 200 ? "flat" : ""}`} viewBox="0 0 600 60" preserveAspectRatio="none" style={{ marginTop: 8, background: "#071a0e" }}>
                <path d={data.status === 200 ? "M0 30 H120 L135 10 L150 50 L165 30 H260 L275 5 L290 55 L305 30 H420 L435 12 L450 48 L465 30 H600" : "M0 30 H600"} />
              </svg>
            </div>
            <div className="score" style={{ color: scoreColor(data.score), borderColor: scoreColor(data.score) }}>
              <div>
                {data.score}
                <small>/100 VITALS</small>
              </div>
            </div>
          </div>

          <div className="verdict">
            <Raccoon size={56} mood={data.score >= 65 ? "caught" : "smug"} />
            <div>
              DIAGNOSIS: {data.verdict}
              <div style={{ fontWeight: 400, fontSize: 13 }}>
                {data.fails} critical finding{data.fails === 1 ? "" : "s"} · {data.checks.length} checks run live, just now, on the real site.
              </div>
            </div>
          </div>

          <div className="checks">
            {data.checks.map((c) => (
              <div className="ck" key={c.id}>
                <div className="row">
                  <span className="lbl">
                    <span className={`stamp ${c.status}`}>{c.status === "pass" ? "OK" : c.status === "warn" ? "HMM" : "YIKES"}</span>
                    {c.label}
                  </span>
                  <span className="val">{c.value}</span>
                </div>
                <p>{c.joke}</p>
              </div>
            ))}
          </div>

          <div style={{ padding: "18px 20px 6px" }}>
            <b className="display" style={{ fontSize: 22 }}>WHO&apos;S ALLOWED IN THE BUILDING (robots.txt vs AI crawlers)</b>
          </div>
          <div style={{ overflowX: "auto", padding: "0 20px 18px" }}>
            <table className="ai-table">
              <thead>
                <tr>
                  <th>Crawler</th>
                  <th>Who</th>
                  <th>Door</th>
                  <th>Because</th>
                </tr>
              </thead>
              <tbody>
                {data.ai.map((b) => (
                  <tr key={b.ua}>
                    <td>{b.ua}</td>
                    <td>{b.owner}</td>
                    <td className={`door ${b.state}`}>{b.state === "blocked" ? "🚫 BLOCKED" : b.state === "partial" ? "◐ PARTIAL" : "✅ OPEN"}</td>
                    <td style={{ fontSize: 12 }}>{b.via}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="chart-foot">
            <div style={{ maxWidth: 560, fontSize: 14 }}>
              This was the homepage only, from the outside, in about 3 seconds. The real treatment covers render parity, cannibalization, index
              bloat, entity gaps and AI citation share. That&apos;s the job.
            </div>
            <a
              className="btn"
              href={`mailto:aquibisrar1@gmail.com?subject=${encodeURIComponent(`My site is in the ER: ${data.host} (${data.score}/100)`)}&body=${encodeURIComponent(
                `Hi Aquib,\n\nYour ER gave ${data.host} a ${data.score}/100. Let's talk.\n\n`
              )}`}
              onClick={() => beep("click")}
            >
              BOOK DR. AQUIB →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function hash(s) {
  let h = 0;
  for (const c of s) h = (h << 5) - h + c.charCodeAt(0);
  return h | 0;
}
