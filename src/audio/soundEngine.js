// Procedural ambient pad + interaction blips via the Web Audio API.
// No external audio files: avoids licensing/size concerns and keeps
// the whole thing under a few KB of code. Silent until setMuted(false)
// is called from a real user gesture (the sound toggle button).

let ctx = null;
let masterGain = null;
let padNodes = null;
let enabled = false;

function ensureContext() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function startPad() {
  const context = ctx;
  const padGain = context.createGain();
  padGain.gain.value = 0.5;

  const filter = context.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 600;
  padGain.connect(filter);
  filter.connect(masterGain);

  // Soft low chord, gently detuned for warmth
  const freqs = [65.4, 98, 130.8];
  const oscillators = freqs.map((freq, i) => {
    const osc = context.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.detune.value = (i - 1) * 6;
    osc.connect(padGain);
    osc.start();
    return osc;
  });

  // Slow LFO on the filter cutoff for a subtle "breathing" motion
  const lfo = context.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoGain = context.createGain();
  lfoGain.gain.value = 150;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  padNodes = { padGain, oscillators, lfo };
}

function stopPad() {
  if (!padNodes || !ctx) return;
  const { padGain, oscillators, lfo } = padNodes;
  const now = ctx.currentTime;
  padGain.gain.cancelScheduledValues(now);
  padGain.gain.setValueAtTime(padGain.gain.value, now);
  padGain.gain.linearRampToValueAtTime(0, now + 0.6);
  oscillators.forEach((o) => o.stop(now + 0.7));
  lfo.stop(now + 0.7);
  padNodes = null;
}

export function setMuted(muted) {
  enabled = !muted;
  const context = ensureContext();
  const now = context.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(masterGain.gain.value, now);
  masterGain.gain.linearRampToValueAtTime(enabled ? 0.6 : 0, now + (enabled ? 0.8 : 0.5));

  if (enabled && !padNodes) startPad();
  if (!enabled && padNodes) setTimeout(stopPad, 600);
}

function blip({ freq, duration, gain, type }) {
  if (!enabled || !ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(gain, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export function playHover() {
  blip({ freq: 720, duration: 0.12, gain: 0.12, type: 'sine' });
}

export function playClick() {
  blip({ freq: 480, duration: 0.22, gain: 0.18, type: 'triangle' });
}
