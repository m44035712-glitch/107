/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0A192F',
          dark: '#081325',
          blue: '#1E3A8A',
          saffron: '#D97706',
          slate: '#F8FAFC',
          gold: '#B45309'
        },
        bis: {
          900: '#03045E',
          800: '#023E8A',
          700: '#0077B6',
          600: '#0096C7',
          500: '#00B4D8',
          400: '#48CAE4',
          300: '#90E0EF',
          200: '#ADE8F4',
          100: '#CAF0F8',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#1E3A8A',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#F1F5F9',
          foreground: '#0F172A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    }
  },
  plugins: []
};
