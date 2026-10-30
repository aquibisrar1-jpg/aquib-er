"use client";
// Tiny WebAudio bleeps. Off until the visitor turns them on.
let ctx = null;
let enabled = false;

export function setSound(on) {
  enabled = on;
  if (on && !ctx && typeof window !== "undefined") {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) ctx = new AC();
  }
}
export function soundOn() {
  return enabled;
}

export function beep(kind = "click") {
  if (!enabled || !ctx) return;
  const presets = {
    click: [[880, 0.04]],
    error: [[220, 0.12], [180, 0.18]],
    win: [[523, 0.08], [659, 0.08], [784, 0.08], [1047, 0.18]],
    catch: [[1200, 0.05], [1600, 0.07]],
    doom: [[300, 0.15], [200, 0.2], [120, 0.35]],
    dialup: [[1200, 0.08], [2100, 0.08], [980, 0.1], [2400, 0.06], [1500, 0.12]],
  };
  let t = ctx.currentTime;
  for (const [f, d] of presets[kind] || presets.click) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = kind === "doom" ? "sawtooth" : "square";
    o.frequency.value = f;
    g.gain.setValueAtTime(0.05, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + d);
    t += d;
  }
}
