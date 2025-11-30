import { defineStore } from 'pinia';
import type { UserResponse } from '@/domains/User';
import { userState } from '@/stores/user/userState';
import type { UserState } from '@/stores/user/userState';
import { getUsersList as getUsersListApi } from '@/services/user';

export const useUserStore = defineStore('UserStore', {
  state: (): UserState => ({ ...userState }),
  actions: {
    async fetchUsers(forceRefresh = false) {
      if (this.isLoaded && !forceRefresh) {
        return { success: true, data: this.usersList };
      }

      if (this.loading) {
        return { success: false, message: 'Already loading' };
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await getUsersListApi();

        if (response.data.ok && response.data.data) {
          this.usersList = response.data.data;
          this.isLoaded = true;

          return { success: true, data: this.usersList };
        }

        throw new Error('Failed to fetch users');
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error loading users';

        this.error = errorMessage;

        return { success: false, message: errorMessage };
      } finally {
        this.loading = false;
      }
    },

    async refreshUsers() {
      return await this.fetchUsers(true);
    },

    setUsersList(usersList: UserResponse[]) {
      this.usersList = usersList;
      this.isLoaded = true;
    },

    clearCache() {
      this.usersList = [];
      this.isLoaded = false;
      this.error = null;
    },

    updateUserInList(userId: string, updatedUser: Partial<UserResponse>) {
      const index = this.usersList.findIndex((user) => user.id === userId);

      if (index !== -1) {
        this.usersList[index] = { ...this.usersList[index], ...updatedUser };
      }
    },

    removeUserFromList(userId: string) {
      this.usersList = this.usersList.filter((user) => user.id !== userId);
    },

    addUserToList(user: UserResponse) {
      this.usersList.push(user);
    },
  },
  getters: {
    getUsersList: (state) => state.usersList,
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
    getError: (state) => state.error,
    isDataLoaded: (state) => state.isLoaded,
  },
});

export default useUserStore;
