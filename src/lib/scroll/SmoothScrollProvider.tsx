'use client';

import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setLenisInstance } from './lenis';

gsap.registerPlugin(ScrollTrigger);

// Fonte única de verdade do scroll do site: Lenis dirige o scroll real, e o
// GSAP ScrollTrigger é apenas sincronizado a ele (nunca inicializa seu próprio
// smoothing). Framer Motion, usado nos componentes, NUNCA deve manipular
// window.scrollTo/useScroll global — só transições locais (opacidade, hover,
// entrada de elemento) que não competem por dono do scroll.
export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.toggle('no-motion', prefersReducedMotion);

    if (prefersReducedMotion) {
      // Scroll nativo do navegador, sem Lenis nem sincronização de ScrollTrigger.
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });
    setLenisInstance(lenis);

    lenis.on('scroll', ScrollTrigger.update);

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return <>{children}</>;
}
