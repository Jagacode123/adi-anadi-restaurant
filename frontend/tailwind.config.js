/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fff8f0',
          100: '#ffecd6',
          200: '#ffd5a8',
          300: '#ffb870',
          400: '#ff9138',
          500: '#f97316', // main orange
          600: '#ea6c0a',
          700: '#c2570c',
          800: '#9a4412',
          900: '#7c3912',
        },
        secondary: {
          50:  '#fdf8f0',
          100: '#f9edd8',
          200: '#f2d7ac',
          300: '#e8ba74',
          400: '#dc9542',
          500: '#c47a22',
          600: '#a8621a',
          700: '#8a4c18',
          800: '#6b3b16',
          900: '#4a2810',
        },
        cream: {
          50:  '#fefcf7',
          100: '#fdf7e8',
          200: '#faefd0',
          300: '#f5e2ae',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 25px -3px rgba(0, 0, 0, 0.12), 0 12px 30px -2px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
