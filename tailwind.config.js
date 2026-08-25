/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#020408',
          900: '#060910',
          850: '#0b101d',
          800: '#12192c',
          700: '#1b2640',
          600: '#28385e',
        },
        lime: {
          300: '#f5ff80',
          400: '#e2f161',
          500: '#ccff00',
        },
        cyanAccent: '#38bdf8',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Syne"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glowPulse 3.5s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'float-alt': 'floatAlt 7s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        marquee: 'marquee 20s linear infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '0.25', transform: 'scale(1)' },
          '50%': { opacity: '0.65', transform: 'scale(1.08)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        floatAlt: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(0.8deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-lime': '0 0 35px -5px rgba(226, 241, 97, 0.35)',
        'glow-cyan': '0 0 35px -5px rgba(56, 189, 248, 0.35)',
        'glow-emerald': '0 0 35px -5px rgba(52, 211, 153, 0.35)',
      },
    },
  },
  plugins: [],
}
