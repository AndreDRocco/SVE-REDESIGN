'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { scrollToTarget } from '@/lib/scroll/lenis';

const NAV_ITEMS = [
  { label: 'Trajeto', href: '#trajeto' },
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
    <header className="fixed inset-x-0 top-0 z-50 flex h-[88px] items-center justify-between px-6 md:px-10">
      <a
        href="#top"
        onClick={handleNavClick('#top')}
        data-cursor="hover"
        className="font-display text-lg tracking-tight text-mist"
      >
        Serra Verde Express
      </a>

      <div className="flex items-center gap-4">
        <a
          href="https://serraverdeexpress.com.br/booking"
          data-cursor="hover"
          className="hidden rounded-full border border-mist/30 px-5 py-2 text-sm text-mist transition-colors hover:border-gold hover:text-gold md:inline-block"
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

      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu-fullscreen"
            initial={{ clipPath: 'circle(0% at 92% 5%)' }}
            animate={{ clipPath: 'circle(150% at 92% 5%)' }}
            exit={{ clipPath: 'circle(0% at 92% 5%)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-start justify-center gap-6 bg-forest-deep px-10"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                data-cursor="hover"
                onClick={handleNavClick(item.href)}
                className="font-display text-4xl text-mist transition-colors hover:text-gold md:text-6xl"
              >
                {item.label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
