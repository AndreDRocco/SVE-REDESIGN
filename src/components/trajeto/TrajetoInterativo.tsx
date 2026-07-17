'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsapContext } from '@/lib/scroll/useGsapContext';
import { scrollToTarget } from '@/lib/scroll/lenis';
import { useAchievements } from '@/lib/achievements/AchievementsProvider';
import { trajeto } from '@/lib/data/trajeto';
import styles from './TrajetoInterativo.module.scss';

gsap.registerPlugin(ScrollTrigger);

// Locomotiva simplificada (vista lateral) usada no marcador que desce o trilho.
function TrainGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M5 4h9a5 5 0 0 1 5 5v6h1a1 1 0 1 1 0 2h-1.35a3.5 3.5 0 0 1-6.3 0h-2.7a3.5 3.5 0 0 1-6.3 0H3a1 1 0 0 1-1-1V6a2 2 0 0 1 2-2h1Zm1 3v4h5V7H6Zm8 0v4h3.9A3 3 0 0 0 14 7ZM6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </svg>
  );
}

export default function TrajetoInterativo() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const railFillRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const { unlock } = useAchievements();

  useGsapContext(sectionRef, () => {
    if (!trackRef.current) return;

    // O trem e o preenchimento dourado do trilho seguem juntos o progresso do
    // scroll pela seção — o trem "constrói" o caminho conforme avança.
    ScrollTrigger.create({
      trigger: trackRef.current,
      start: 'top center',
      end: 'bottom center',
      scrub: true,
      onUpdate: (self) => {
        const pct = self.progress * 100;
        if (railFillRef.current) railFillRef.current.style.width = `${pct}%`;
        if (markerRef.current) markerRef.current.style.left = `${pct}%`;
      },
    });

    const stops = gsap.utils.toArray<HTMLElement>(`.${styles.stop}`, sectionRef.current ?? undefined);
    stops.forEach((stop, index) => {
      ScrollTrigger.create({
        trigger: stop,
        start: 'top 65%',
        end: 'bottom 35%',
        toggleClass: { targets: stop, className: styles.active },
        onEnter: () => {
          if (index === stops.length - 1) unlock('explorador-da-serra');
        },
      });
    });
  });

  return (
    <section ref={sectionRef} id="trajeto" className={styles.section}>
      <h2 className={styles.heading}>Curitiba → Morretes, parada a parada</h2>

      <div ref={trackRef} className={styles.track}>
        <div className={styles.rail} aria-hidden>
          <div ref={railFillRef} className={styles.railFill} />
          <div ref={markerRef} className={styles.trainMarker}>
            <span className={styles.smoke} />
            <span className={styles.smoke} />
            <span className={styles.smoke} />
            <TrainGlyph />
          </div>
        </div>

        {trajeto.map((parada, index) => (
          <div key={parada.slug} className={styles.stop} data-scrollytelling>
            <div className={styles.dot} />
            <button
              type="button"
              data-cursor="hover"
              className={styles.stopButton}
              onClick={() => scrollToTarget(`#parada-${parada.slug}`, -120)}
            >
              <span className={styles.stopNumber}>Parada {String(index + 1).padStart(2, '0')}</span>
              <h3 id={`parada-${parada.slug}`} className={styles.stopName}>
                {parada.nome}
              </h3>
              <p className={styles.stopDesc}>{parada.descricaoCurta}</p>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
