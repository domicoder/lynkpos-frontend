import { ref, onMounted } from 'vue';

export function useTheme() {
  const currentTheme = ref<string>('light');

  const initTheme = () => {
    const theme = localStorage.getItem('theme');

    if (theme) {
      currentTheme.value = theme;
    } else if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      currentTheme.value = 'dark';
    }

    updateTheme();
  };

  const switchTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
    updateTheme();
  };

  const updateTheme = () => {
    if (currentTheme.value === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.setAttribute('data-theme', currentTheme.value);
    localStorage.setItem('theme', currentTheme.value);
  };

  onMounted(initTheme);

  return {
    currentTheme,
    switchTheme,
  };
}
