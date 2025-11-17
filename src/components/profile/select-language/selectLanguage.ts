import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useGlobalStore from '@/stores/GlobalStore';
import { enLang, esLang } from '@/constants/theme';

const selectLanguage = () => {
  const i18n = useI18n();
  const globalStore = useGlobalStore();

  const currentLanguage = computed(() => globalStore.currentLanguage);

  const flagsList: { name: string; text: string; flag: string }[] = [
    {
      name: 'es',
      text: 'Español',
      flag: new URL('@/assets/images/flags/es-flag.svg', import.meta.url).href,
    },
    {
      name: 'en',
      text: 'English',
      flag: new URL('@/assets/images/flags/en-flag.svg', import.meta.url).href,
    },
  ];

  const languageSelect = ref(
    flagsList.find((f) => f.name === currentLanguage.value) || flagsList[0],
  );

  const toggleLanguage = () => {
    if (currentLanguage.value === esLang) {
      globalStore.setLanguage(enLang);
    } else {
      globalStore.setLanguage(esLang);
    }

    i18n.locale.value = currentLanguage.value;
  };

  return {
    languageSelect,
    toggleLanguage,
    flagsList,
  };
};

export default selectLanguage;
