export type AchievementId = 'explorador-da-serra' | 'madrugador' | 'planejador-de-viagem';

export interface AchievementDef {
  id: AchievementId;
  titulo: string;
  descricao: string;
}

// Selos client-side, sem valor comercial (ver brief: cupom real fica para
// Fase 2, condicionado a existir backend para emitir/validar código).
export const ACHIEVEMENTS: Record<AchievementId, AchievementDef> = {
  'explorador-da-serra': {
    id: 'explorador-da-serra',
    titulo: 'Explorador da Serra',
    descricao: 'Você percorreu o trajeto inteiro, do embarque em Curitiba até Morretes.',
  },
  madrugador: {
    id: 'madrugador',
    titulo: 'Madrugador',
    descricao: 'Escolheu o primeiro horário de saída do dia.',
  },
  'planejador-de-viagem': {
    id: 'planejador-de-viagem',
    titulo: 'Planejador de Viagem',
    descricao: 'Explorou o mapa da viagem antes de escolher o pacote.',
  },
};
