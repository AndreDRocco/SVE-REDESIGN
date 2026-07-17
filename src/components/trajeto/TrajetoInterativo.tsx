'use client';

import { useCallback, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsapContext } from '@/lib/scroll/useGsapContext';
import { scrollToPosition } from '@/lib/scroll/lenis';
import { useAchievements } from '@/lib/achievements/AchievementsProvider';
import { trajeto } from '@/lib/data/trajeto';
import styles from './TrajetoInterativo.module.scss';

gsap.registerPlugin(ScrollTrigger);

const BOOKING_URL = 'https://serraverdeexpress.com.br/booking';
// Distância de scroll por perna da viagem. São 5 pernas: 4 de ida
// (Curitiba → Morretes) + 1 de volta expressa (Morretes → Curitiba).
const SCROLL_PER_LEG = 700;
const LEGS = trajeto.length; // 5 chegadas de ida (0..4) + retorno (n = 5)

// paradaAt(n): parada correspondente à chegada n do ciclo (n = 5 → Curitiba).
const paradaAt = (n: number) => trajeto[n % trajeto.length];

// Locomotiva simplificada (vista lateral) — viaja junto com o cubo.
function TrainGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M5 4h9a5 5 0 0 1 5 5v6h1a1 1 0 1 1 0 2h-1.35a3.5 3.5 0 0 1-6.3 0h-2.7a3.5 3.5 0 0 1-6.3 0H3a1 1 0 0 1-1-1V6a2 2 0 0 1 2-2h1Zm1 3v4h5V7H6Zm8 0v4h3.9A3 3 0 0 0 14 7ZM6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </svg>
  );
}

// HERO do site: um único cubo 3D viaja o trilho com o trem, parada a parada,
// num ciclo de ida e volta (Curitiba → Morretes → Curitiba). Durante cada
// perna, o fundo em tela cheia mostra a foto do destino; na chegada ela some
// exatamente enquanto a face do cubo com a mesma foto gira para a frente —
// a foto "pousa" no cubo, junto com as informações da parada.
//
// Tudo deriva de um único valor f = progress * 5 (posição contínua no ciclo):
//   - posição x do cubo/trem no trilho (ida 0→4, volta 4→5 deslizando de volta)
//   - rotação do cubo (-f * 90°; a cada chegada, face plana)
//   - opacidade/zoom do fundo (sin(π·frac): zera nas chegadas, pico no meio)
//   - estações acesas no trilho
// As 4 faces do cubo são reutilizadas: quando a chegada n muda, a face que
// está de perfil (invisível) recebe o conteúdo da próxima parada.
//
// Sem JS ou com prefers-reduced-motion, vira uma fileira horizontal rolável
// de cartões planos com as mesmas fotos e informações.
export default function TrajetoInterativo() {
  const sectionRef = useRef<HTMLElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const travellerRef = useRef<HTMLDivElement>(null);
  const drumRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const lastNRef = useRef(0);
  const lastLegRef = useRef(-1);
  const unlockedRef = useRef(false);
  const { unlock } = useAchievements();

  // faceMap[k] = chegada n cujo conteúdo está na face k do cubo (n = 0..5).
  // A face k fica de frente quando n % 4 === k, então a troca de conteúdo
  // acontece sempre com a face escondida/de perfil — sem "pulo" visual.
  const [faceMap, setFaceMap] = useState<number[]>([0, 1, 2, 3]);

  useGsapContext(sectionRef, () => {
    const section = sectionRef.current;
    const rail = railRef.current;
    const traveller = travellerRef.current;
    const drum = drumRef.current;
    const bg = bgRef.current;
    if (!section || !rail || !traveller || !drum || !bg) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    section.classList.add(styles.pinned);

    const dots = gsap.utils.toArray<HTMLElement>(`.${styles.railStop}`, section);

    // Medidas lidas direto do layout (offsetLeft/offsetWidth) — nunca de
    // strings de CSS, que já produziram NaN e travaram o transform num bug
    // anterior desta seção.
    const m = { railLeft: 0, railWidth: 0, travellerHalf: 0 };
    const measure = () => {
      m.railLeft = rail.offsetLeft;
      m.railWidth = rail.offsetWidth;
      m.travellerHalf = traveller.offsetWidth / 2;
    };
    measure();

    const setX = gsap.quickSetter(traveller, 'x', 'px');
    const setBgOpacity = gsap.quickSetter(bg, 'opacity');
    const setBgScale = gsap.quickSetter(bg, 'scale');

    stRef.current = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${LEGS * SCROLL_PER_LEG}`,
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onRefresh: measure,
      onUpdate: (self) => {
        const f = self.progress * LEGS; // 0 → 5 (posição contínua no ciclo)

        // Posição no trilho: ida linear (0→4); volta expressa (4→5 desliza
        // de Morretes de volta até Curitiba).
        const pos = f <= 4 ? f : 4 - (f - 4) * 4;
        const x = m.railLeft + m.railWidth * (pos / 4) - m.travellerHalf;
        if (Number.isFinite(x)) setX(x);

        // Cubo gira 90° por perna; a cada chegada, face plana de frente.
        drum.style.transform = `rotateY(${-f * 90}deg)`;

        // Fundo = foto do destino da perna atual. Troca de foto só acontece
        // na fronteira da perna, quando a opacidade está em zero.
        const leg = Math.min(LEGS - 1, Math.floor(f));
        const frac = Math.min(1, Math.max(0, f - leg));
        if (leg !== lastLegRef.current) {
          lastLegRef.current = leg;
          bg.style.backgroundImage = `url(${paradaAt(leg + 1).imagens[0]})`;
        }
        setBgOpacity(Math.sin(Math.PI * frac) * 0.5);
        setBgScale(1.15 - 0.15 * frac);

        // Estações acendem quando o trem passa; na volta, seguem acesas.
        dots.forEach((dot, i) => dot.classList.toggle(styles.reached, f >= i - 0.02));

        // Troca de conteúdo das faces escondidas quando a chegada muda.
        const n = Math.round(f);
        if (n !== lastNRef.current) {
          lastNRef.current = n;
          setFaceMap((prev) => {
            const next = [...prev];
            for (const d of [-1, 0, 1]) {
              const arrival = Math.min(LEGS, Math.max(0, n + d));
              next[arrival % 4] = arrival;
            }
            return next.every((v, k) => v === prev[k]) ? prev : next;
          });
        }

        if (!unlockedRef.current && f >= 3.95) {
          unlockedRef.current = true;
          unlock('explorador-da-serra');
        }
      },
    });

    return () => {
      stRef.current = null;
      section.classList.remove(styles.pinned);
    };
  });

  // Leva o scroll (e o trem) até a chegada m do ciclo (0..5).
  const goToArrival = useCallback((arrival: number) => {
    const st = stRef.current;
    if (!st) return;
    scrollToPosition(st.start + ((st.end - st.start) * arrival) / LEGS);
  }, []);

  const nextStop = useCallback(() => {
    const st = stRef.current;
    if (!st) return;
    const f = st.progress * LEGS;
    goToArrival(Math.min(LEGS, Math.round(f) + 1));
  }, [goToArrival]);

  return (
    <section ref={sectionRef} id="top" className={styles.section}>
      {/* Fundo em tela cheia com a foto do destino da perna atual — 100%
          gerenciado via refs (imagem, opacidade e zoom) para o React nunca
          sobrescrever os estilos aplicados pelo GSAP. */}
      <div ref={bgRef} className={styles.bgPhoto} aria-hidden />
      <div className={styles.bgOverlay} aria-hidden />

      <div className={styles.intro}>
        <p className={styles.eyebrow}>Curitiba → Morretes · ida e volta</p>
        <h1 className={styles.heading}>O trem antes do trem começa aqui.</h1>
      </div>

      <div ref={areaRef} className={styles.stageArea}>
        <div ref={railRef} className={styles.railTrack}>
          {trajeto.map((parada, index) => (
            <button
              key={parada.slug}
              type="button"
              data-cursor="hover"
              className={styles.railStop}
              style={{ left: `${(index / (trajeto.length - 1)) * 100}%` }}
              onClick={() => goToArrival(index)}
              aria-label={`Ir para ${parada.nome}`}
            />
          ))}
        </div>

        {/* Cubo + trem viajam juntos: um único transform move os dois. */}
        <div ref={travellerRef} className={styles.traveller}>
          <button
            type="button"
            data-cursor="hover"
            className={styles.cubeButton}
            onClick={nextStop}
            aria-label="Avançar para a próxima parada"
          >
            <div className={styles.cubeViewport}>
              <div ref={drumRef} className={styles.cubeDrum}>
                {faceMap.map((arrival, k) => {
                  const parada = paradaAt(arrival);
                  return (
                    <div
                      key={k}
                      className={styles.cubeFace}
                      style={{
                        transform: `rotateY(${k * 90}deg) translateZ(var(--cube-radius))`,
                        backgroundImage: `linear-gradient(180deg, rgba(8, 20, 16, 0) 38%, rgba(8, 20, 16, 0.88) 100%), url(${parada.imagens[0]})`,
                      }}
                    >
                      <span className={styles.faceKm}>
                        Parada {String((arrival % trajeto.length) + 1).padStart(2, '0')} · km {parada.kmPercurso}
                      </span>
                      <strong className={styles.faceName}>{parada.nome}</strong>
                      <p className={styles.faceDesc}>{parada.descricaoCurta}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </button>

          <div className={styles.badgeWrap} aria-hidden>
            <span className={styles.smoke} />
            <span className={styles.smoke} />
            <span className={styles.smoke} />
            <div className={styles.trainBadge}>
              <TrainGlyph />
            </div>
          </div>
        </div>
      </div>

      <p className={styles.hint}>Role para viajar — Curitiba a Morretes, ida e volta.</p>

      {/* Fallback estático (sem JS / reduced-motion): cartões planos roláveis. */}
      <div className={styles.fallbackRow}>
        {trajeto.map((parada, index) => (
          <article key={parada.slug} id={`parada-${parada.slug}`} className={styles.fallbackCard}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={parada.imagens[0]} alt="" loading="lazy" />
            <span className={styles.faceKm}>
              Parada {String(index + 1).padStart(2, '0')} · km {parada.kmPercurso}
            </span>
            <strong className={styles.faceName}>{parada.nome}</strong>
            <p className={styles.faceDesc}>{parada.descricaoCurta}</p>
          </article>
        ))}
      </div>

      <a href={BOOKING_URL} data-cursor="hover" className={styles.floatingCta}>
        Reservar agora
      </a>
    </section>
  );
}
