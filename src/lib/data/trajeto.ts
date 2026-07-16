import type { Parada } from './types';

export const trajeto: Parada[] = [
  {
    slug: 'curitiba',
    nome: 'Estação de Curitiba',
    descricaoCurta: 'Embarque na Estação Central, o ponto de partida da viagem pela Serra do Mar.',
    kmPercurso: 0,
  },
  {
    slug: 'serra-do-mar',
    nome: 'Serra do Mar',
    descricaoCurta: 'Descida pela mata atlântica preservada, com trechos de floresta densa dos dois lados do trilho.',
    kmPercurso: 30,
  },
  {
    slug: 'viadutos-tuneis',
    nome: 'Viadutos e Túneis',
    descricaoCurta: 'Sequência de viadutos históricos e túneis escavados na rocha, um dos trechos mais fotografados.',
    kmPercurso: 55,
  },
  {
    slug: 'mirante-vale-do-rio-sagrado',
    nome: 'Mirante do Vale do Rio Sagrado',
    descricaoCurta: 'Parada panorâmica com vista aberta sobre o vale — o ponto alto da viagem.',
    kmPercurso: 75,
  },
  {
    slug: 'morretes',
    nome: 'Morretes',
    descricaoCurta: 'Chegada à cidade histórica, com tempo livre para o centro e a gastronomia local.',
    kmPercurso: 100,
  },
];
