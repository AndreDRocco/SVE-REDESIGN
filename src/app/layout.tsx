import type { Metadata } from 'next';
import { Playfair_Display, Source_Sans_3 } from 'next/font/google';
import SmoothScrollProvider from '@/lib/scroll/SmoothScrollProvider';
import { AchievementsProvider } from '@/lib/achievements/AchievementsProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CustomCursor from '@/components/ui/CustomCursor';
import AchievementToast from '@/components/ui/AchievementToast';
import './globals.scss';

// Serifada clássica com charme de cartaz de viagem retrô — assinatura visual
// da marca nos títulos.
const display = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
});

// Sans limpa e bem legível (inclui acentuação em português) para o texto.
const sans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Serra Verde Express — O trem antes do trem',
  description:
    'Passeio de trem turístico entre Curitiba e Morretes pela Serra do Mar. Viva o trajeto antes mesmo de embarcar.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">
        <AchievementsProvider>
          <SmoothScrollProvider>
            <CustomCursor />
            <Header />
            <main>{children}</main>
            <Footer />
            <AchievementToast />
          </SmoothScrollProvider>
        </AchievementsProvider>
      </body>
    </html>
  );
}
