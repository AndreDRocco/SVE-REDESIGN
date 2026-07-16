'use client';

import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';

// Wrapper fino sobre gsap.context() para que cada seção registre suas próprias
// animações/ScrollTriggers escopadas a um ref e tudo seja limpo automaticamente
// ao desmontar — evita ScrollTriggers "fantasmas" de seções que já saíram da tela.
export function useGsapContext(scope: RefObject<HTMLElement>, setup: (context: gsap.Context) => void) {
  useEffect(() => {
    if (!scope.current) return;
    const ctx = gsap.context(setup, scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
