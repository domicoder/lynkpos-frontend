import { defineStore } from 'pinia';
import { STORAGE_KEY } from '@/utils/utils';
import type { UserLogin } from '@/domains/User';
import state from '@/stores/user/state';
import type { AuthState } from '@/stores/user/state';

export const useAuthStore = defineStore('AuthStore', {
  state: (): AuthState => state,
  actions: {
    setUser(user: UserLogin | null) {
      this.$state.user = user;
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
    getUser: (state) => state.user,
    getToken: (state) => {
      if (!state.user) {
        const auth = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');

        return auth?.token;
      }

      return state.user.token;
    },
  },
  persist: {
    key: STORAGE_KEY,
  },
});

export default useAuthStore;
