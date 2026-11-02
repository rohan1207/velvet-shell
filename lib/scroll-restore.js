/**
 * Session scroll positions for back/forward restoration (works with Lenis).
 */

const STORAGE_KEY = 'vs-scroll-positions';

export function routeKey(pathname = '/', search = '') {
  const q = typeof search === 'string' ? search.replace(/^\?/, '') : '';
  return q ? `${pathname}?${q}` : pathname;
}

export function getScrollY() {
  if (typeof window === 'undefined') return 0;
  const lenisY = window.__lenis?.scroll;
  if (typeof lenisY === 'number' && Number.isFinite(lenisY)) return lenisY;
  return window.scrollY || document.documentElement.scrollTop || 0;
}

export function scrollToY(y, { immediate = true } = {}) {
  if (typeof window === 'undefined') return;
  const top = Math.max(0, Number(y) || 0);
  if (window.__lenis) {
    window.__lenis.scrollTo(top, { immediate });
  }
  window.scrollTo({ top, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = top;
  document.body.scrollTop = top;
}

function readAll() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveScrollPosition(key, y = getScrollY()) {
  if (typeof window === 'undefined' || !key) return;
  try {
    const all = readAll();
    all[key] = Math.max(0, Math.round(Number(y) || 0));
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* private mode / quota */
  }
}

export function readScrollPosition(key) {
  if (typeof window === 'undefined' || !key) return null;
  const y = readAll()[key];
  return typeof y === 'number' && Number.isFinite(y) ? y : null;
}
