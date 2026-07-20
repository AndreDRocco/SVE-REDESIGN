'use client';

import styles from './WhatsAppButton.module.scss';

// Número real do WhatsApp da SVE (confirmado no botão flutuante do site em
// produção — serraverdeexpress.com.br usa a mesma URL e o mesmo efeito de
// pulso que replicamos aqui).
const WHATSAPP_URL = 'https://wa.me/554138883472';

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.44 1.27 4.89L2 22l5.25-1.38A9.96 9.96 0 0 0 12.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm0 18.18c-1.6 0-3.13-.42-4.47-1.22l-.32-.19-3.12.82.84-3.04-.21-.31A8.17 8.17 0 0 1 3.82 12c0-4.53 3.69-8.18 8.22-8.18 4.53 0 8.18 3.65 8.18 8.18 0 4.53-3.65 8.18-8.18 8.18Zm4.48-6.12c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.15.16-.29.18-.53.06-.25-.12-1.04-.38-1.99-1.22-.73-.65-1.23-1.46-1.37-1.71-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.85.83-.85 2.03 0 1.2.87 2.36.99 2.52.12.16 1.71 2.61 4.15 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  );
}

// Botão flutuante do WhatsApp com anel de pulso — mesma ideia do botão que
// já existe no site em produção (fica parado até agora não tinha entrado no
// redesign). Sempre visível, canto inferior direito, acima de tudo.
export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="hover"
      aria-label="Conversar no WhatsApp"
      className={styles.button}
    >
      <span className={styles.ring} aria-hidden />
      <WhatsAppGlyph />
    </a>
  );
}
