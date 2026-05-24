/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-mono)', 'Courier New', 'monospace'],
        display: ['var(--font-display)', 'serif'],
      },
      colors: {
        void: {
          black: '#030507',
          deep: '#060d12',
          dark: '#0a1520',
          mid: '#0f2030',
          mist: '#1a3344',
          glow: '#00d4ff',
          flicker: '#ff3366',
          signal: '#39ff14',
          ghost: '#8899aa',
          pale: '#c8dde8',
        }
      },
      animation: {
        'flicker': 'flicker 3s infinite',
        'scanline': 'scanline 8s linear infinite',
        'glitch': 'glitch 0.3s steps(2) infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'drift': 'drift 20s ease-in-out infinite',
        'static': 'static 0.1s steps(1) infinite',
        'breathe': 'breathe 6s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.4' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.6' },
          '97%': { opacity: '1' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '33%': { transform: 'translate(-2px, 1px)' },
          '66%': { transform: 'translate(2px, -1px)' },
          '100%': { transform: 'translate(0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0) translateY(0)' },
          '25%': { transform: 'translateX(10px) translateY(-5px)' },
          '50%': { transform: 'translateX(-5px) translateY(10px)' },
          '75%': { transform: 'translateX(-10px) translateY(-8px)' },
        },
        static: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '100% 100%' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}
