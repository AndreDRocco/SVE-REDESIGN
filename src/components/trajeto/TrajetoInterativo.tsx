'use client';

import { useCallback, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsapContext } from '@/lib/scroll/useGsapContext';
import { scrollToPosition } from '@/lib/scroll/lenis';
import { useAchievements } from '@/lib/achievements/AchievementsProvider';
import { trajeto } from '@/lib/data/trajeto';
import styles from './TrajetoInterativo.module.scss';

gsap.registerPlugin(ScrollTrigger);

// Locomotiva simplificada (vista lateral) usada no marcador que percorre o trilho.
function TrainGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M5 4h9a5 5 0 0 1 5 5v6h1a1 1 0 1 1 0 2h-1.35a3.5 3.5 0 0 1-6.3 0h-2.7a3.5 3.5 0 0 1-6.3 0H3a1 1 0 0 1-1-1V6a2 2 0 0 1 2-2h1Zm1 3v4h5V7H6Zm8 0v4h3.9A3 3 0 0 0 14 7ZM6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </svg>
  );
}

// Seção pinada: enquanto o usuário rola, o trem atravessa o trilho (sempre
// visível) e os cards das paradas deslizam na horizontal em sincronia.
// Sem JS ou com prefers-reduced-motion, vira uma faixa horizontal rolável.
export default function TrajetoInterativo() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const railFillRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const activeRef = useRef(-1);
  const { unlock } = useAchievements();

  useGsapContext(sectionRef, () => {
    const section = sectionRef.current;
    const row = rowRef.current;
    if (!section || !row) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    section.classList.add(styles.pinned);

    const stops = gsap.utils.toArray<HTMLElement>(`.${styles.stop}`, row);
    const dots = gsap.utils.toArray<HTMLElement>(`.${styles.railStop}`, section);
    const distance = () => Math.max(0, row.scrollWidth - row.offsetWidth);

    stRef.current = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${Math.max(900, distance() + window.innerHeight * 0.4)}`,
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        const pct = p * 100;
        if (railFillRef.current) railFillRef.current.style.width = `${pct}%`;
        if (markerRef.current) markerRef.current.style.left = `${pct}%`;
        gsap.set(row, { x: -p * distance() });

        // Estações acendem quando o trem passa pela quilometragem delas.
        dots.forEach((dot, i) => dot.classList.toggle(styles.reached, trajeto[i].kmPercurso <= pct + 1));

        const active = Math.min(trajeto.length - 1, Math.round(p * (trajeto.length - 1)));
        if (active !== activeRef.current) {
          activeRef.current = active;
          stops.forEach((el, i) => el.classList.toggle(styles.active, i === active));
          if (active === trajeto.length - 1) unlock('explorador-da-serra');
        }
      },
    });

    return () => {
      stRef.current = null;
      section.classList.remove(styles.pinned);
    };
  });

  // Clicar numa parada leva o scroll (e o trem) até o ponto correspondente.
  const goToStop = useCallback((index: number) => {
    const st = stRef.current;
    if (!st) {
      document
        .getElementById(`parada-${trajeto[index].slug}`)
        ?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      return;
    }
    scrollToPosition(st.start + ((st.end - st.start) * index) / (trajeto.length - 1));
  }, []);

  return (
    <section ref={sectionRef} id="trajeto" className={styles.section}>
      <h2 className={styles.heading}>Curitiba → Morretes, parada a parada</h2>

      <div className={styles.railArea} aria-hidden>
        <div className={styles.rail}>
          <div ref={railFillRef} className={styles.railFill} />
          {trajeto.map((parada, index) => (
            <button
              key={parada.slug}
              type="button"
              tabIndex={-1}
              data-cursor="hover"
              className={styles.railStop}
              style={{ left: `${parada.kmPercurso}%` }}
              onClick={() => goToStop(index)}
            />
          ))}
          <div ref={markerRef} className={styles.trainMarker}>
            <span className={styles.smoke} />
            <span className={styles.smoke} />
            <span className={styles.smoke} />
            <TrainGlyph />
          </div>
        </div>
      </div>

      <div ref={rowRef} className={styles.row}>
        {trajeto.map((parada, index) => (
          <div key={parada.slug} className={styles.stop} data-scrollytelling>
            <button type="button" data-cursor="hover" className={styles.stopButton} onClick={() => goToStop(index)}>
              <span className={styles.stopNumber}>
                Parada {String(index + 1).padStart(2, '0')} · km {parada.kmPercurso}
              </span>
              <h3 id={`parada-${parada.slug}`} className={styles.stopName}>
                {parada.nome}
              </h3>
              <p className={styles.stopDesc}>{parada.descricaoCurta}</p>
            </button>
          </div>
        ))}
      </div>

      <p className={styles.hint}>Role para acompanhar o trem — ou clique numa estação para ir direto até ela.</p>
    </section>
  );
}
