import type { Vagao } from './types';

const CDN = 'https://serraverdeexpress.com.br/uploads';

// Linha real de vagões publicada em serraverdeexpress.com.br/page/vagoes
// (capturado em 2026-07-16), com as fotos oficiais de cada categoria.
export const vagoes: Vagao[] = [
  {
    categoria: 'economica',
    nome: 'Econômica',
    descricao: 'O jeito clássico de descer a serra: bancos simples, janelas amplas e o essencial para curtir a vista.',
    diferenciais: ['Janelas amplas', 'Melhor preço', 'Clima de trem histórico'],
    imagem: `${CDN}/0000/1/2024/03/01/vagao-classe-economica.jpg`,
  },
  {
    categoria: 'turistica',
    nome: 'Turística',
    descricao: 'Conforto intermediário com poltronas estofadas e circulação mais espaçosa entre os bancos.',
    diferenciais: ['Poltronas estofadas', 'Vista panorâmica', 'Ar-condicionado'],
    imagem: `${CDN}/0000/1/2024/02/16/categoria-turistica.jpg`,
  },
  {
    categoria: 'boutique',
    nome: 'Boutique',
    descricao:
      'Vagões temáticos decorados — Imperial, Família Arruda, Barão do Serro Azul, BOVE, Guardiões do Marumbi e o Carmen Silva (acessível) — com serviço a bordo.',
    diferenciais: ['Decoração temática', 'Serviço a bordo', 'Opção acessível'],
    imagem: `${CDN}/0000/1/2024/02/08/vagao-boutique-imperial-3.jpg`,
  },
  {
    categoria: 'litorina-copacabana',
    nome: 'Litorina de Luxo — Copacabana',
    descricao: 'Vagão panorâmico temático, com decoração inspirada no Rio de Janeiro e assentos premium.',
    diferenciais: ['Vagão temático', 'Assentos premium', 'Vista 360°'],
    imagem: `${CDN}/0000/1/2024/02/16/vagao-litorina-luxo-copacabana-1.jpg`,
  },
  {
    categoria: 'litorina-foz-do-iguacu',
    nome: 'Litorina de Luxo — Foz do Iguaçu',
    descricao: 'Vagão panorâmico temático inspirado nas Cataratas, com o mesmo padrão premium das Litorinas.',
    diferenciais: ['Vagão temático', 'Assentos premium', 'Vista 360°'],
    imagem: `${CDN}/0000/1/2024/03/01/vagao-litorina-foz.jpg`,
  },
  {
    categoria: 'litorina-curitiba',
    nome: 'Litorina de Luxo — Curitiba',
    descricao: 'Vagão panorâmico temático inspirado na capital paranaense, fechando a linha das Litorinas.',
    diferenciais: ['Vagão temático', 'Assentos premium', 'Vista 360°'],
    imagem: `${CDN}/0000/1/2024/02/16/vagao-litorina-luxo-curitiba-1.jpg`,
  },
];
