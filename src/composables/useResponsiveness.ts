import { computed, ref } from 'vue';

export function useResponsiveness() {
  const windowWidth = ref<number>(window.innerWidth);

  const handleMountedResize = () => {
    window.addEventListener('resize', () => {
      windowWidth.value = window.innerWidth;
    });
  };

  const handleUnmountedResize = () => {
    window.removeEventListener('resize', () => {
      windowWidth.value = window.innerWidth;
    });
  };

  return {
    handleMountedResize,
    handleUnmountedResize,
    isMobile: computed(() => windowWidth.value < 768),
    windowWidth,
  };
}
