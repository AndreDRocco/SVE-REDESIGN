'use client';

import { useEffect, useRef, useState } from 'react';

// Cursor customizado leve (sem WebGL) inspirado no lusion.co: um ponto que
// segue o mouse e cresce sobre elementos com data-cursor="hover". Desativado
// em touch e em prefers-reduced-motion para não incomodar quem não pediu isso.
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reducedMotion) return;

    setActive(true);
    // Esconde o cursor nativo do sistema só quando o ponto customizado está
    // realmente rodando — em touch/reduced-motion o cursor nativo continua
    // sendo o único feedback visual, então nunca deve sumir nesses casos.
    document.documentElement.classList.add('has-custom-cursor');

    const move = (e: MouseEvent) => {
      if (!dotRef.current) return;
      dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setHovering(!!target.closest('[data-cursor="hover"]'));
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  if (!active) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className={`pointer-events-none fixed left-0 top-0 z-[100] -ml-2 -mt-2 h-4 w-4 rounded-full bg-gold mix-blend-difference transition-transform duration-200 ease-out ${
        hovering ? 'scale-[3]' : 'scale-100'
      }`}
    />
  );
}
