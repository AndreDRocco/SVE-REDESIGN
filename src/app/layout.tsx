import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import SmoothScrollProvider from '@/lib/scroll/SmoothScrollProvider';
import { AchievementsProvider } from '@/lib/achievements/AchievementsProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CustomCursor from '@/components/ui/CustomCursor';
import AchievementToast from '@/components/ui/AchievementToast';
import './globals.scss';

const display = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-display',
});

const sans = Manrope({
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
