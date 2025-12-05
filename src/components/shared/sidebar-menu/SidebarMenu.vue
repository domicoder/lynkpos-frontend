<script lang="ts" setup>
  import sidebarMenu from '@/components/shared/sidebar-menu/sidebarMenu';
  import drawerLogoBlack from '@/assets/images/lynkpos-drawer-logo-black.png';
  import drawerLogoWhite from '@/assets/images/lynkpos-drawer-logo-white.png';
  import type { LoginToken, User } from '@/domains/User';
  import useAuthStore from '@/stores/user/AuthStore';
  import {
    CASH_REGISTERS_VIEW,
    HOME_VIEW,
    LOGIN_VIEW,
    USERS_VIEW,
    REPORTS_VIEW,
  } from '@/router/paths';
  import { useRouter } from 'vue-router';
  import { computed } from 'vue';

  type Props = {
    isLightTheme: boolean;
  };

  const authStore = useAuthStore();
  const router = useRouter();

  const props = defineProps<Props>();

  const toggleSidebar = defineModel<boolean>('toggleSidebar');

  const { drawerLogoAlt } = sidebarMenu(props);

  const onLogout = () => {
    authStore.setUserInfo({} as User);
    authStore.setToken({} as LoginToken);

    router.push({ name: LOGIN_VIEW.name });
  };

  const currentRoute = computed(() => router.currentRoute.value.name);

  const isHomeRoute = computed(() => currentRoute.value === HOME_VIEW.name);
  const isUsersRoute = computed(() => currentRoute.value === USERS_VIEW.name);
  const isCashRegistersRoute = computed(
    () => currentRoute.value === CASH_REGISTERS_VIEW.name,
  );
  const isReportsRoute = computed(
    () => currentRoute.value === REPORTS_VIEW.name,
  );
</script>

<template>
  <v-navigation-drawer
    v-model="toggleSidebar"
    location="left"
    permanent
    class="border-sm"
  >
    <template #prepend>
      <div class="flex items-center justify-center py-4 border h-[65px]">
        <img
          v-if="isLightTheme"
          :src="drawerLogoBlack"
          :alt="drawerLogoAlt"
          width="129"
        />
        <img
          v-else
          :src="drawerLogoWhite"
          :alt="drawerLogoAlt"
          width="129"
        />
      </div>
    </template>

    <v-list
      density="compact"
      nav
    >
      <v-list-item
        :active="isHomeRoute"
        active-class="active-link"
        prepend-icon="mdi-home"
        :title="$t('drawer.options.home')"
        value="home"
        @click="router.push({ name: HOME_VIEW.name })"
      />
      <v-list-item
        :active="isUsersRoute"
        active-class="active-link"
        prepend-icon="mdi-account-group-outline"
        :title="$t('drawer.options.users')"
        value="users"
        @click="router.push({ name: USERS_VIEW.name })"
      />
      <v-list-item
        :active="isCashRegistersRoute"
        active-class="active-link"
        prepend-icon="mdi-cash-lock"
        :title="$t('drawer.options.cashRegisters')"
        value="cashRegisters"
        @click="router.push({ name: CASH_REGISTERS_VIEW.name })"
      />
      <v-list-item
        :active="isReportsRoute"
        active-class="active-link"
        prepend-icon="mdi-chart-bar"
        :title="$t('drawer.options.reports')"
        value="reports"
        @click="router.push({ name: REPORTS_VIEW.name })"
      />
      <v-list-item
        prepend-icon="mdi-logout"
        :title="$t('drawer.options.logout')"
        value="logout"
        @click="onLogout"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
  .active-link {
    background-color: var(--active-link);
  }
</style>
