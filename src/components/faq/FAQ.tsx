import { faq } from '@/lib/data/faq';
import styles from './FAQ.module.scss';

// <details>/<summary> nativos: acordeão que funciona sem nenhum JS.
export default function FAQ() {
  return (
    <section id="faq" className={styles.section}>
      <h2 className={styles.heading}>Perguntas frequentes</h2>
      <div className={styles.list}>
        {faq.map((item) => (
          <details key={item.pergunta} className={styles.item}>
            <summary className={styles.question}>{item.pergunta}</summary>
            <p className={styles.answer}>{item.resposta}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
