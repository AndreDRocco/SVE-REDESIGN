'use client';

import { useState } from 'react';
import { vagoes } from '@/lib/data/vagoes';
import { useAchievements } from '@/lib/achievements/AchievementsProvider';
import styles from './SeletorDeVagao.module.scss';

// Escolha de vagão como "escolha de personagem" (cards visuais), mas o
// controle real é um grupo de <input type="radio"> nativo — funciona sem
// nenhum JS de decoração, com teclado, e é o que de fato guarda o estado.
export default function SeletorDeVagao() {
  const [selecionado, setSelecionado] = useState(vagoes[0].categoria);
  const { unlock } = useAchievements();

  const vagaoAtual = vagoes.find((v) => v.categoria === selecionado);

  return (
    <section id="vagoes" className={styles.section}>
      <h2 className={styles.heading}>Escolha seu vagão</h2>
      <p className={styles.subheading}>
        Cada vagão muda a experiência da viagem — do banco simples da Econômica ao serviço a bordo da Litorina de
        Luxo.
      </p>

      <fieldset className={styles.grid}>
        <legend className={styles.srOnly}>Escolha o vagão da sua viagem</legend>
        {vagoes.map((vagao) => (
          <div key={vagao.categoria}>
            <input
              type="radio"
              id={`vagao-${vagao.categoria}`}
              name="vagao"
              value={vagao.categoria}
              checked={selecionado === vagao.categoria}
              onChange={() => {
                setSelecionado(vagao.categoria);
                unlock('planejador-de-viagem');
              }}
              className={`${styles.radio} ${styles.srOnly}`}
            />
            <label htmlFor={`vagao-${vagao.categoria}`} data-cursor="hover" className={styles.card}>
              <div className={`${styles.preview} ${vagao.imagemPlaceholder}`} aria-hidden />
              <p className={styles.name}>{vagao.nome}</p>
              <p className={styles.desc}>{vagao.descricao}</p>
              <div className={styles.badges}>
                {vagao.diferenciais.map((d) => (
                  <span key={d} className={styles.badge}>
                    {d}
                  </span>
                ))}
              </div>
            </label>
          </div>
        ))}
      </fieldset>

      <p className={styles.summary} aria-live="polite">
        Selecionado: <strong>{vagaoAtual?.nome}</strong>
      </p>
    </section>
  );
}
