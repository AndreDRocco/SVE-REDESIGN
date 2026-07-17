'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsapContext } from '@/lib/scroll/useGsapContext';
import styles from './JanelaPOV.module.scss';

gsap.registerPlugin(ScrollTrigger);

const CDN = 'https://serraverdeexpress.com.br/uploads';

// Fotos oficiais publicadas em serraverdeexpress.com.br — cada uma conferida
// visualmente antes de entrar aqui (a leva anterior tinha uma foto de mesa de
// comida e um jipe atolando no lugar de paisagem — nunca tinha sido olhada de
// verdade, só assumida pelo nome do arquivo). Trocar por vídeo POV real da
// janela quando o material existir.
const SCENES = [
  {
    id: 'partida',
    legenda: 'A tripulação prepara o embarque em Curitiba',
    img: `${CDN}/0000/1/2024/02/05/blog-trem-republicano.jpg`,
  },
  {
    id: 'viaduto',
    legenda: 'O trem avança pelos viadutos suspensos sobre o vale',
    img: `${CDN}/0000/1/2024/02/05/blog-trilhos-trem-brasil-1.jpg`,
  },
  {
    id: 'por-do-sol-janela',
    legenda: 'O pôr do sol emoldurado pela janela do vagão',
    img: `${CDN}/0000/37/2025/02/19/whatsapp-image-2025-02-19-at-173139.jpeg`,
  },
  {
    id: 'por-do-sol-trem',
    legenda: 'O sol se despede enquanto a serra escurece',
    img: `${CDN}/0000/1/2024/02/06/passeio-por-do-sol-1.jpg`,
  },
  {
    id: 'morretes',
    legenda: 'Morretes esperando no fim da linha',
    img: `${CDN}/0000/1/2024/02/08/pacote-morretes-com-almoco.jpg`,
  },
];

// Scroll-jacking deliberadamente curto (~150vh) e só ativado fora de
// prefers-reduced-motion — fora disso, as cenas ficam empilhadas e
// acessíveis normalmente (ver .scenesStatic no módulo de estilo).
export default function JanelaPOV() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = muted;
    // O <audio> nunca tocava sozinho (faltava o play() — muted só controla o
    // volume, não inicia a reprodução). Precisa do play() dentro do gesto do
    // usuário (o clique no botão), senão o navegador bloqueia o autoplay.
    if (!muted) {
      audio.play().catch(() => {
        // Autoplay bloqueado (raro, já que partiu de um clique) — o botão
        // simplesmente continua mostrando "Ativar som ambiente".
      });
    } else {
      audio.pause();
    }
  }, [muted]);

  useGsapContext(sectionRef, () => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    // Troca de layout ANTES de criar o ScrollTrigger, via classList direto —
    // não por estado do React. Se fosse useState, o ScrollTrigger.create
    // mediria a seção AINDA no layout estático (bem mais alto, cenas
    // empilhadas), e um refresh() só rodaria depois do re-render — nessa
    // janela, o pin calcula a posição/altura erradas e a rolagem trava no
    // meio do caminho (era exatamente esse o bug relatado: scroll não
    // avançava e só metade das cenas ficava visível).
    viewport.classList.remove(styles.scenesStatic);
    viewport.classList.add(styles.pinnedMode);

    const scenes = gsap.utils.toArray<HTMLElement>(`.${styles.scene}`, viewport);
    gsap.set(scenes[0], { opacity: 1 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=800',
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const activeIndex = Math.min(scenes.length - 1, Math.floor(self.progress * scenes.length));
        scenes.forEach((scene, i) => {
          gsap.to(scene, { opacity: i === activeIndex ? 1 : 0, duration: 0.3, overwrite: 'auto' });
        });
      },
    });
  });

  return (
    <section ref={sectionRef} id="dentro-do-trem" className={styles.section}>
      <h2 className={styles.heading}>Dentro do trem, a janela conta a história</h2>

      <div className={styles.frameOuter}>
        <div ref={viewportRef} className={`${styles.viewport} ${styles.scenesStatic}`}>
          {SCENES.map((scene) => (
            <div
              key={scene.id}
              className={styles.scene}
              style={{ backgroundImage: `url(${scene.img})` }}
              data-scrollytelling
            >
              <span className={styles.sceneCaption}>{scene.legenda}</span>
            </div>
          ))}
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            data-cursor="hover"
            onClick={() => setMuted((m) => !m)}
            aria-pressed={!muted}
            className={styles.muteButton}
          >
            {muted ? 'Ativar som ambiente' : 'Silenciar'}
          </button>
        </div>

        {/* Som ambiente de trem em movimento (Wikimedia Commons, licença livre)
            — trocar pelo áudio oficial gravado a bordo quando existir.
            preload="none": só baixa quando o usuário efetivamente ativa. */}
        <audio ref={audioRef} loop muted={muted} preload="none" aria-hidden>
          <source
            src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Sound_of_a_MoHa_201_series_electric_multiple_unit_train_on_the_Ch%C5%AB%C5%8D_Main_Line_%28Ochanomizu%E2%80%93Yotsuya%29%2C_Tokyo%2C_Japan_-_20101010.ogg"
            type="audio/ogg"
          />
        </audio>
      </div>
    </section>
  );
}
