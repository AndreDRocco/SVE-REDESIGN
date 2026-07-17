// Contratos de dados do site. Mantidos deliberadamente simples e desacoplados
// de qualquer fornecedor (Booking Core, Supabase ou outro) — quando a integração
// real for definida, só os arquivos em lib/data precisam mudar, não a UI.

export interface Parada {
  slug: string;
  nome: string;
  descricaoCurta: string;
  kmPercurso: number; // posição aproximada no trajeto, 0-100
}

export type CategoriaVagao =
  | 'economica'
  | 'turistica'
  | 'boutique'
  | 'litorina-copacabana'
  | 'litorina-foz-do-iguacu'
  | 'litorina-curitiba';

export interface Vagao {
  categoria: CategoriaVagao;
  nome: string;
  descricao: string;
  diferenciais: string[];
  // URL absoluta da foto oficial publicada em serraverdeexpress.com.br
  imagem: string;
}

export interface Pacote {
  slug: string;
  nome: string;
  localizacao: string;
  categoria: 'Pacotes' | 'Bilhete de Trem' | 'Gastronomia';
  precoAPartir: number;
  duracaoHoras: number | null;
  destaque: boolean;
  // URL absoluta da foto oficial publicada em serraverdeexpress.com.br
  imagem: string;
  urlReservaAtual: string; // aponta para o site/motor de reservas em produção hoje
}

export interface FaqItem {
  pergunta: string;
  resposta: string;
}
