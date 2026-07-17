import type { Parada } from './types';

const CDN = 'https://serraverdeexpress.com.br/uploads';

// Fotos reais publicadas em serraverdeexpress.com.br, atribuídas por tema a
// cada trecho do percurso (o site oficial não publica fotografia por
// quilometragem exata, então reaproveitamos o acervo real disponível
// agrupando pelo assunto mais próximo de cada parada).
export const trajeto: Parada[] = [
  {
    slug: 'curitiba',
    nome: 'Estação de Curitiba',
    descricaoCurta: 'Embarque na Estação Central, o ponto de partida da viagem pela Serra do Mar.',
    kmPercurso: 0,
    imagens: [
      `${CDN}/0000/1/2024/03/01/banner-topo-vagoes-sve.jpg`,
      `${CDN}/0000/1/2024/02/16/categoria-turistica.jpg`,
      `${CDN}/0000/1/2024/03/01/vagao-classe-economica.jpg`,
    ],
  },
  {
    slug: 'serra-do-mar',
    nome: 'Serra do Mar',
    descricaoCurta: 'Descida pela mata atlântica preservada, com trechos de floresta densa dos dois lados do trilho.',
    kmPercurso: 30,
    imagens: [
      `${CDN}/0000/1/2024/03/01/img-thumb-serra-adventure-completo.jpg`,
      `${CDN}/0000/1/2024/03/01/img-thumb-ilha-do-meu-volta-trem.jpg`,
      `${CDN}/0000/1/2024/03/01/banner-topo-vagoes-sve.jpg`,
    ],
  },
  {
    slug: 'viadutos-tuneis',
    nome: 'Viadutos e Túneis',
    descricaoCurta: 'Sequência de viadutos históricos e túneis escavados na rocha, um dos trechos mais fotografados.',
    kmPercurso: 55,
    imagens: [
      `${CDN}/0000/1/2024/02/06/passeio-por-do-sol-1.jpg`,
      `${CDN}/0000/1/2024/03/01/img-thumb-serra-adventure-completo.jpg`,
      `${CDN}/0000/1/2024/02/16/vagao-litorina-luxo-copacabana-1.jpg`,
    ],
  },
  {
    slug: 'mirante-vale-do-rio-sagrado',
    nome: 'Mirante do Vale do Rio Sagrado',
    descricaoCurta: 'Parada panorâmica com vista aberta sobre o vale — o ponto alto da viagem.',
    kmPercurso: 75,
    imagens: [
      `${CDN}/0000/1/2024/02/06/passeio-por-do-sol-1.jpg`,
      `${CDN}/0000/1/2024/03/01/img-thumb-ilha-do-meu-volta-trem.jpg`,
      `${CDN}/0059/59122/2026/07/09/classique-dia-dos-pais-capa-de-produto-1080x700.jpg`,
    ],
  },
  {
    slug: 'morretes',
    nome: 'Morretes',
    descricaoCurta: 'Chegada à cidade histórica, com tempo livre para o centro e a gastronomia local.',
    kmPercurso: 100,
    imagens: [
      `${CDN}/0000/1/2024/02/08/pacote-morretes-com-almoco-2.jpg`,
      `${CDN}/0000/1/2024/02/08/pacote-morretes-com-almoco.jpg`,
      `${CDN}/0000/37/2025/02/19/whatsapp-image-2025-02-19-at-173139.jpeg`,
    ],
  },
];
