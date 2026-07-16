# Serra Verde Express — redesign (protótipo)

Scaffold Next.js (App Router) + TypeScript + Tailwind + SCSS Modules do redesign imersivo descrito em [brief-redesign-sve.md](./brief-redesign-sve.md). Placeholders visuais (gradientes CSS) no lugar de fotos/vídeos reais — ver seção "Assets" abaixo.

## Como rodar

Esta máquina não tinha Node.js instalado no momento em que este projeto foi montado. Para rodar:

1. Instale o [Node.js LTS](https://nodejs.org/) (20.x ou mais recente).
2. Nesta pasta, instale as dependências:
   ```
   npm install
   ```
3. Suba o servidor de desenvolvimento:
   ```
   npm run dev
   ```
4. Abra http://localhost:3000

## Achado importante sobre o backend atual

O site em produção (serraverdeexpress.com.br) **não usa Supabase**. Ele roda sobre um motor de reservas de turismo identificado no código-fonte como **Booking Core** (`window.bookingCore`, `bravo_booking_data`), com tema `mytravel` (jQuery + Bootstrap + Vue pontual) e Pusher para atualizações de disponibilidade em tempo real. A área de checkout vive em `/booking` no mesmo domínio, e o catálogo de preços também aparece em `mkt.serraverdeexpress.com.br/tarifario/`.

Isso significa que, antes de conectar dados reais neste novo front-end, é preciso decidir:

- **Manter o Booking Core como backend** e consumir os dados dele via API (se existir uma API documentada/liberada pelo fornecedor), ou
- **Migrar** a lógica de reservas/disponibilidade para outra coisa (ex.: Supabase), o que é um projeto à parte — envolve emissão de bilhete, controle de disponibilidade por vagão/data, e o gateway de pagamento (o site atual mostra bandeiras Visa/Master/Amex/Diners/Elo/Hipercard/Pix).

Enquanto essa decisão não é tomada, toda a camada de dados deste protótipo vive isolada em `src/lib/data/` (tipos em `types.ts`, mocks com nomes/preços reais raspados do site atual em `pacotes.ts`, `vagoes.ts`, `trajeto.ts`, `faq.ts`). Trocar por dados reais é questão de reescrever essas funções para buscar de uma API — nenhum componente de UI precisa mudar.

Os botões "Reservar agora" apontam, por enquanto, para as URLs reais do site em produção (`serraverdeexpress.com.br/train/...` e `/booking`), como ponte temporária até o checkout gamificado (barra "Estação → Poltrona → Bagagem → Embarque confirmado", ver brief) ser implementado de fato.

## Como o scroll é organizado (importante para não gerar bugs)

Três bibliotecas de animação convivem no projeto, cada uma com um papel único:

- **Lenis** (`src/lib/scroll/SmoothScrollProvider.tsx`) é a única fonte de verdade do scroll suave global. Ele é inicializado uma vez no layout raiz.
- **GSAP ScrollTrigger** é sincronizado ao Lenis (`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`) e é quem controla todo o scrollytelling: parallax do Hero, trilho do Trajeto, cross-fade da Janela POV.
- **Framer Motion** só cuida de transições locais de componente (menu fullscreen, toast de conquista) — nunca deve chamar `useScroll`/`scrollTo` globais.

Se for adicionar uma nova seção com scroll, siga esse padrão: registre o efeito com `useGsapContext` (`src/lib/scroll/useGsapContext.ts`), nunca inicialize um segundo Lenis ou uma segunda instância de smoothing.

## Fallback de acessibilidade/performance (já implementado)

- `prefers-reduced-motion: reduce` desliga Lenis, o scroll-jacking da Janela POV e o parallax de mouse do cursor customizado — o conteúdo continua todo visível e navegável (ver classe `.no-motion` em `globals.scss`).
- Seleção de vagão usa `<input type="radio">` nativo por baixo dos cards visuais — funciona com teclado e sem JS de decoração.
- FAQ usa `<details>/<summary>` nativos — acordeão funcional sem JavaScript.
- Cards de Pacotes são Server Components (sem `'use client'`) — não pagam custo de bundle de JS à toa.
- Selos de conquista (`src/lib/achievements`) são só client-side/localStorage, sem valor comercial — ver brief para o porquê disso ficar de fora do MVP com cupom real.

## Pendências antes de produção

- Trocar os placeholders de gradiente por vídeo/fotos reais (ver `imagemPlaceholder` nos arquivos de `lib/data`).
- Resolver a decisão de backend acima.
- Definir i18n (ES/EN) se confirmado tráfego internacional relevante.
- Testar em dispositivos Android de entrada e 3G/4G simulado antes de qualquer deploy.
- Validar com usuários reais se o scroll-jacking da Janela POV ajuda ou atrapalha (ver critério de decisão no brief, seção 10).
