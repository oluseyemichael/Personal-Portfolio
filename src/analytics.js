// Zero-dependency analytics event dispatcher. No-ops until a real
// analytics script defines window.plausible - drop something like
// Plausible's <script> tag into index.html and these calls start
// reporting with no other code changes needed.
export function trackEvent(name, props) {
  if (typeof window === 'undefined') return;
  if (typeof window.plausible === 'function') {
    window.plausible(name, props ? { props } : undefined);
  }
}
