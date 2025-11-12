/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        'primary-color': 'var(--primary)',
        'secondary-color': 'var(--text-secondary)',
        'primary-accent': 'var(--primary-accent)',
        'btn-primary-color': 'var(--btn-primary)',
        'btn-primary-bg': 'var(--btn-primary-bg)',
        'btn-primary-hover': 'var(--btn-primary-hover)',
        'primary-white': 'var(--text-white)',

        'blue-dark': '#254567',
        'gray-secondary': '#49475A',
      },
      fontFamily: {
        'open-sans': ['Open Sans', 'sans-serif'],
      },
    },
    container: {},
  },
  plugins: [],
};
