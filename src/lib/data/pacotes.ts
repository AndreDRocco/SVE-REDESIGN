import type { Pacote } from './types';

const CDN = 'https://serraverdeexpress.com.br/uploads';

// Nomes, preços, durações, URLs e fotos espelham o que está publicado hoje em
// serraverdeexpress.com.br (raspado em 2026-07-16). Servem para prototipar o
// layout com conteúdo real — antes de produção, isso deve vir da integração
// real (Booking Core hoje; ver README sobre a decisão de backend em aberto).
export const pacotes: Pacote[] = [
  {
    slug: 'pacote-curitiba-morretes-completo',
    nome: 'Pacote Completo: Curitiba – Morretes (Ida de Trem e Volta de Van)',
    localizacao: 'Morretes - PR',
    categoria: 'Pacotes',
    precoAPartir: 488,
    duracaoHoras: 10,
    destaque: true,
    imagem: `${CDN}/0000/1/2024/02/08/pacote-morretes-com-almoco-2.jpg`,
    urlReservaAtual:
      'https://serraverdeexpress.com.br/train/pacote-curitiba-morretes-completo-ida-de-trem-e-volta-de-van',
  },
  {
    slug: 'bilhete-curitiba-morretes',
    nome: 'Bilhete de Trem: Curitiba - Morretes ou Morretes - Curitiba',
    localizacao: 'Morretes - PR',
    categoria: 'Bilhete de Trem',
    precoAPartir: 206,
    duracaoHoras: 4,
    destaque: false,
    imagem: `${CDN}/0000/1/2024/02/08/pacote-morretes-com-almoco.jpg`,
    urlReservaAtual: 'https://serraverdeexpress.com.br/train/bilhete-curitiba-morretes',
  },
  {
    slug: 'pacote-por-do-sol-simples',
    nome: 'Pacote Pôr do Sol Simples: Morretes - Curitiba (Ida de Van e Volta de Trem)',
    localizacao: 'Morretes - PR',
    categoria: 'Pacotes',
    precoAPartir: 317,
    duracaoHoras: null,
    destaque: false,
    imagem: `${CDN}/0000/37/2025/02/19/whatsapp-image-2025-02-19-at-173139.jpeg`,
    urlReservaAtual: 'https://serraverdeexpress.com.br/train/pacote-morretes-curitiba-simples',
  },
  {
    slug: 'serra-adventure-completo',
    nome: 'Serra Adventure Completo: Passeio de Trem com Trilha de Jipe 4x4',
    localizacao: 'Morretes - PR',
    categoria: 'Pacotes',
    precoAPartir: 859,
    duracaoHoras: null,
    destaque: false,
    imagem: `${CDN}/0000/1/2024/03/01/img-thumb-serra-adventure-completo.jpg`,
    urlReservaAtual: 'https://serraverdeexpress.com.br/train/serra-adventure-completo',
  },
  {
    slug: 'ilha-do-mel-volta-de-trem',
    nome: 'Passeio na Ilha do Mel com Volta de Trem',
    localizacao: 'Ilha do Mel - PR',
    categoria: 'Pacotes',
    precoAPartir: 839,
    duracaoHoras: null,
    destaque: false,
    imagem: `${CDN}/0000/1/2024/03/01/img-thumb-ilha-do-meu-volta-trem.jpg`,
    urlReservaAtual: 'https://serraverdeexpress.com.br/train/passeio-ilha-do-mel-com-volta-de-trem',
  },
  {
    slug: 'pacote-por-do-sol-completo',
    nome: 'Pacote Pôr do Sol Completo: Morretes - Curitiba (Ida de Van e Volta de Trem)',
    localizacao: 'Morretes - PR',
    categoria: 'Pacotes',
    precoAPartir: 488,
    duracaoHoras: 11,
    destaque: true,
    imagem: `${CDN}/0000/1/2024/02/06/passeio-por-do-sol-1.jpg`,
    urlReservaAtual: 'https://serraverdeexpress.com.br/train/pacote-morretes-curitiba-por-do-sol-completo',
  },
  {
    slug: 'expresso-classique',
    nome: 'Expresso Classique: Jantar 5 Estrelas com Passeio de Trem',
    localizacao: 'Curitiba - PR',
    categoria: 'Gastronomia',
    precoAPartir: 385,
    duracaoHoras: null,
    destaque: true,
    imagem: `${CDN}/0059/59122/2026/07/09/classique-dia-dos-pais-capa-de-produto-1080x700.jpg`,
    urlReservaAtual: 'https://serraverdeexpress.com.br/train/expresso-classique',
  },
];
