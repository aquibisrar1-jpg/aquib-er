"use client";
// 8-bit WebAudio sound effects. ON by default (the browser only lets
// them play after the visitor's first click, which is fine: everything
// here is triggered by a click anyway).
let ctx = null;
let enabled = true;
const listeners = new Set();

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

export function setSound(on) {
  enabled = on;
  listeners.forEach((fn) => fn(on));
  if (on) beep("on");
}
export function soundOn() {
  return enabled;
}
export function onSoundChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

const PRESETS = {
  click: { type: "square", notes: [[740, 0.035]] },
  open: { type: "square", notes: [[523, 0.05], [784, 0.07]] },
  close: { type: "square", notes: [[784, 0.04], [392, 0.06]] },
  error: { type: "sawtooth", notes: [[200, 0.14], [150, 0.22]] },
  win: { type: "square", notes: [[523, 0.08], [659, 0.08], [784, 0.08], [1047, 0.22]] },
  catch: { type: "square", notes: [[1200, 0.04], [1700, 0.08]] },
  miss: { type: "triangle", notes: [[300, 0.05]] },
  doom: { type: "sawtooth", notes: [[330, 0.18], [247, 0.2], [165, 0.45]] },
  on: { type: "square", notes: [[660, 0.06], [990, 0.09]] },
  dialup: { type: "square", notes: [[1270, 0.09], [2100, 0.07], [980, 0.11], [2400, 0.06], [1600, 0.12], [1070, 0.1], [2250, 0.14]] },
  tick: { type: "square", notes: [[1500, 0.015]] },
  coin: { type: "square", notes: [[988, 0.06], [1319, 0.2]] },
};

export function beep(kind = "click") {
  if (!enabled) return;
  const c = getCtx();
  if (!c) return;
  const p = PRESETS[kind] || PRESETS.click;
  let t = c.currentTime + 0.01;
  for (const [f, d] of p.notes) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = p.type;
    o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.06, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + d + 0.02);
    t += d;
  }
}
