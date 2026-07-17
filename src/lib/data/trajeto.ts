import type { Parada } from './types';

const CDN = 'https://serraverdeexpress.com.br/uploads';

// Fotos reais publicadas em serraverdeexpress.com.br — cada uma foi baixada e
// conferida visualmente antes de entrar aqui (a atribuição anterior confiava
// só no nome do arquivo e acabou colocando uma foto de propaganda com rostos
// de clientes, um jipe atolando na lama e uma mesa de comida como cenário do
// trajeto). O acervo público do site tem poucas fotos de paisagem/trajeto em
// si — por isso as 3 melhores (viaduto, pôr do sol pela janela, tripulação)
// se repetem entre paradas, sempre priorizando a que combina mais com o
// tema daquele trecho como primeira imagem.
const VIADUTO = `${CDN}/0000/1/2024/02/05/blog-trilhos-trem-brasil-1.jpg`; // trem sobre viaduto, serra ao fundo
const POR_DO_SOL_JANELA = `${CDN}/0000/37/2025/02/19/whatsapp-image-2025-02-19-at-173139.jpeg`; // pôr do sol visto da janela do vagão
const TRIPULACAO = `${CDN}/0000/1/2024/02/05/blog-trem-republicano.jpg`; // locomotiva real com maquinistas
const MORRETES_CENARIO = `${CDN}/0000/1/2024/02/08/pacote-morretes-com-almoco.jpg`; // rio e casario histórico de Morretes
const ILHA_LITORAL = `${CDN}/0000/1/2024/03/01/img-thumb-ilha-do-meu-volta-trem.jpg`; // vista aérea do litoral

export const trajeto: Parada[] = [
  {
    slug: 'curitiba',
    nome: 'Estação de Curitiba',
    descricaoCurta: 'Embarque na Estação Central, o ponto de partida da viagem pela Serra do Mar.',
    kmPercurso: 0,
    imagens: [TRIPULACAO, VIADUTO, POR_DO_SOL_JANELA],
  },
  {
    slug: 'serra-do-mar',
    nome: 'Serra do Mar',
    descricaoCurta: 'Descida pela mata atlântica preservada, com trechos de floresta densa dos dois lados do trilho.',
    kmPercurso: 30,
    imagens: [VIADUTO, POR_DO_SOL_JANELA, ILHA_LITORAL],
  },
  {
    slug: 'viadutos-tuneis',
    nome: 'Viadutos e Túneis',
    descricaoCurta: 'Sequência de viadutos históricos e túneis escavados na rocha, um dos trechos mais fotografados.',
    kmPercurso: 55,
    imagens: [VIADUTO, TRIPULACAO, POR_DO_SOL_JANELA],
  },
  {
    slug: 'mirante-vale-do-rio-sagrado',
    nome: 'Mirante do Vale do Rio Sagrado',
    descricaoCurta: 'Parada panorâmica com vista aberta sobre o vale — o ponto alto da viagem.',
    kmPercurso: 75,
    imagens: [POR_DO_SOL_JANELA, VIADUTO, ILHA_LITORAL],
  },
  {
    slug: 'morretes',
    nome: 'Morretes',
    descricaoCurta: 'Chegada à cidade histórica, com tempo livre para o centro e a gastronomia local.',
    kmPercurso: 100,
    imagens: [MORRETES_CENARIO, POR_DO_SOL_JANELA, TRIPULACAO],
  },
];
