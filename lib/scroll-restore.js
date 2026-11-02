/**
 * Session scroll + focus restoration for App Router back/forward.
 * Module state survives ScrollToTop remounts (Suspense / searchParams).
 */

const STORAGE_KEY = 'vs-scroll-positions';
const FOCUS_KEY = 'vs-return-focus';

/** Set synchronously on popstate — must live outside React. */
let pendingPop = false;
/** While true, ignore scroll persistence so a top jump can't wipe saved Y. */
let restoreLock = false;

export function markPopNavigation() {
  pendingPop = true;
}

export function consumePopNavigation() {
  const was = pendingPop;
  pendingPop = false;
  return was;
}

export function isPopNavigationPending() {
  return pendingPop;
}

export function setRestoreLock(locked) {
  restoreLock = Boolean(locked);
}

export function isRestoreLocked() {
  return restoreLock;
}

export function routeKey(pathname = '/', search = '') {
  const q = typeof search === 'string' ? search.replace(/^\?/, '') : '';
  return q ? `${pathname}?${q}` : pathname;
}

export function currentRouteKey() {
  if (typeof window === 'undefined') return '/';
  return routeKey(window.location.pathname, window.location.search.slice(1));
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
  const lenis = window.__lenis;
  if (lenis) {
    try {
      lenis.scrollTo(top, { immediate, force: true });
    } catch {
      lenis.scrollTo(top, { immediate });
    }
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
  if (typeof window === 'undefined' || !key || restoreLock) return;
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

export function saveReturnFocus(id) {
  if (typeof window === 'undefined' || !id) return;
  try {
    sessionStorage.setItem(
      FOCUS_KEY,
      JSON.stringify({ id: String(id), key: currentRouteKey() }),
    );
  } catch {
    /* ignore */
  }
}

export function readReturnFocus(forKey) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(FOCUS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.id) return null;
    if (forKey && parsed.key && parsed.key !== forKey) return null;
    return String(parsed.id);
  } catch {
    return null;
  }
}

export function clearReturnFocus() {
  try {
    sessionStorage.removeItem(FOCUS_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Keep applying scroll Y until the document is tall enough (or timeout).
 * Then optionally bring a card into view.
 */
export function restoreViewport({ y = 0, focusId = null, timeoutMs = 2800 } = {}) {
  if (typeof window === 'undefined') return () => {};

  setRestoreLock(true);
  const targetY = Math.max(0, Number(y) || 0);
  const started = Date.now();
  let cancelled = false;
  let raf = 0;
  let finished = false;
  const timers = [];

  const lenis = window.__lenis;
  try {
    lenis?.stop?.();
  } catch {
    /* ignore */
  }

  const tryFocus = () => {
    if (!focusId) return false;
    const safeId =
      typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
        ? CSS.escape(focusId)
        : String(focusId).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const el = document.querySelector(`[data-restore-id="${safeId}"]`);
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || 0;
    const visible = rect.top >= vh * 0.12 && rect.bottom <= vh * 0.92;
    if (!visible) {
      el.scrollIntoView({ block: 'center', behavior: 'auto' });
      saveScrollPosition(currentRouteKey(), getScrollY());
    }
    clearReturnFocus();
    return true;
  };

  const finish = () => {
    if (finished || cancelled) return;
    finished = true;
    scrollToY(
      Math.min(
        targetY,
        Math.max(0, (document.documentElement?.scrollHeight || 0) - (window.innerHeight || 0)),
      ),
    );
    tryFocus();
    try {
      lenis?.start?.();
    } catch {
      /* ignore */
    }
    setRestoreLock(false);
  };

  const apply = () => {
    if (cancelled || finished) return;
    scrollToY(targetY);
    const docH = Math.max(
      document.documentElement?.scrollHeight || 0,
      document.body?.scrollHeight || 0,
    );
    const vh = window.innerHeight || 0;
    const maxY = Math.max(0, docH - vh);
    const desired = Math.min(targetY, maxY);
    const closeEnough = Math.abs(getScrollY() - desired) < 12;
    const tallEnough = docH >= targetY + vh * 0.35 || targetY <= 8;
    const focused = tryFocus();
    const timedOut = Date.now() - started > timeoutMs;

    if ((closeEnough && tallEnough) || focused || timedOut) {
      timers.push(window.setTimeout(finish, 60));
      return;
    }

    raf = requestAnimationFrame(apply);
  };

  apply();
  [40, 100, 200, 400, 700, 1100, 1600, 2200].forEach((ms) => {
    timers.push(window.setTimeout(apply, ms));
  });

  const ro =
    typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => {
          if (!cancelled && !finished && restoreLock) apply();
        })
      : null;
  if (ro) ro.observe(document.documentElement);

  return () => {
    cancelled = true;
    cancelAnimationFrame(raf);
    timers.forEach((t) => window.clearTimeout(t));
    ro?.disconnect();
    try {
      lenis?.start?.();
    } catch {
      /* ignore */
    }
    setRestoreLock(false);
  };
}

/** Install once: popstate + manual history scrollRestoration. */
let installed = false;
export function installScrollRestoreListeners() {
  if (typeof window === 'undefined' || installed) return;
  installed = true;
  try {
    window.history.scrollRestoration = 'manual';
  } catch {
    /* ignore */
  }
  window.addEventListener('popstate', () => {
    markPopNavigation();
  });
  window.addEventListener('pagehide', () => {
    if (!restoreLock) saveScrollPosition(currentRouteKey(), getScrollY());
  });
}
