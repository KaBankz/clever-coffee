// @ts-expect-error - no types
import nativewind from 'nativewind/preset';
import type { Config } from 'tailwindcss';

const colors = {
  coffee: {
    50: '#F5EDE3', // Lighter cream (background)
    100: '#E6D5C3', // Light cream (borders, dividers)
    200: '#C4A992', // Medium cream (secondary text)
    300: '#A87B51', // Light roast (accents)
    400: '#8B5E3C', // Medium roast (primary text)
    500: '#65432B', // Dark roast (headers)
    600: '#422C1D', // Darker roast (dark mode cards)
    700: '#2C1810', // Deepest coffee (dark mode background)
  },
};

const config: Config = {
  content: ['./src/{app,components}/**/*.tsx'],
  presets: [nativewind],
  theme: {
    extend: {
      colors: {
        coffee: colors.coffee,
      },
    },
  },
  plugins: [],
};

export default config;
