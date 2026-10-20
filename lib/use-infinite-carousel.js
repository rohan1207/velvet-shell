'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** Midpoint of the requested 2.5–3s hold. */
export const BANNER_INTERVAL_MS = 2800;
export const BANNER_TRANSITION_MS = 900;

/**
 * Clone bookends so the track can keep sliding forward (…N → clone-of-1 →
 * snap to real 1) without a visible rewind from last → first.
 */
export function buildClonedSlides(slides, getKey = (s, i) => s.id ?? s.src ?? i) {
  if (!slides?.length) return [];
  if (slides.length === 1) {
    return [{ ...slides[0], __key: getKey(slides[0], 0), __clone: false }];
  }
  return [
    { ...slides[slides.length - 1], __key: 'clone-start', __clone: true },
    ...slides.map((s, i) => ({ ...s, __key: getKey(s, i), __clone: false })),
    { ...slides[0], __key: 'clone-end', __clone: true },
  ];
}

/**
 * Continuous forward carousel state for transform-based banner tracks.
 * Autoplay runs while the root is in view (and the tab is visible).
 */
export function useInfiniteCarousel({
  count,
  intervalMs = BANNER_INTERVAL_MS,
  transitionMs = BANNER_TRANSITION_MS,
  paused = false,
  enabled = true,
}) {
  const hasLoop = count > 1;
  const FIRST = 1;
  const LAST = count;
  const CLONE_END = count + 1;
  const CLONE_START = 0;

  const rootRef = useRef(null);
  const [trackIndex, setTrackIndex] = useState(hasLoop ? FIRST : 0);
  const [withTransition, setWithTransition] = useState(true);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  const locked = useRef(false);
  const wrapTimer = useRef(null);
  const unlockTimer = useRef(null);
  const autoTimer = useRef(null);
  const goNextRef = useRef(() => {});

  const logicalIndex = hasLoop
    ? Math.min(Math.max(trackIndex - 1, 0), count - 1)
    : 0;

  const clearWrapTimer = useCallback(() => {
    if (wrapTimer.current) {
      window.clearTimeout(wrapTimer.current);
      wrapTimer.current = null;
    }
    if (unlockTimer.current) {
      window.clearTimeout(unlockTimer.current);
      unlockTimer.current = null;
    }
  }, []);

  const unlock = useCallback(() => {
    locked.current = false;
    if (unlockTimer.current) {
      window.clearTimeout(unlockTimer.current);
      unlockTimer.current = null;
    }
  }, []);

  /** Always release the lock after the transition window — never get stuck. */
  const armUnlock = useCallback(() => {
    if (unlockTimer.current) window.clearTimeout(unlockTimer.current);
    unlockTimer.current = window.setTimeout(() => {
      unlock();
    }, transitionMs + 80);
  }, [transitionMs, unlock]);

  const afterMove = useCallback(
    (nextIndex) => {
      if (!hasLoop) {
        unlock();
        return;
      }
      clearWrapTimer();
      armUnlock();
      wrapTimer.current = window.setTimeout(() => {
        if (nextIndex === CLONE_END || nextIndex === CLONE_START) {
          setWithTransition(false);
          setTrackIndex(nextIndex === CLONE_END ? FIRST : LAST);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setWithTransition(true);
              unlock();
            });
          });
        } else {
          unlock();
        }
      }, transitionMs);
    },
    [FIRST, LAST, CLONE_END, CLONE_START, armUnlock, clearWrapTimer, hasLoop, transitionMs, unlock],
  );

  const goNext = useCallback(() => {
    if (!hasLoop || locked.current) return;
    locked.current = true;
    setWithTransition(true);
    setTrackIndex((i) => {
      const next = i + 1;
      afterMove(next);
      return next;
    });
  }, [afterMove, hasLoop]);

  const goPrev = useCallback(() => {
    if (!hasLoop || locked.current) return;
    locked.current = true;
    setWithTransition(true);
    setTrackIndex((i) => {
      const next = i - 1;
      afterMove(next);
      return next;
    });
  }, [afterMove, hasLoop]);

  const goTo = useCallback(
    (i) => {
      if (!hasLoop || locked.current) return;
      const target = i + 1;
      if (target === trackIndex) return;
      locked.current = true;
      setWithTransition(true);
      setTrackIndex(target);
      afterMove(target);
    },
    [afterMove, hasLoop, trackIndex],
  );

  goNextRef.current = goNext;

  // Reset when slide count changes (e.g. category switch)
  useEffect(() => {
    clearWrapTimer();
    unlock();
    setWithTransition(false);
    setTrackIndex(hasLoop ? FIRST : 0);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setWithTransition(true));
    });
  }, [count, hasLoop, FIRST, clearWrapTimer, unlock]);

  // In-view: resume when scrolling back to the hero; pause off-screen
  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(Boolean(entry?.isIntersecting));
        // Scrolling back into view must never leave a stale lock
        if (entry?.isIntersecting) unlock();
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [unlock]);

  // Tab visibility
  useEffect(() => {
    const onVisibility = () => {
      const visible = document.visibilityState === 'visible';
      setTabVisible(visible);
      if (visible) unlock();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [unlock]);

  // Stable autoplay interval — uses ref so goNext identity changes don't rebuild the timer
  useEffect(() => {
    const shouldPlay = enabled && hasLoop && !paused && inView && tabVisible;
    if (!shouldPlay) {
      if (autoTimer.current) {
        window.clearInterval(autoTimer.current);
        autoTimer.current = null;
      }
      return undefined;
    }

    autoTimer.current = window.setInterval(() => {
      goNextRef.current();
    }, intervalMs);

    return () => {
      if (autoTimer.current) {
        window.clearInterval(autoTimer.current);
        autoTimer.current = null;
      }
    };
  }, [enabled, hasLoop, paused, inView, tabVisible, intervalMs]);

  useEffect(() => () => clearWrapTimer(), [clearWrapTimer]);

  const trackStyle = {
    transform: `translate3d(-${trackIndex * 100}%, 0, 0)`,
    transition: withTransition
      ? `transform ${transitionMs}ms cubic-bezier(0.22, 1, 0.36, 1)`
      : 'none',
  };

  return {
    rootRef,
    trackIndex,
    logicalIndex,
    withTransition,
    trackStyle,
    goNext,
    goPrev,
    goTo,
    hasLoop,
    inView,
  };
}
