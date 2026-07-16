import Hero from '@/components/hero/Hero';
import TrajetoInterativo from '@/components/trajeto/TrajetoInterativo';
import JanelaPOV from '@/components/janela-pov/JanelaPOV';
import SeletorDeVagao from '@/components/vagoes/SeletorDeVagao';
import Pacotes from '@/components/pacotes/Pacotes';
import FAQ from '@/components/faq/FAQ';
import CTAFinal from '@/components/cta/CTAFinal';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrajetoInterativo />
      <JanelaPOV />
      <SeletorDeVagao />
      <Pacotes />
      <FAQ />
      <CTAFinal />
    </>
  );
}
