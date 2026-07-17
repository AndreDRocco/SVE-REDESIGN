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
  const sceneRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoLayerRef = useRef<HTMLDivElement>(null);

  useGsapContext(sectionRef, () => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Entrada: o cenário "acorda" em camadas e o texto sobe em cascata.
    if (!reducedMotion) {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .from(`.${styles.layer}`, { opacity: 0, duration: 1.2, stagger: 0.08 }, 0)
        .from(
          contentRef.current ? Array.from(contentRef.current.children) : [],
          { y: 48, opacity: 0, duration: 1, stagger: 0.12 },
          0.35
        )
        .from(`.${styles.scrollCue}`, { opacity: 0, y: -12, duration: 0.8 }, 1);
    }

    // Parallax de scroll: cada camada se move a uma velocidade diferente
    // enquanto o hero passa pela viewport (efeito de profundidade real).
    const layers = gsap.utils.toArray<HTMLElement>('[data-parallax]', section);
    layers.forEach((el) => {
      const speed = parseFloat(el.dataset.speed ?? '0.1');
      gsap.to(el, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    // Zoom cinematográfico no vídeo: aproxima devagar conforme o scroll desce.
    if (videoLayerRef.current) {
      gsap.fromTo(
        videoLayerRef.current,
        { scale: 1 },
        {
          scale: 1.18,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
        }
      );
    }

    // O texto sai mais rápido que o cenário e some — reforça a profundidade.
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        yPercent: -35,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: '55% top', scrub: true },
      });
    }
  });

  useEffect(() => {
    const section = sectionRef.current;
    const scene = sceneRef.current;
    if (!section || !scene) return;

    const canHover = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reducedMotion) return;

    // Parallax de mouse: as camadas deslizam em profundidades diferentes e o
    // cenário inteiro ganha um tilt 3D sutil — reforço antes do primeiro scroll.
    const setters = gsap.utils.toArray<HTMLElement>('[data-parallax]', section).map((el) => ({
      depth: parseFloat(el.dataset.depth ?? '0'),
      x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }),
    }));

    const tiltX = gsap.quickTo(scene, 'rotationY', { duration: 1.1, ease: 'power3.out' });
    const tiltY = gsap.quickTo(scene, 'rotationX', { duration: 1.1, ease: 'power3.out' });

    const handleMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const relX = (e.clientX / innerWidth - 0.5) * 2;
      const relY = (e.clientY / innerHeight - 0.5) * 2;
      setters.forEach(({ depth, x, y }) => {
        x(relX * depth * 2.4);
        y(relY * depth * 1.2);
      });
      tiltX(relX * 1.6);
      tiltY(relY * -1.4);
    };

    const handleLeave = () => {
      setters.forEach(({ x, y }) => {
        x(0);
        y(0);
      });
      tiltX(0);
      tiltY(0);
    };

    section.addEventListener('mousemove', handleMove);
    section.addEventListener('mouseleave', handleLeave);
    return () => {
      section.removeEventListener('mousemove', handleMove);
      section.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <section ref={sectionRef} id="top" className={styles.hero}>
      <div ref={sceneRef} className={styles.scene}>
        <div className={`${styles.layer} ${styles.sky}`} data-parallax data-speed="0.12" data-depth="4" />
        <div className={`${styles.layer} ${styles.clouds}`} data-parallax data-speed="0.28" data-depth="9" />
        <div ref={videoLayerRef} className={styles.layer} data-parallax data-speed="0.38" data-depth="6">
          {/* Vídeo placeholder (trem a vapor na floresta, Wikimedia Commons,
              licença livre) — trocar pelo vídeo real da campanha SVE.
              Fallback para foto oficial do site atual se o vídeo não carregar. */}
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="https://serraverdeexpress.com.br/uploads/0000/1/2024/03/01/banner-topo-vagoes-sve.jpg"
            className={styles.photo}
          >
            <source
              src="https://upload.wikimedia.org/wikipedia/commons/transcoded/f/fb/Sonderfahrt_mit_dem_Dampfzug_im_Herbst_durch_das_Erzgebirge2H1A1447.webm/Sonderfahrt_mit_dem_Dampfzug_im_Herbst_durch_das_Erzgebirge2H1A1447.webm.480p.vp9.webm"
              type="video/webm"
            />
          </video>
        </div>
        <div className={`${styles.layer} ${styles.mountainsFar}`} data-parallax data-speed="0.5" data-depth="8" />
        <div className={`${styles.layer} ${styles.mountainsNear}`} data-parallax data-speed="0.68" data-depth="13" />
        <div className={styles.layer} data-parallax data-speed="0.82" data-depth="18">
          <div className={styles.trainSilhouette} />
          <div className={styles.trackWrap}>
            <div className={styles.track} />
          </div>
        </div>
        <div className={`${styles.layer} ${styles.fog}`} data-parallax data-speed="0.95" data-depth="24" />
      </div>

      <div ref={contentRef} className={styles.content}>
        <p className="text-sm uppercase tracking-[0.3em] text-sunset-light">Curitiba → Morretes</p>
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
