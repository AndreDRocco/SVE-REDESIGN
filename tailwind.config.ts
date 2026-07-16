import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#0E1F17',
          light: '#16301F',
          deep: '#081410',
        },
        moss: {
          DEFAULT: '#4E7A5A',
          light: '#7FA989',
          dark: '#324F39',
        },
        mist: {
          DEFAULT: '#F3EFE4',
          dim: '#D9D3C1',
        },
        sunset: {
          DEFAULT: '#D98E52',
          light: '#F0B27E',
          dark: '#A9612E',
        },
        gold: '#D4A24C',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-sans)'],
      },
      transitionTimingFunction: {
        trilho: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
