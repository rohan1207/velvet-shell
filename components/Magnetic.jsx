'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';

export default function Magnetic({ children, strength = 18, className = '' }) {
  const ref = useRef(null);

  function onMove(event) {
    const node = ref.current;
    if (!node || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = node.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    node.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
  }

  function onLeave() {
    if (ref.current) ref.current.style.transform = 'translate(0, 0)';
  }

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`will-change-transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${className}`}>
      {children}
    </motion.div>
  );
}
