import { computed } from 'vue';

type Props = {
  isLightTheme: boolean;
};

const sidebarMenu = (props: Props) => {
  const isLightTheme = computed(() => props.isLightTheme);

  const drawerLogoAlt = computed(() => {
    return isLightTheme.value
      ? 'LynkPOS drawer logo black'
      : 'LynkPOS drawer logo white';
  });

  return {
    drawerLogoAlt,
  };
};

export default sidebarMenu;
