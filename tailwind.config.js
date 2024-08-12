/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        'primary-color': 'var(--text-primary-color)',
        'secondary-color': 'var(--text-secondary-color)',
        'primary-accent': 'var(--primary-accent)',
        'btn-primary-color': 'var(--btn-primary-color)',
        'btn-primary-bg': 'var(--btn-primary-bg)',
        'btn-primary-hover': 'var(--btn-primary-hover)',
      },
      fontFamily: {
        'open-sans': ['Open Sans', 'sans-serif'],
      },
    },
    container: {},
  },
  plugins: [],
};
