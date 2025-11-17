<script lang="ts" setup>
  import sidebarMenu from '@/components/shared/sidebar-menu/sidebarMenu';
  import drawerLogoBlack from '@/assets/images/lynkpos-drawer-logo-black.png';
  import drawerLogoWhite from '@/assets/images/lynkpos-drawer-logo-white.png';

  type Props = {
    isLightTheme: boolean;
  };

  const props = defineProps<Props>();

  const toggleSidebar = defineModel<boolean>('toggleSidebar');

  const { drawerLogoAlt } = sidebarMenu(props);
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
        prepend-icon="mdi-account-group-outline"
        :title="$t('drawer.options.users')"
        value="users"
      />
      <v-list-item
        prepend-icon="mdi-cash-lock"
        :title="$t('drawer.options.cashRegisters')"
        value="cashRegisters"
      />
    </v-list>
  </v-navigation-drawer>
</template>
