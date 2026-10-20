const CART_SVG = `
<svg viewBox="0 0 24 24" fill="none" width="54%" height="54%" aria-hidden="true">
  <path d="M7.2 8.5h9.6l.7 11.2H6.5L7.2 8.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
  <path d="M9.2 8.5V7.2a2.8 2.8 0 0 1 5.6 0v1.3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
</svg>
`;

export function getNavCartTarget() {
  if (typeof document === 'undefined') return null;
  return document.querySelector('[data-nav-cart]');
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Spawns a cart orb from `sourceEl` and flies it into the navbar cart.
 * Resolves when the flight finishes (or immediately if skipped).
 */
export function flyToCart(sourceEl) {
  if (typeof window === 'undefined' || !sourceEl) {
    return Promise.resolve({ skipped: true });
  }

  const target = getNavCartTarget();
  if (!target || prefersReducedMotion()) {
    return Promise.resolve({ skipped: true });
  }

  const from = sourceEl.getBoundingClientRect();
  const to = target.getBoundingClientRect();

  if (!from.width || !to.width) {
    return Promise.resolve({ skipped: true });
  }

  const size = Math.max(28, Math.min(from.width, from.height, 42));
  const startX = from.left + from.width / 2 - size / 2;
  const startY = from.top + from.height / 2 - size / 2;
  const endX = to.left + to.width / 2 - size / 2;
  const endY = to.top + to.height / 2 - size / 2;
  const midX = startX + (endX - startX) * 0.42;
  const midY = Math.min(startY, endY) - Math.min(96, Math.abs(startY - endY) * 0.35 + 48);

  const flyer = document.createElement('div');
  flyer.setAttribute('aria-hidden', 'true');
  flyer.className = 'fly-to-cart-orb';
  flyer.innerHTML = CART_SVG;
  flyer.style.cssText = [
    'position:fixed',
    'left:0',
    'top:0',
    `width:${size}px`,
    `height:${size}px`,
    'z-index:10050',
    'pointer-events:none',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'border-radius:9999px',
    'color:#fff',
    'background:linear-gradient(145deg,#6d0a34 0%,#5e062a 48%,#4a0420 100%)',
    'box-shadow:0 10px 28px rgba(94,6,42,0.35)',
    `transform:translate(${startX}px,${startY}px) scale(1)`,
    'will-change:transform,opacity',
  ].join(';');

  document.body.appendChild(flyer);

  let settled = false;
  const cleanup = () => {
    if (settled) return;
    settled = true;
    flyer.remove();
  };

  const animation = flyer.animate(
    [
      {
        transform: `translate(${startX}px, ${startY}px) scale(1)`,
        opacity: 1,
        offset: 0,
      },
      {
        transform: `translate(${midX}px, ${midY}px) scale(0.92)`,
        opacity: 1,
        offset: 0.55,
      },
      {
        transform: `translate(${endX}px, ${endY}px) scale(0.28)`,
        opacity: 0.85,
        offset: 1,
      },
    ],
    {
      duration: 780,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards',
    },
  );

  return animation.finished
    .then(() => {
      cleanup();
      target.classList.remove('nav-cart-bump');
      // Force reflow so re-adding the class retriggers the animation
      void target.offsetWidth;
      target.classList.add('nav-cart-bump');
      window.setTimeout(() => target.classList.remove('nav-cart-bump'), 520);
      return { skipped: false };
    })
    .catch(() => {
      cleanup();
      return { skipped: true };
    });
}
