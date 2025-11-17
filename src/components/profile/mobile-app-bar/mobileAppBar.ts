import { computed, ref } from 'vue';
import useGlobalStore from '@/stores/GlobalStore';
import { lightTheme } from '@/constants/theme';

const mobileAppBar = () => {
  const globalStore = useGlobalStore();

  const userMenu = ref(false);

  const currentTheme = computed(() => globalStore.getDocumentTheme);

  const isLightTheme = computed(() => currentTheme.value === lightTheme);

  const toggleTheme = () => {
    globalStore.toggleTheme(true);
  };

  return {
    userMenu,
    isLightTheme,
    toggleTheme,
  };
};

export default mobileAppBar;
