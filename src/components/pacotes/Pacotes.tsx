import { pacotes } from '@/lib/data/pacotes';
import styles from './Pacotes.module.scss';

const formatarPreco = (valor: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

// Server component: nenhuma dessas informações depende de interação, então
// não precisa de 'use client' — mantém o bundle de JS da seção mais leve.
export default function Pacotes() {
  return (
    <section id="pacotes" className={styles.section}>
      <h2 className={styles.heading}>Pacotes e bilhetes</h2>

      <div className={styles.grid}>
        {pacotes.map((pacote) => (
          <article key={pacote.slug} className={styles.card}>
            <div className={`${styles.preview} ${styles[pacote.imagemPlaceholder]}`} aria-hidden />
            <div className={styles.body}>
              <div className={styles.badgeRow}>
                <span className={styles.badge}>{pacote.categoria}</span>
                {pacote.destaque && <span className={styles.destaqueBadge}>Destaque</span>}
              </div>
              <h3 className={styles.name}>{pacote.nome}</h3>
              <p className={styles.location}>
                {pacote.localizacao}
                {pacote.duracaoHoras ? ` · ${pacote.duracaoHoras}h` : ''}
              </p>

              <div className={styles.footer}>
                <span className={styles.price}>
                  <span className={styles.priceLabel}>A partir de</span>
                  {formatarPreco(pacote.precoAPartir)}
                </span>
                <a href={pacote.urlReservaAtual} data-cursor="hover" className={styles.cta}>
                  Reservar agora
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
