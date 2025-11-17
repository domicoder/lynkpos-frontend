import { computed } from 'vue';
import useAuthStore from '@/stores/user/AuthStore';

const userAvatar = () => {
  const authStore = useAuthStore();

  const user = computed(() => authStore.getUser);

  return {
    user,
  };
};

export default userAvatar;
