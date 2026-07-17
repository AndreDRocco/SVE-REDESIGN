import type Lenis from 'lenis';

// Singleton simples para expor a instância do Lenis a quem precisa disparar
// scroll programático (ex.: cliques de navegação, "pular para a compra").
// Ninguém além de SmoothScrollProvider deve chamar setLenisInstance.
let instance: Lenis | null = null;

export function setLenisInstance(lenis: Lenis | null) {
  instance = lenis;
}

export function scrollToTarget(target: string | HTMLElement, offset = 0) {
  if (instance) {
    instance.scrollTo(target, { offset, duration: 1.4 });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: 'smooth' });
}

export function scrollToPosition(top: number) {
  if (instance) {
    instance.scrollTo(top, { duration: 1.4 });
    return;
  }
  window.scrollTo({ top, behavior: 'smooth' });
}
