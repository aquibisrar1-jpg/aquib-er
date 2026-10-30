"use client";
import { useEffect, useState } from "react";
import { beep } from "./sound";

export function openQuick() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("aq-quick"));
}

// For the senior manager with 30 seconds and zero patience for raccoons.
export default function Quick30() {
  const [open, setOpen] = useState(false);
  const [secs, setSecs] = useState(30);

  useEffect(() => {
    const h = () => { setOpen(true); setSecs(30); beep("open"); };
    window.addEventListener("aq-quick", h);
    return () => window.removeEventListener("aq-quick", h);
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => { window.removeEventListener("keydown", esc); clearInterval(t); };
  }, [open]);

  if (!open) return null;

  return (
    <div className="q30-back" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="win98 q30" role="dialog" aria-label="Aquib in 30 seconds">
        <div className="tbar">
          <span>⏱️ aquib_in_30_seconds.txt</span>
          <button className="xx" onClick={() => setOpen(false)} aria-label="Close">✕</button>
        </div>
        <div className="wbody">
          <div className="q30-timer">{secs}s left · no raccoons in this window, promise</div>
          <h2>Aquib Israr</h2>
          <p className="q30-role">SEO Manager · GEO &amp; AEO Specialist · Delhi NCR · 6+ years</p>
          <ul>
            <li><b>Now:</b> Assistant Manager, SEO at UDIT (formerly IIAD). Leads SEO + GEO and the IIAD → UDIT domain migration.</li>
            <li><b>Revenue, not vanity:</b> at AND Academy, organic drove ~5,000 leads, 300+ applications and ~200 enrollments a year (≈ ₹2 Cr).</li>
            <li><b>Recovery:</b> led the Dec 2025 Core Update recovery. Impressions +86% (5.07M → 9.42M), avg. position 23 → 10.</li>
            <li><b>GEO:</b> built an AI-search program from scratch that now drives ~⅕ of organic conversions.</li>
            <li><b>Builder:</b> own Chrome extension, GSC MCP server and embeddings pipeline. Original AI-citation research featured in PPC Land.</li>
          </ul>
          <div className="q30-ctas">
            <a className="gbtn small" href="mailto:aquibisrar1@gmail.com?subject=Saw%20your%20site.%20Let's%20talk.">✉️ Email</a>
            <a className="gbtn small blue" href="https://www.linkedin.com/in/aquibisrar/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            <a className="gbtn small pink" href="/Aquib_Israr_CV.pdf" download>CV.pdf ↓</a>
          </div>
          <button className="w98 q30-stay" onClick={() => { setOpen(false); document.getElementById("er")?.scrollIntoView({ behavior: "smooth" }); }}>
            OK, I have 2 more minutes → show me the fun stuff
          </button>
        </div>
      </div>
    </div>
  );
}
