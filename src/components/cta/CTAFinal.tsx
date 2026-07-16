import styles from './CTAFinal.module.scss';

export default function CTAFinal() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Sua viagem pela Serra do Mar começa com um clique.</h2>
      <p className={styles.subheading}>
        Escolha seu vagão, garanta seu horário e viva a descida de Curitiba até Morretes.
      </p>
      <a href="https://serraverdeexpress.com.br/booking" data-cursor="hover" className={styles.cta}>
        Reservar minha passagem
      </a>
    </section>
  );
}
