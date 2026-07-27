import { useState } from 'react';
import { setMuted } from '../audio/soundEngine.js';

/**
 * Ambient sound is off by default (no autoplay). This is the only
 * gesture that starts the AudioContext, satisfying the browser's
 * user-activation requirement for Web Audio.
 */
export function SoundToggle() {
  const [enabled, setEnabled] = useState(false);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    setMuted(!next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={enabled ? 'Mute ambient sound' : 'Unmute ambient sound'}
      aria-pressed={enabled}
      className="fixed bottom-8 left-8 md:left-16 z-30 w-9 h-9 flex items-center justify-center rounded-full border border-cream/15 text-cream/50 hover:text-gold-400 hover:border-gold-400/40 transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 9v6h4l5 5V4L8 9H4z" />
        {enabled ? (
          <path d="M16 8a5 5 0 010 8" />
        ) : (
          <path d="M17 8l4 8M21 8l-4 8" />
        )}
      </svg>
    </button>
  );
}
