/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", 'sans-serif'],
        display: ["'Space Grotesk'", 'sans-serif'],
      },
      colors: {
        primary: { DEFAULT: '#6366f1', hover: '#8b5cf6' },
        surface: {
          dark: '#28282B',
          sidebar: '#28282B',
          card: '#323237',
          input: '#38383E',
        },
      },
      keyframes: {
        bounce3: { '0%,80%,100%': { transform: 'translateY(0)' }, '40%': { transform: 'translateY(-6px)' } },
        fadeUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulse2: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
        spin: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        bounce3: 'bounce3 1.2s infinite',
        fadeUp: 'fadeUp 0.2s ease',
        pulse2: 'pulse2 1s infinite',
        spin: 'spin 0.7s linear infinite',
      },
    },
  },
  plugins: [],
};
