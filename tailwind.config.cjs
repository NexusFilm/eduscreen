/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        'spring-in': {
          '0%': { transform: 'scale(0.9) translateY(10px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        'spring-out': {
          '0%': { transform: 'scale(1) translateY(0)', opacity: '1' },
          '100%': { transform: 'scale(0.9) translateY(10px)', opacity: '0' },
        },
      },
      animation: {
        'spring-in': 'spring-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        'spring-out': 'spring-out 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
      },
    },
  },
  plugins: [],
} 