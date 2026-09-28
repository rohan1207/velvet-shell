'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return undefined;
    document.documentElement.classList.add('has-cursor');

    const pos = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };
    let word = '';
    let hovering = false;

    const move = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      const target = event.target.closest('[data-cursor]');
      hovering = Boolean(target);
      word = target?.getAttribute('data-cursor') || '';
    };

    window.addEventListener('mousemove', move, { passive: true });

    let frame;
    const loop = () => {
      pos.x += (mouse.x - pos.x) * 0.18;
      pos.y += (mouse.y - pos.y) * 0.18;
      if (ring.current) {
        const size = hovering ? 72 : 18;
        ring.current.style.transform = `translate3d(${pos.x - size / 2}px, ${pos.y - size / 2}px, 0)`;
        ring.current.style.width = `${size}px`;
        ring.current.style.height = `${size}px`;
        ring.current.style.opacity = hovering ? '1' : '0.85';
        ring.current.style.background = hovering ? 'rgba(176,141,87,0.12)' : 'transparent';
      }
      if (label.current) {
        label.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
        label.current.textContent = word;
        label.current.style.opacity = word ? '1' : '0';
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', move);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed top-0 left-0 z-[90] hidden rounded-full border border-gold/80 mix-blend-difference md:block"
        style={{ width: 18, height: 18 }}
      />
      <div
        ref={label}
        className="pointer-events-none fixed top-0 left-0 z-[91] hidden text-[10px] tracking-[0.28em] text-ink uppercase mix-blend-normal md:block"
        style={{ opacity: 0 }}
      />
    </>
  );
}
