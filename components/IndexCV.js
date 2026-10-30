"use client";
import { useEffect, useState } from "react";
import { beep } from "./sound";
import { confetti } from "./fx";

// Every Search Console status an SEO has screamed at, in order of emotional damage.
const STATES = [
  { s: "URL is not on Google", d: "Discovered – currently not indexed", n: "Google knows this CV exists. It has chosen not to care. Yet.", c: "grey" },
  { s: "Indexing requested", d: "Quota exceeded", n: "You've used your indexing requests for today. Try again tomorrow. (Or right now. We won't tell.)", c: "amber" },
  { s: "URL is not on Google", d: "Crawled – currently not indexed", n: "Googlebot read the whole CV. Said nothing. Left. Like a recruiter.", c: "grey" },
  { s: "URL is not on Google", d: "Duplicate, Google chose different canonical than user", n: "Google decided an agency's '12-month SEO retainer' PDF is the original. Rude.", c: "red" },
  { s: "URL is not on Google", d: "Soft 404", n: "Google thinks a CV with these numbers can't be real. Understandable. They're real.", c: "red" },
  { s: "URL is not on Google", d: "Page with redirect", n: "The CV redirected to LinkedIn, which redirected to 'Sign in to view'. Classic.", c: "amber" },
  { s: "URL is not on Google", d: "Blocked due to other 4xx issue", n: "Error 418: I'm a teapot. Aquib was making chai. One more click.", c: "red" },
  { s: "URL is on Google", d: "Indexed. Also: hired?", n: "Finally. It only took {n} requests, which honestly is faster than most real pages.", c: "green" },
];

export default function IndexCV() {
  const [i, setI] = useState(0);
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(0);
  const [host, setHost] = useState("aquib-ranks.vercel.app");
  useEffect(() => setHost(window.location.host), []);
  const st = STATES[i];
  const done = i === STATES.length - 1;

  const request = () => {
    if (busy || done) return;
    setBusy(true);
    beep("dialup");
    setTimeout(() => {
      const next = i + 1;
      setI(next);
      setCount((c) => c + 1);
      setBusy(false);
      if (next === STATES.length - 1) { beep("win"); confetti(["✅", "📄", "🎉", "💼"]); } else beep("error");
    }, 1300);
  };

  return (
    <div className="gscard">
      <div className="gscard-top">
        <span>🔍</span>
        <span className="gscard-url">https://{host}/Aquib_Israr_CV.pdf</span>
        <span className="gscard-tag">URL inspection (parody)</span>
      </div>
      <div className={`gscard-status ${st.c}`}>
        <div className="big">{st.c === "green" ? "✅" : st.c === "red" ? "⛔" : st.c === "amber" ? "⚠️" : "ⓘ"} {st.s}</div>
        <div className="sub">{st.d}</div>
      </div>
      <div className="gscard-body">
        <p>{st.n.replace("{n}", count)}</p>
        <table>
          <tbody>
            <tr><td>Discovery</td><td>Sitemap: aquib_career.xml</td></tr>
            <tr><td>Last crawl</td><td>{count ? "Just now" : "Never (rude)"}</td></tr>
            <tr><td>Crawled as</td><td>Googlebot smartphone</td></tr>
            <tr><td>Indexing allowed?</td><td>Yes, obviously</td></tr>
            <tr><td>Requests made</td><td>{count}</td></tr>
          </tbody>
        </table>
        <div className="gscard-actions">
          {!done ? (
            <button className="gsc-btn" onClick={request} disabled={busy}>{busy ? "Testing if live URL can be indexed…" : "REQUEST INDEXING"}</button>
          ) : (
            <>
              <a className="gbtn" href="/Aquib_Israr_CV.pdf" download>📄 DOWNLOAD THE INDEXED CV</a>
              <a className="gbtn pink" href="#hire">YES, HIRED →</a>
            </>
          )}
        </div>
        {busy && <div className="gscard-spin"><i /></div>}
      </div>
    </div>
  );
}
