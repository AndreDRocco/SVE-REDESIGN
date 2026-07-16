# Prompt para Cursor — Redesign do site Serra Verde Express (SVE)
### v2 — revisado

> Revisão do brief original. Mudanças: (1) marquei contradições internas que travariam o dev, (2) separei MVP de Fase 2 explicitamente, (3) adicionei perguntas em aberto que precisam de resposta antes de abrir o Cursor, (4) preenchi lacunas (SEO, i18n, legal, KPIs, riscos de UX) que o brief original não cobria e que importam para um site que vende passagem de verdade.

---

## 0. Perguntas em aberto (responder antes de começar a construir)

O brief original descreve conceito e stack, mas não diz como o site se conecta ao mundo real. Sem essas respostas, o Cursor vai inventar suposições que depois custam retrabalho:

1. **Motor de reservas**: existe um sistema de emissão de bilhetes/disponibilidade de vagão já em produção (ex.: plataforma de bilheteria, ERP de turismo)? O novo front vai consumir a API desse sistema, ou o checkout gamificado descrito na seção 5 precisa ser construído do zero com backend próprio?
2. **Cupom de desconto simbólico** (seção 5, item 4): gerar e validar um cupom real exige backend com estado (não é "client-side, sem backend" como o item 4 da seção 9 promete). Ou isso fica só de Fase 2, ou o MVP troca por uma recompensa sem efeito comercial (ex.: um selo colecionável, sem desconto de verdade).
3. **Idioma**: o passeio recebe turista estrangeiro (especialmente argentino). O site atual tem versão em outro idioma? Se sim, manter PT/ES/EN no redesign é requisito, não "nice to have".
4. **Dono do conteúdo**: quem edita preços/horários/pacotes no dia a dia — a mesma pessoa que edita hoje o site atual? Isso define se vale a pena investir em CMS (Sanity/Contentful) ou se um JSON versionado no repo já resolve para o volume de mudanças real.

---

## 1. Contexto do projeto

*(sem mudanças relevantes de conteúdo — mantido do original)*

Front-end engineer sênior atuando em site imersivo, storytelling digital e conversão para a Serra Verde Express, operadora do passeio de trem turístico Curitiba ↔ Morretes pela Serra do Mar.

Hoje o site é transacional (venda por categoria de vagão: Econômica, Turística, Executiva, Litorinas de Luxo temáticas Copacabana, Foz do Iguaçu, Curitiba) mas não comunica a experiência sensorial da viagem antes do embarque real.

**Objetivo estratégico**: o site deixa de ser formulário de compra e passa a ser a primeira parada da viagem, reduzindo fricção de decisão e aumentando conversão via imersão e gamificação — **sem nunca colocar a imersão na frente da conversão**. Regra geral do projeto: em qualquer conflito entre "impressionar" e "vender", vende.

## 2. Conceito criativo central

"O site é o trem antes do trem." Scrollytelling de trajeto: cada seção corresponde a um trecho real da rota (estação em Curitiba → Serra do Mar → viadutos e túneis → Mirante do Vale do Rio Sagrado → chegada em Morretes).

**Risco a controlar desde o design**: scrollytelling e scroll-jacking são tecnicas com histórico de prejudicar UX quando mal calibradas (usuário perde o controle do scroll, sente atraso, ou passa mal em telas menores). Definir logo no design:
- Duração máxima de qualquer trecho de scroll-jacking (recomendado: nunca mais que ~150–200vh de rolagem "capturada").
- Uma saída óbvia (ex.: scroll rápido/duplo sempre pula a seção) para quem quer ir direto à compra.
- Teste com usuários reais antes de decidir se o scroll-jacking fica no MVP ou vira Fase 2.

## 3. Hero / banner com parallax (primeira dobra)

- Parallax em camadas (4–5 planos: céu/nuvens, montanhas, vegetação, trilho/trem, partículas de neblina), acionado por scroll (`GSAP ScrollTrigger` ou `Framer Motion useScroll`) e leve parallax de mouse/giroscópio.
  - **Nota técnica**: parallax por giroscópio em iOS Safari exige `DeviceOrientationEvent.requestPermission()` atrás de um gesto do usuário (não pode disparar sozinho ao carregar a página) — tratar como enhancement opcional, nunca como dependência do layout.
- Ao rolar, revelar progressivamente o trajeto como mapa vivo com paradas que "acendem" conforme o scroll avança.
- Vídeo de fundo em loop, mudo, autoplay, `playsinline` (obrigatório para autoplay em iOS), com ken-burns lento.
  - Fallback: em conexão lenta ou `prefers-reduced-data`, servir apenas o poster estático — nunca bloquear o hero esperando o vídeo.

## 4. POV dentro do trem — seção de imersão

- Frame de "janela do vagão" com vídeo/parallax da paisagem (rio, cachoeira, floresta, viaduto, vilarejo).
- Scroll-jacking **curto e opcional** (ver limites na seção 2), sincronizado à velocidade do scroll.
- Áudio ambiente opcional, **off por padrão, com controle visível de mute/unmute** (autoplay de áudio é bloqueado pela maioria dos navegadores e é intrusivo mesmo quando permitido).
- **Fase 2** (não MVP): módulo 3D com Three.js/React Three Fiber ou Spline mostrando o vagão navegável em 360°. Isso tem custo de dev e de performance real (bundle size, GPU em aparelhos de entrada) — só entra depois que o resto do funil provar que converte melhor.

## 5. Gamificação da jornada de compra

Regra inegociável, repetida do original e reforçada: **gamificação nunca adiciona passo obrigatório ao checkout real**. Se o motor de reservas (pergunta 0.1) já exige um fluxo fixo de N etapas, a gamificação é uma camada visual sobre esse fluxo, não uma reestruturação dele.

1. Mapa interativo de escolha de trajeto/pacote no lugar do dropdown tradicional — com fallback: **manter um `<select>` real por baixo/ao lado para acessibilidade e para quem só quer escolher rápido**. Ninguém deveria ser obrigado a clicar em um mapa para comprar passagem.
2. Seleção de vagão como "escolha de personagem": cards com preview 360°/vídeo curto e badges de diferenciais.
3. Barra de progresso de embarque no checkout ("Estação → Poltrona → Bagagem → Embarque confirmado") — cosmética sobre o fluxo real de formulário, não uma alteração de quantos campos são pedidos.
4. Sistema de recompensas leve — **MVP**: selos client-side (localStorage) sem valor comercial (ex.: "Explorador da Serra"). **Fase 2, condicionado à resposta da pergunta 0.2**: cupom de desconto real, que exige backend com emissão/validação de código.
5. Easter eggs sutis de scroll (capivara, garça, cachoeira) — baixo custo, manter no MVP mas com orçamento de performance definido (ver seção 8).

## 6. Estrutura sugerida de páginas/seções da home

1. Hero com parallax + vídeo POV + CTA principal ("Viva a viagem")
2. Linha do tempo/mapa vivo do trajeto (Curitiba → Morretes) com paradas clicáveis
3. Seção "Dentro do trem" (janela POV + escolha de vagão)
4. Prova social (avaliações, fotos de clientes, selos Tripadvisor/Google) — **definir se é conteúdo estático curado manualmente ou embed via API**; embeds de terceiros costumam pesar no LCP, preferir capturas estáticas atualizadas periodicamente
5. Pacotes e categorias (com gamificação de seleção)
6. Perguntas frequentes / informações práticas (horários, duração 3h30–4h30, o que levar)
7. CTA final de compra + newsletter/clube de vantagens
8. **Adicionado**: rodapé com informações institucionais, política de cancelamento/reembolso, acessibilidade do trem/estações (relevante para quem tem mobilidade reduzida — pergunta comum antes da compra) e contato/WhatsApp

## 7. Stack técnico recomendado

- Next.js (App Router) + TypeScript
- Tailwind CSS + design tokens da marca
- Framer Motion (transições de componente) + GSAP/ScrollTrigger (scrollytelling do trajeto) + Lenis (smooth scroll global)
  - **Ponto de atenção real**: três sistemas de scroll ao mesmo tempo é a maior fonte provável de bugs do projeto. Definir uma única fonte de verdade do scroll (Lenis dirigindo o scroll real, GSAP ScrollTrigger sincronizado via `lenis.on('scroll', ScrollTrigger.update)`, Framer Motion só para transições que não competem com o scroll global) e documentar isso no README do repo antes de qualquer PR usar as três libs juntas.
- 3D (Fase 2, opcional): React Three Fiber/Drei ou Spline
- Vídeo: WebM/MP4 com poster, lazy load, fallback estático
- CMS/dados: decidir entre Sanity/Contentful/JSON local **depois de responder a pergunta 0.4** (não antes)
- Analytics: GA4 + Hotjar/Clarity, com eventos nomeados desde o início (ver seção 10)
- **Adicionado — i18n**: se a resposta da pergunta 0.3 confirmar necessidade multilíngue, usar `next-intl` ou `next-i18next` desde a estrutura inicial de pastas — retrofitar i18n depois de o site estar pronto é caro.

## 8. Performance e acessibilidade — restrições obrigatórias

- Todo efeito de parallax/scrollytelling com fallback estático para `prefers-reduced-motion: reduce`.
- Vídeos de fundo leves (<3–5MB por trecho) ou streaming adaptativo; nunca bloquear o FCP.
- Testar em 3G/4G simulado e em aparelhos Android de entrada (grande parte do público doméstico), não só iPhone recente.
- Contraste e legibilidade de texto sobre parallax (overlay/gradiente quando necessário) — meta mínima WCAG 2.1 AA.
- Toda a jornada de compra (preço, horários, disponibilidade, checkout) funciona 100% com JavaScript de animação desabilitado.
- Core Web Vitals: LCP < 2.5s mesmo com hero em vídeo/parallax; **adicionado**: CLS < 0.1 (camadas de parallax carregando fora de ordem são causa comum de layout shift) e INP < 200ms (crítico porque o mapa interativo e os cards de vagão são os elementos com mais interação).
- **Adicionado — legal**: além do WCAG, considerar a Lei Brasileira de Inclusão (LBI) e verificar se há exigência de nota de acessibilidade física do trem/estações — comum em produtos turísticos e frequentemente perguntado por clientes antes de comprar.

## 9. O que pedir ao Cursor para entregar (MVP)

1. Estrutura de pastas do projeto Next.js com componentes por seção (Hero, TrajetoInterativo, JanelaPOV, SeletorDeVagao, Pacotes, FAQ, CTAFinal).
2. Hero com parallax em camadas + scroll-trigger do mapa de trajeto, com fallback estático documentado.
3. Componente de seleção de vagão com cards e preview, **com `<select>` acessível equivalente por baixo**.
4. Sistema de conquistas client-side (localStorage, sem backend, sem valor comercial) — deixar claramente marcado no código como placeholder de Fase 2 se depender de cupom real.
5. Checklist de performance/acessibilidade aplicado (reduced motion, lazy loading, alt text, foco de teclado) — como checklist rodável, não só descrito.
6. Documentação curta (README) explicando a divisão de responsabilidade entre Lenis/GSAP ScrollTrigger/Framer Motion para não haver conflito de scroll entre PRs de pessoas diferentes.

## 10. KPIs e critério de sucesso (adicionado — faltava no original)

O objetivo declarado é aumentar conversão via imersão, então isso precisa de baseline e meta antes do lançamento, não só "GA4 + heatmap" genérico:

- Baseline: taxa de conversão atual do site transacional (visita → compra), tempo médio na página, taxa de abandono no formulário de compra.
- Eventos a instrumentar desde o dia 1: profundidade de scroll por "parada" do trajeto, cliques por card de vagão, taxa de conclusão do "mapa da viagem" antes da compra, uso do botão de mute do áudio, taxa de quem pula o scroll-jacking (se detectável).
- Critério de decisão: se a versão imersiva não superar (ou ao menos igualar) a conversão da versão atual em teste A/B após N semanas, os elementos de imersão de maior custo (scroll-jacking, módulo 3D) voltam para opcionais/removidos — a imersão é meio, não fim.

## 11. MVP vs. Fase 2 (resumo)

**MVP** (seções 1–6, sem os itens marcados como Fase 2 acima):
Hero parallax, mapa de trajeto, janela POV com scroll-jacking curto, seleção de vagão, checkout com barra de progresso cosmética, selos de conquista sem valor comercial, prova social estática, FAQ, CTA final.

**Fase 2** (depende de validação do MVP e/ou de respostas às perguntas da seção 0):
Módulo 3D do vagão em 360°, cupom de desconto real ligado a conquistas, multilíngue completo (se ainda não decidido no MVP), CMS completo (se JSON local bastar no início), embeds dinâmicos de prova social via API.

---

*Observação mantida do original: este é um prompt de exploração para brainstorm/protótipo — refine com o time de design e valide cada mecânica de gamificação com testes de usuário reais antes de produção.*
