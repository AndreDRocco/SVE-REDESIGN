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
// (Curitiba → Morretes) + 1 fechando o circuito de volta a Curitiba.
const SCROLL_PER_LEG = 650;
const LEGS = trajeto.length; // 5 chegadas de ida (0..4) + retorno (n = 5)
const BG_MAX_OPACITY = 0.5;

// paradaAt(n): parada correspondente à chegada n do ciclo (n = 5 → Curitiba).
const paradaAt = (n: number) => trajeto[n % trajeto.length];

// Ângulo no circuito oval para a posição contínua f (0..5).
// Começa à esquerda (180°) e circula: esquerda → baixo → direita → cima →
// esquerda, fechando 360° ao fim das 5 pernas. (Tela tem y para baixo, então
// sin > 0 é a metade de baixo do oval.)
const angleFor = (f: number) => Math.PI - (f * 2 * Math.PI) / LEGS;

// Locomotiva simplificada (vista lateral) — viaja junto com o cubo.
function TrainGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M5 4h9a5 5 0 0 1 5 5v6h1a1 1 0 1 1 0 2h-1.35a3.5 3.5 0 0 1-6.3 0h-2.7a3.5 3.5 0 0 1-6.3 0H3a1 1 0 0 1-1-1V6a2 2 0 0 1 2-2h1Zm1 3v4h5V7H6Zm8 0v4h3.9A3 3 0 0 0 14 7ZM6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </svg>
  );
}

// HERO do site: um cubo 3D compacto viaja com o trem por um circuito oval
// dourado — Curitiba (esquerda) desce por baixo do oval até Morretes e volta
// por cima, fechando o ciclo. No centro do circuito ficam o nome da empresa
// e o CTA. As faces do cubo carregam apenas as informações de cada parada;
// a foto do trecho aparece no fundo, em tela cheia, com crossfade entre as
// paradas (o destino vai surgindo conforme o trem viaja até ele).
//
// Tudo deriva de um único valor f = progress * 5 (posição contínua no ciclo):
//   - posição (x, y) do cubo/trem sobre a elipse
//   - rotação do cubo (-f * 90°; a cada chegada, face plana)
//   - crossfade das duas camadas de foto do fundo
//   - estações acesas no circuito
// As 4 faces do cubo são reutilizadas: quando a chegada n muda, a face que
// está de perfil (invisível) recebe o conteúdo da próxima parada.
//
// Sem JS ou com prefers-reduced-motion, vira uma fileira horizontal rolável
// de cartões planos com as mesmas fotos e informações.
export default function TrajetoInterativo() {
  const sectionRef = useRef<HTMLElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const travellerRef = useRef<HTMLDivElement>(null);
  const drumRef = useRef<HTMLDivElement>(null);
  const bgARef = useRef<HTMLDivElement>(null);
  const bgBRef = useRef<HTMLDivElement>(null);
  const ovalOuterRef = useRef<SVGEllipseElement>(null);
  const ovalInnerRef = useRef<SVGEllipseElement>(null);
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
    const area = areaRef.current;
    const traveller = travellerRef.current;
    const drum = drumRef.current;
    const bgA = bgARef.current;
    const bgB = bgBRef.current;
    if (!section || !area || !traveller || !drum || !bgA || !bgB) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    section.classList.add(styles.pinned);

    const dots = gsap.utils.toArray<HTMLElement>(`.${styles.railStop}`, section);
    const bgLayers = [bgA, bgB];
    bgA.style.backgroundImage = `url(${paradaAt(0).imagens[0]})`;
    bgB.style.backgroundImage = `url(${paradaAt(1).imagens[0]})`;

    // Geometria do circuito, lida direto do layout (offsetWidth/offsetHeight,
    // nunca strings de CSS). Também desenha as elipses do trilho e posiciona
    // as estações — tudo a partir das mesmas medidas, então nada desalinha.
    const geo = { cx: 0, cy: 0, rx: 0, ry: 0, half: 0 };
    const measure = () => {
      geo.half = traveller.offsetWidth / 2;
      geo.cx = area.offsetWidth / 2;
      geo.cy = area.offsetHeight / 2;
      geo.rx = Math.max(60, geo.cx - geo.half - 8);
      geo.ry = Math.max(48, geo.cy - geo.half - 8);

      const outer = ovalOuterRef.current;
      const inner = ovalInnerRef.current;
      [outer, inner].forEach((el, i) => {
        if (!el) return;
        const inset = i * 7;
        el.setAttribute('cx', String(geo.cx));
        el.setAttribute('cy', String(geo.cy));
        el.setAttribute('rx', String(geo.rx - inset));
        el.setAttribute('ry', String(geo.ry - inset));
      });

      dots.forEach((dot, i) => {
        const theta = angleFor(i);
        dot.style.left = `${geo.cx + geo.rx * Math.cos(theta)}px`;
        dot.style.top = `${geo.cy + geo.ry * Math.sin(theta)}px`;
      });
    };
    measure();

    const setX = gsap.quickSetter(traveller, 'x', 'px');
    const setY = gsap.quickSetter(traveller, 'y', 'px');
    const setOpacityA = gsap.quickSetter(bgA, 'opacity');
    const setOpacityB = gsap.quickSetter(bgB, 'opacity');
    const setBgOpacity = [setOpacityA, setOpacityB];

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

        // Posição sobre o circuito oval (âncora = centro do cubo).
        const theta = angleFor(f);
        const x = geo.cx + geo.rx * Math.cos(theta) - geo.half;
        const y = geo.cy + geo.ry * Math.sin(theta) - geo.half;
        if (Number.isFinite(x) && Number.isFinite(y)) {
          setX(x);
          setY(y);
        }

        // Cubo gira 90° por perna; a cada chegada, face plana de frente.
        drum.style.transform = `rotateY(${-f * 90}deg)`;

        // Crossfade do fundo: durante a perna L, a foto da parada L (camada
        // L % 2) dá lugar à foto do destino L+1 (camada (L+1) % 2). As trocas
        // de imagem acontecem sempre na camada que está com opacidade zero.
        const leg = Math.min(LEGS - 1, Math.floor(f));
        const frac = Math.min(1, Math.max(0, f - leg));
        if (leg !== lastLegRef.current) {
          lastLegRef.current = leg;
          bgLayers[leg % 2].style.backgroundImage = `url(${paradaAt(leg).imagens[0]})`;
          bgLayers[(leg + 1) % 2].style.backgroundImage = `url(${paradaAt(leg + 1).imagens[0]})`;
        }
        setBgOpacity[leg % 2]((1 - frac) * BG_MAX_OPACITY);
        setBgOpacity[(leg + 1) % 2](frac * BG_MAX_OPACITY);

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
      {/* Fundo em tela cheia: duas camadas de foto em crossfade — imagens e
          opacidades 100% gerenciadas via refs para o React nunca sobrescrever
          os estilos aplicados pelo GSAP. */}
      <div ref={bgARef} className={styles.bgPhoto} aria-hidden />
      <div ref={bgBRef} className={styles.bgPhoto} aria-hidden />
      <div className={styles.bgOverlay} aria-hidden />

      <div ref={areaRef} className={styles.stageArea}>
        {/* Trilho oval dourado (desenhado via JS a partir das mesmas medidas
            que posicionam o cubo e as estações). */}
        <svg className={styles.ovalTrack} aria-hidden>
          <ellipse ref={ovalOuterRef} className={styles.ovalRailOuter} />
          <ellipse ref={ovalInnerRef} className={styles.ovalRailInner} />
        </svg>

        {trajeto.map((parada, index) => (
          <button
            key={parada.slug}
            type="button"
            data-cursor="hover"
            className={styles.railStop}
            onClick={() => goToArrival(index)}
            aria-label={`Ir para ${parada.nome}`}
          />
        ))}

        {/* Centro do circuito: nome da empresa + CTA. */}
        <div className={styles.centerIntro}>
          <p className={styles.eyebrow}>Curitiba → Morretes · ida e volta</p>
          <h1 className={styles.heading}>Serra Verde Express</h1>
          <a href={BOOKING_URL} data-cursor="hover" className={styles.heroCta}>
            Reservar agora
          </a>
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
                      style={{ transform: `rotateY(${k * 90}deg) translateZ(var(--cube-radius))` }}
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

      <p className={styles.hint}>Role para viajar o circuito — Curitiba a Morretes, ida e volta.</p>

      {/* Fallback estático (sem JS / reduced-motion): título simples +
          cartões planos roláveis com foto e informações. */}
      <div className={styles.fallbackIntro}>
        <p className={styles.eyebrow}>Curitiba → Morretes · ida e volta</p>
        <h1 className={styles.heading}>Serra Verde Express</h1>
        <a href={BOOKING_URL} data-cursor="hover" className={styles.heroCta}>
          Reservar agora
        </a>
      </div>
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
    </section>
  );
}
