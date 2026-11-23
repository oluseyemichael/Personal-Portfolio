import { useEffect, useRef, useState } from 'react';
import { goToZone } from '../lib/navigate.js';
import { content } from '../config/content.js';
import { trackEvent } from '../analytics.js';

const MAX_MESSAGES = 20; // per session, to cap API cost
const STORAGE_KEY = 'ai-companion-v1';
const GREETING = {
  role: 'assistant',
  content: "Hey. I'm an AI that's read Michael's CV and project notes. Ask me about the projects, the skills, whatever. I'll keep it real.",
};
const SUGGESTIONS = ['What has Michael built?', 'Is Michael more engineer or product?', 'What is Michael working on right now?'];
const TAG = /\[\[goto:(landing|about|work|skills|contact)\]\]/;
const ZONE_LABEL = { landing: 'Start', about: 'About', work: 'Projects', skills: 'Skills', contact: 'Contact' };

function load() {
  try {
    const s = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (s && Array.isArray(s.messages)) return s;
  } catch {
    /* storage unavailable */
  }
  return { messages: [GREETING], used: 0 };
}

// Repeated questions are answered from memory for the rest of the session.
const cache = new Map();

export function AICompanion() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(load);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null);
  const lastSent = useRef(0);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [state.messages, open, busy]);

  const remaining = MAX_MESSAGES - state.used;

  const send = async (text) => {
    const q = text.trim();
    const now = Date.now();
    if (!q || busy || remaining <= 0 || now - lastSent.current < 800) return; // debounce
    lastSent.current = now;
    setInput('');
    trackEvent('ai_question');

    const history = [...state.messages, { role: 'user', content: q }];
    setState((s) => ({ messages: history, used: s.used + 1 }));

    const key = q.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    if (cache.has(key)) {
      setState((s) => ({ ...s, messages: [...s.messages, { role: 'assistant', content: cache.get(key) }] }));
      return;
    }

    setBusy(true);
    let reply;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(1).slice(-10) }),
      });
      if (!res.ok) throw new Error(String(res.status));
      reply = (await res.json()).reply;
      if (!reply) throw new Error('empty');
      cache.set(key, reply);
    } catch {
      reply = `I'm offline right now. Browse around, or email Michael at ${content.contact.email}.`;
    }
    setBusy(false);
    setState((s) => ({ ...s, messages: [...s.messages, { role: 'assistant', content: reply }] }));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Ask the AI guide'}
        aria-expanded={open}
        className="fixed bottom-8 right-4 md:right-8 z-50 w-11 h-11 flex items-center justify-center rounded-full bg-navy-900/90 border border-gold-400/40 text-gold-400 hover:border-gold-400 shadow-[0_0_18px_rgba(255,193,69,0.25)] transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M21 12a8 8 0 01-11.5 7.2L4 21l1.8-5.5A8 8 0 1121 12z" />}
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="AI guide"
          className="fixed z-50 bottom-24 right-4 md:right-8 w-[min(350px,calc(100vw-2rem))] h-[min(450px,70vh)] flex flex-col rounded-xl bg-navy-900/95 border border-white/10 shadow-2xl overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-white/10 font-mono text-[10px] tracking-[0.25em] uppercase text-gold-400/90">
            Ask about Michael <span className="text-cream/50">&middot; {Math.max(0, remaining)} left</span>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 font-body text-sm">
            {state.messages.map((m, i) => {
              const tag = m.role === 'assistant' ? m.content.match(TAG) : null;
              const text = m.content.replace(TAG, '').trim();
              return (
                <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
                  <div
                    className={`inline-block max-w-[88%] px-3 py-2 rounded-lg text-left ${
                      m.role === 'user' ? 'bg-gold-400/15 text-cream' : 'bg-white/5 text-cream/85'
                    }`}
                  >
                    {text}
                  </div>
                  {tag && (
                    <div className="mt-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          trackEvent('ai_navigate', { zone: tag[1] });
                          goToZone(tag[1]);
                        }}
                        className="text-xs font-mono text-gold-400 border border-gold-400/40 rounded-full px-3 py-1 hover:bg-gold-400/10"
                      >
                        Take me to {ZONE_LABEL[tag[1]]} &rarr;
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            {busy && <div className="text-cream/40 font-mono text-xs">thinking&hellip;</div>}
            {state.messages.length === 1 && !busy && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="text-xs text-cream/60 border border-white/15 rounded-full px-3 py-1 hover:text-gold-400 hover:border-gold-400/40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 p-3 border-t border-white/10"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={300}
              disabled={remaining <= 0}
              placeholder={remaining <= 0 ? 'That was your 20. Email Michael for more.' : 'Ask a question...'}
              className="flex-1 bg-transparent border border-white/15 rounded-lg px-3 py-2 text-sm text-cream placeholder:text-cream/30 outline-none focus:border-gold-400/50"
            />
            <button
              type="submit"
              disabled={busy || remaining <= 0 || !input.trim()}
              className="px-3 rounded-lg bg-gold-400 text-navy-950 text-sm font-medium disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
