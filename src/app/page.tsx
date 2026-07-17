import TrajetoInterativo from '@/components/trajeto/TrajetoInterativo';
import JanelaPOV from '@/components/janela-pov/JanelaPOV';
import SeletorDeVagao from '@/components/vagoes/SeletorDeVagao';
import Pacotes from '@/components/pacotes/Pacotes';
import FAQ from '@/components/faq/FAQ';
import CTAFinal from '@/components/cta/CTAFinal';

export default function HomePage() {
  return (
    <>
      {/* O Trajeto Interativo É a hero: trem fixo no centro, cubos de fotos
          reais girando e deslizando conforme o scroll. */}
      <TrajetoInterativo />
      <JanelaPOV />
      <SeletorDeVagao />
      <Pacotes />
      <FAQ />
      <CTAFinal />
    </>
  );
}
