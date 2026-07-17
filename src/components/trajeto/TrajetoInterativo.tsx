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

const BOOKING_URL = 'https://serraverdeexpress.com.br/booking';
// Distância de scroll dedicada a cada parada dentro do pin.
const SCROLL_PER_STOP = 750;

// Locomotiva simplificada (vista lateral) — fica fixa no centro da tela; é o
// mundo (cubos de fotos + trilho) que desliza por baixo dela.
function TrainGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M5 4h9a5 5 0 0 1 5 5v6h1a1 1 0 1 1 0 2h-1.35a3.5 3.5 0 0 1-6.3 0h-2.7a3.5 3.5 0 0 1-6.3 0H3a1 1 0 0 1-1-1V6a2 2 0 0 1 2-2h1Zm1 3v4h5V7H6Zm8 0v4h3.9A3 3 0 0 0 14 7ZM6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </svg>
  );
}

// HERO do site: seção pinada onde o trem fica parado no centro da tela e o
// trilho + cubos 3D com fotos reais de cada parada deslizam por baixo dele
// conforme o usuário rola. O cubo que cruza o centro gira revelando as fotos
// daquele trecho (3 fotos + 1 face de informação, caixa fechada de 4 faces).
// Sem JS ou com prefers-reduced-motion, vira uma faixa horizontal rolável
// com os cubos parados na primeira foto.
export default function TrajetoInterativo() {
  const sectionRef = useRef<HTMLElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const drumRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stRef = useRef<ScrollTrigger | null>(null);
  const activeRef = useRef(-1);
  const { unlock } = useAchievements();

  useGsapContext(sectionRef, () => {
    const section = sectionRef.current;
    const area = areaRef.current;
    const row = rowRef.current;
    if (!section || !area || !row) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    section.classList.add(styles.pinned);

    const stages = gsap.utils.toArray<HTMLElement>(`.${styles.stage}`, row);
    const dots = gsap.utils.toArray<HTMLElement>(`.${styles.railStop}`, section);
    const N = stages.length;
    if (N === 0) return;

    // Centros reais de cada cubo, lidos do layout (offsetLeft é relativo ao
    // .row, que é position:relative) — nada de parsear strings de CSS, então
    // não há como produzir NaN e travar o transform silenciosamente.
    const centers: number[] = [];
    let areaCenter = 0;
    const measure = () => {
      centers.length = 0;
      stages.forEach((el) => centers.push(el.offsetLeft + el.offsetWidth / 2));
      areaCenter = area.offsetWidth / 2;
    };
    measure();

    const setX = gsap.quickSetter(row, 'x', 'px');

    stRef.current = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${(N - 1) * SCROLL_PER_STOP}`,
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onRefresh: measure,
      onUpdate: (self) => {
        // f = posição contínua do "foco" em unidades de parada (0 → N-1).
        const f = self.progress * (N - 1);
        const i0 = Math.min(N - 2, Math.max(0, Math.floor(f)));
        const frac = Math.min(1, Math.max(0, f - i0));
        const focusCenter = centers[i0] + (centers[i0 + 1] - centers[i0]) * frac;
        const x = areaCenter - focusCenter;
        if (Number.isFinite(x)) setX(x);

        // Estações do trilho acendem conforme o foco as ultrapassa.
        dots.forEach((dot, i) => dot.classList.toggle(styles.reached, f >= i - 0.05));

        // O cubo gira uma volta completa (4 faces de 90°) enquanto atravessa a
        // janela central; fora dela fica acomodado numa face plana.
        stages.forEach((_, i) => {
          const drum = drumRefs.current[i];
          if (!drum) return;
          const local = Math.min(1, Math.max(0, f - i + 0.5));
          drum.style.transform = `rotateY(${-local * 360}deg)`;
        });

        const active = Math.round(f);
        if (active !== activeRef.current) {
          activeRef.current = active;
          stages.forEach((el, i) => el.classList.toggle(styles.active, i === active));
          if (active === N - 1) unlock('explorador-da-serra');
        }
      },
    });

    return () => {
      stRef.current = null;
      section.classList.remove(styles.pinned);
    };
  });

  // Clicar num cubo leva o scroll (e o trem) até a parada correspondente.
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
    <section ref={sectionRef} id="top" className={styles.section}>
      <div className={styles.intro}>
        <p className={styles.eyebrow}>Curitiba → Morretes · parada a parada</p>
        <h1 className={styles.heading}>O trem antes do trem começa aqui.</h1>
      </div>

      <div ref={areaRef} className={styles.stageArea}>
        <div className={styles.railTrack} aria-hidden>
          {trajeto.map((parada, index) => (
            <span
              key={parada.slug}
              className={styles.railStop}
              style={{ left: `${(index / (trajeto.length - 1)) * 100}%` }}
            />
          ))}
        </div>

        {/* Trem fixo no centro: é o marco visual que nunca se move — o mundo
            desliza por baixo dele, dando a sensação de avanço contínuo. */}
        <div className={styles.centerTrain} aria-hidden>
          <span className={styles.smoke} />
          <span className={styles.smoke} />
          <span className={styles.smoke} />
          <div className={styles.trainBadge}>
            <TrainGlyph />
          </div>
        </div>

        <div ref={rowRef} className={styles.row}>
          {trajeto.map((parada, index) => (
            <div key={parada.slug} className={styles.stage} data-scrollytelling>
              <button
                type="button"
                data-cursor="hover"
                className={styles.cubeButton}
                onClick={() => goToStop(index)}
                aria-label={`Ir para ${parada.nome}`}
              >
                <div className={styles.cubeViewport}>
                  <div
                    ref={(el) => {
                      drumRefs.current[index] = el;
                    }}
                    className={styles.cubeDrum}
                  >
                    {parada.imagens.slice(0, 3).map((img, faceIndex) => (
                      <div
                        key={img + faceIndex}
                        className={styles.cubeFace}
                        style={{
                          transform: `rotateY(${faceIndex * 90}deg) translateZ(var(--cube-radius))`,
                          backgroundImage: `url(${img})`,
                        }}
                      />
                    ))}
                    {/* 4ª face: cartão de informação — fecha a caixa 3D e dá
                        respiro visual entre as fotos durante o giro. */}
                    <div
                      className={`${styles.cubeFace} ${styles.cubeFaceInfo}`}
                      style={{ transform: 'rotateY(270deg) translateZ(var(--cube-radius))' }}
                    >
                      <span>km {parada.kmPercurso}</span>
                      <strong>{parada.nome}</strong>
                    </div>
                  </div>
                </div>
              </button>

              <span className={styles.stopNumber}>
                Parada {String(index + 1).padStart(2, '0')} · km {parada.kmPercurso}
              </span>
              <h2 id={`parada-${parada.slug}`} className={styles.stopName}>
                {parada.nome}
              </h2>
              <p className={styles.stopDesc}>{parada.descricaoCurta}</p>
            </div>
          ))}
        </div>
      </div>

      <p className={styles.hint}>Role para acompanhar o trem — ou clique num cubo para ir direto até ele.</p>

      <a href={BOOKING_URL} data-cursor="hover" className={styles.floatingCta}>
        Reservar agora
      </a>
    </section>
  );
}
