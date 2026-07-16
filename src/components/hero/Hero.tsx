'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsapContext } from '@/lib/scroll/useGsapContext';
import { scrollToTarget } from '@/lib/scroll/lenis';
import styles from './Hero.module.scss';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGsapContext(sectionRef, () => {
    if (!sectionRef.current) return;

    // Parallax de scroll: cada camada se move a uma velocidade diferente
    // enquanto o hero passa pela viewport (efeito de profundidade real).
    const layers = gsap.utils.toArray<HTMLElement>('[data-parallax]', sectionRef.current);
    layers.forEach((el) => {
      const speed = parseFloat(el.dataset.speed ?? '0.1');
      gsap.to(el, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const canHover = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reducedMotion) return;

    // Parallax de mouse sutil, só como reforço de profundidade antes do
    // usuário rolar — nunca é a única forma de ver o conteúdo.
    const setters = gsap.utils
      .toArray<HTMLElement>('[data-parallax]', section)
      .map((el) => ({
        el,
        depth: parseFloat(el.dataset.depth ?? '0'),
        x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' }),
      }));

    const handleMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const relX = (e.clientX / innerWidth - 0.5) * 2;
      const relY = (e.clientY / innerHeight - 0.5) * 2;
      setters.forEach(({ depth, x, y }) => {
        x(relX * depth);
        y(relY * depth * 0.5);
      });
    };

    section.addEventListener('mousemove', handleMove);
    return () => section.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <section ref={sectionRef} id="top" className={styles.hero}>
      <div className={`${styles.layer} ${styles.sky}`} data-parallax data-speed="0.15" data-depth="4" />
      <div className={`${styles.layer} ${styles.clouds}`} data-parallax data-speed="0.25" data-depth="8" />
      <div className={`${styles.layer} ${styles.mountainsFar}`} data-parallax data-speed="0.35" data-depth="6" />
      <div className={`${styles.layer} ${styles.mountainsNear}`} data-parallax data-speed="0.5" data-depth="10" />
      <div className={styles.layer} data-parallax data-speed="0.65" data-depth="14">
        <div className={styles.trainSilhouette} />
        <div className={styles.trackWrap}>
          <div className={styles.track} />
        </div>
      </div>
      <div className={`${styles.layer} ${styles.fog}`} data-parallax data-speed="0.8" data-depth="18" />

      <div className={styles.content}>
        <p className="text-sm uppercase tracking-[0.3em] text-gold">Curitiba → Morretes</p>
        <h1 className={styles.heading}>O trem antes do trem começa aqui.</h1>
        <p className="max-w-md text-mist-dim">
          Role a página e viva o trajeto pela Serra do Mar antes mesmo de embarcar: viadutos, túneis e o mirante
          sobre o Vale do Rio Sagrado.
        </p>
        <button
          type="button"
          data-cursor="hover"
          onClick={() => scrollToTarget('#trajeto', -88)}
          className="w-fit rounded-full bg-sunset px-7 py-3 font-semibold text-forest-deep transition-transform hover:scale-105"
        >
          Viva a viagem
        </button>
      </div>

      <span className={styles.scrollCue}>role para explorar</span>
    </section>
  );
}
