/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,tsx}'],
  theme: {
    colors: {
      'accent': '#d7ef15',
      'light': '#7c7c7c',
      'dark': '#3c3c3c',
      'white': '#FFFFFF',
      'black': '#000000',
      'transparent': 'rgba(0,0,0,0)',
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}