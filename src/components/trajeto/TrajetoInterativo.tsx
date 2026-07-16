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

export default function TrajetoInterativo() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const railFillRef = useRef<HTMLDivElement>(null);
  const { unlock } = useAchievements();

  useGsapContext(sectionRef, () => {
    if (!trackRef.current || !railFillRef.current) return;

    ScrollTrigger.create({
      trigger: trackRef.current,
      start: 'top center',
      end: 'bottom center',
      scrub: true,
      onUpdate: (self) => {
        if (railFillRef.current) railFillRef.current.style.height = `${self.progress * 100}%`;
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
        <div className={styles.rail}>
          <div ref={railFillRef} className={styles.railFill} />
        </div>

        {trajeto.map((parada) => (
          <div key={parada.slug} className={styles.stop} data-scrollytelling>
            <div className={styles.dot} />
            <button
              type="button"
              data-cursor="hover"
              className={styles.stopButton}
              onClick={() => scrollToTarget(`#parada-${parada.slug}`, -88)}
            >
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
