'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsapContext } from '@/lib/scroll/useGsapContext';
import styles from './JanelaPOV.module.scss';

gsap.registerPlugin(ScrollTrigger);

const CDN = 'https://serraverdeexpress.com.br/uploads';

// Fotos oficiais publicadas em serraverdeexpress.com.br — trocar por vídeo POV
// real da janela quando o material existir.
const SCENES = [
  { id: 'serra', legenda: 'A serra abrindo passagem para os trilhos', img: `${CDN}/0000/1/2024/03/01/banner-topo-vagoes-sve.jpg` },
  { id: 'mata', legenda: 'Mata Atlântica fechada dos dois lados do vagão', img: `${CDN}/0000/1/2024/03/01/img-thumb-serra-adventure-completo.jpg` },
  { id: 'por-do-sol', legenda: 'O pôr do sol acompanhando a descida', img: `${CDN}/0000/1/2024/02/06/passeio-por-do-sol-1.jpg` },
  { id: 'morretes', legenda: 'Morretes esperando no fim da linha', img: `${CDN}/0000/1/2024/02/08/pacote-morretes-com-almoco-2.jpg` },
  { id: 'litoral', legenda: 'O litoral logo depois da serra', img: `${CDN}/0000/1/2024/03/01/img-thumb-ilha-do-meu-volta-trem.jpg` },
];

// Scroll-jacking deliberadamente curto (~150vh) e só ativado fora de
// prefers-reduced-motion — fora disso, as cenas ficam empilhadas e
// acessíveis normalmente (ver .scenesStatic no módulo de estilo).
export default function JanelaPOV() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [pinned, setPinned] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  // Ao trocar do layout estático para o pinado, a altura da seção muda —
  // o ScrollTrigger precisa remedir tudo depois que o DOM atualiza.
  useEffect(() => {
    if (pinned) ScrollTrigger.refresh();
  }, [pinned]);

  useGsapContext(sectionRef, () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !viewportRef.current) return;

    setPinned(true);
    const scenes = gsap.utils.toArray<HTMLElement>(`.${styles.scene}`, viewportRef.current);
    gsap.set(scenes[0], { opacity: 1 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=1500',
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
        <div ref={viewportRef} className={`${styles.viewport} ${pinned ? styles.pinnedMode : styles.scenesStatic}`}>
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

        {/* Sem asset de áudio ainda — trocar `src` pelo som ambiente real do trem. */}
        <audio ref={audioRef} loop muted={muted} aria-hidden />
      </div>
    </section>
  );
}
