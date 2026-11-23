import { theme } from '../config/theme.js';

/**
 * Scrolls to a named zone. In the 3D experience that means a
 * scroll-progress fraction (the camera follows); in the 2D layout
 * it scrolls to the matching section element.
 */
export function goToZone(key) {
  const el = document.getElementById(`zone-${key}`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  const zone = theme.zones[key];
  if (!zone) return;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: scrollHeight * (zone.focus ?? zone.start), behavior: 'smooth' });
}
