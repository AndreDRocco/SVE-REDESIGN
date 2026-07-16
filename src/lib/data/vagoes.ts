import type { Vagao } from './types';

export const vagoes: Vagao[] = [
  {
    categoria: 'economica',
    nome: 'Econômica',
    descricao: 'Bancos simples, virados para a paisagem, com o essencial para curtir a vista sem custo extra.',
    diferenciais: ['Vista lateral', 'Janela ampla', 'Melhor custo-benefício'],
    imagemPlaceholder: 'gradient-moss',
  },
  {
    categoria: 'turistica',
    nome: 'Turística',
    descricao: 'Conforto intermediário com poltronas estofadas e circulação mais espaçosa entre os bancos.',
    diferenciais: ['Poltronas estofadas', 'Vista panorâmica', 'Ar-condicionado'],
    imagemPlaceholder: 'gradient-forest',
  },
  {
    categoria: 'executiva',
    nome: 'Executiva',
    descricao: 'Vagão fechado com climatização e serviço de bordo, para quem quer a experiência mais confortável.',
    diferenciais: ['Serviço a bordo', 'Climatização completa', 'Poltronas reclináveis'],
    imagemPlaceholder: 'gradient-gold',
  },
  {
    categoria: 'litorina-copacabana',
    nome: 'Litorina de Luxo — Copacabana',
    descricao: 'Vagão panorâmico temático, com decoração inspirada no Rio de Janeiro e assentos premium.',
    diferenciais: ['Vagão temático', 'Assentos premium', 'Vista 360°'],
    imagemPlaceholder: 'gradient-sunset',
  },
  {
    categoria: 'litorina-foz-do-iguacu',
    nome: 'Litorina de Luxo — Foz do Iguaçu',
    descricao: 'Vagão panorâmico temático inspirado nas Cataratas, com o mesmo padrão premium das Litorinas.',
    diferenciais: ['Vagão temático', 'Assentos premium', 'Vista 360°'],
    imagemPlaceholder: 'gradient-moss',
  },
  {
    categoria: 'litorina-curitiba',
    nome: 'Litorina de Luxo — Curitiba',
    descricao: 'Vagão panorâmico temático inspirado na capital paranaense, fechando a linha das Litorinas.',
    diferenciais: ['Vagão temático', 'Assentos premium', 'Vista 360°'],
    imagemPlaceholder: 'gradient-forest',
  },
];
