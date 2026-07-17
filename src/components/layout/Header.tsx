'use client';

import { useState } from 'react';
import { scrollToTarget } from '@/lib/scroll/lenis';

const NAV_ITEMS = [
  { label: 'Trajeto', href: '#top' },
  { label: 'Dentro do trem', href: '#dentro-do-trem' },
  { label: 'Vagões', href: '#vagoes' },
  { label: 'Pacotes', href: '#pacotes' },
  { label: 'Perguntas frequentes', href: '#faq' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  const handleNavClick = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToTarget(href, -88);
  };

  return (
    // O <nav> do menu precisa ser IRMÃO do <header>, nunca filho — o header
    // usa backdrop-blur-md (backdrop-filter), e qualquer ancestral com
    // filter/backdrop-filter vira o "viewport" de containment de elementos
    // filhos com position:fixed. Com o nav dentro do header, o menu
    // fullscreen ficava preso numa faixa de 88px (a altura do header) em vez
    // de cobrir a tela inteira — o botão parecia "quebrado" mesmo com o
    // estado e a transição de clip-path funcionando certinho.
    <>
      {/* Scrim de vidro escuro: mantém logo/botões legíveis tanto sobre o hero
          escuro quanto sobre as seções claras (vagões/pacotes/faq). */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-[72px] items-center justify-between bg-forest-deep/40 px-5 backdrop-blur-md md:h-[88px] md:px-10">
      <a
        href="#top"
        onClick={handleNavClick('#top')}
        data-cursor="hover"
        className="font-display text-base tracking-tight text-mist md:text-lg"
      >
        Serra Verde Express
      </a>

      <div className="flex items-center gap-4">
        <a
          href="https://serraverdeexpress.com.br/booking"
          data-cursor="hover"
          className="hidden rounded-full border border-mist/30 px-5 py-2 text-sm text-mist transition-colors hover:border-sunset-light hover:text-sunset-light md:inline-block"
        >
          Reservar agora
        </a>
        <button
          type="button"
          data-cursor="hover"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-fullscreen"
          className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-mist/30"
        >
          <span
            className={`h-[1.5px] w-5 bg-mist transition-transform ${open ? 'translate-y-[3.5px] rotate-45' : ''}`}
          />
          <span
            className={`h-[1.5px] w-5 bg-mist transition-transform ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`}
          />
        </button>
      </div>
      </header>

      {/* Transição via CSS puro (não Framer Motion): uma animação que revela
          um menu de navegação nunca pode depender de um motor de JS terminar
          de "tickar" — se travar (aba em segundo plano, dispositivo lento,
          thread principal ocupado pelo GSAP do trajeto), o menu fica preso
          invisível atrás de um clip-path de 0%, como aconteceu aqui. CSS
          transition roda no compositor do navegador, sempre chega ao fim. */}
      <nav
        id="menu-fullscreen"
        aria-hidden={!open}
        style={{ clipPath: open ? 'circle(150% at 92% 5%)' : 'circle(0% at 92% 5%)' }}
        className={`fixed inset-0 z-40 flex flex-col items-start justify-center gap-5 bg-forest-deep px-6 transition-[clip-path] duration-[600ms] ease-trilho md:gap-6 md:px-10 ${
          open ? '' : 'pointer-events-none'
        }`}
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            data-cursor="hover"
            tabIndex={open ? 0 : -1}
            onClick={handleNavClick(item.href)}
            className="font-display text-mist transition-colors hover:text-sunset-light"
            style={{ fontSize: 'clamp(1.75rem, 7vw, 3.75rem)' }}
          >
            {item.label}
          </a>
        ))}
        <a
          href="https://serraverdeexpress.com.br/booking"
          data-cursor="hover"
          tabIndex={open ? 0 : -1}
          className="mt-4 rounded-full bg-sunset px-7 py-3 font-semibold text-forest-deep"
        >
          Reservar agora
        </a>
      </nav>
    </>
  );
}
