import { defineStore } from 'pinia';
import { STORAGE_KEY } from '@/utils/utils';
import type { User, LoginToken } from '@/domains/User';
import state from '@/stores/user/state';
import type { AuthState } from '@/stores/user/state';

export const useAuthStore = defineStore('AuthStore', {
  state: (): AuthState => state,
  actions: {
    setToken(token: LoginToken) {
      this.$state.loginToken = token;
    },
    setUserInfo(userInfo: User) {
      this.$state.user = userInfo;
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.loginToken?.token,
    getUser: (state) => state.user,
    getToken: (state) => state.loginToken?.token,
  },
  persist: {
    key: STORAGE_KEY,
  },
});

export default useAuthStore;
