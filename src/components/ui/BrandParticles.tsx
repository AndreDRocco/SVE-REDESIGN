'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  r: number;
  baseOpacity: number;
  driftX: number;
  driftY: number;
  phase: number;
}

const PARTICLE_COUNT = 26;
// Cor dourada da marca (mesma do --color-gold) — fagulhas/vaga-lumes bem
// sutis, nunca competindo com o conteúdo por cima.
const PARTICLE_COLOR = '212, 162, 76';

// Camada ambiente fixa, atrás do cursor customizado mas acima de todas as
// seções: poucas partículas douradas que derivam devagar e se afastam
// suavemente do mouse — dá vida ao fundo inteiro do site sem depender da cor
// sólida de nenhuma seção específica. Puramente decorativo: pointer-events
// none (nunca captura clique), desligado em touch e prefers-reduced-motion
// (mesmo critério do CustomCursor), e se o rAF nunca tickar por algum
// motivo, o pior cenário é "sem partículas" — nunca esconde conteúdo real.
export default function BrandParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reducedMotion) return;
    setActive(true);
  }, []);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1 + Math.random() * 1.8,
      baseOpacity: 0.12 + Math.random() * 0.3,
      driftX: (Math.random() - 0.5) * 0.12,
      driftY: -0.06 - Math.random() * 0.14,
      phase: Math.random() * Math.PI * 2,
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMove);

    let raf = 0;
    let t = 0;
    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.driftX;
        p.y += p.driftY;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Afasta a partícula da posição do mouse — campo de repulsão suave,
        // é isso que dá a sensação de "interativo" ao fundo.
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        let ox = 0;
        let oy = 0;
        if (dist < 130) {
          const force = (1 - dist / 130) * 20;
          ox = (dx / dist) * force;
          oy = (dy / dist) * force;
        }

        const flicker = 0.7 + 0.3 * Math.sin(t * 0.02 + p.phase);
        ctx.beginPath();
        ctx.arc(p.x + ox, p.y + oy, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PARTICLE_COLOR}, ${p.baseOpacity * flicker})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMove);
    };
  }, [active]);

  if (!active) return null;

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-30" />;
}
