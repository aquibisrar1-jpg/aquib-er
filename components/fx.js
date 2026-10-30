"use client";
// Tiny emoji confetti. No libraries, very 1999.
export function confetti(emojis = ["🎉", "⭐", "💸", "📈", "✨", "🏆"], n = 70) {
  if (typeof document === "undefined") return;
  const layer = document.createElement("div");
  layer.className = "confetti-layer";
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    s.textContent = emojis[i % emojis.length];
    s.style.left = Math.random() * 100 + "vw";
    s.style.fontSize = 18 + Math.random() * 26 + "px";
    s.style.animationDuration = 1.8 + Math.random() * 2.2 + "s";
    s.style.animationDelay = Math.random() * 0.6 + "s";
    layer.appendChild(s);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 5200);
}

export function esc(s = "") {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
