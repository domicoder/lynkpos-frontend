<script setup lang="ts">
  import { lightTheme } from '@/constants/theme';
  import useGlobalStore from '@/stores/GlobalStore';
  import { computed, ref } from 'vue';

  // import Header from '@/components/Header.vue';
  // import Navbar from '@/components/Navbar.vue';
  const globalStore = useGlobalStore();

  const currentTheme = computed(() => globalStore.getDocumentTheme);

  const isLightTheme = computed(() => currentTheme.value === lightTheme);

  const toggleTheme = () => {
    globalStore.toggleTheme(true);
  };
  const drawer = ref(true);
</script>

<template>
  <!-- ContextMenu -->
  <v-responsive class="border rounded">
    <v-app>
      <!-- TODO: drawer component -->
      <v-navigation-drawer
        v-model="drawer"
        location="left"
        permanent
        class="border-sm"
      >
        <template #prepend>
          <div
            class="flex items-center justify-center py-4 border-b-[1px] h-[65px]"
          >
            <img
              v-if="isLightTheme"
              src="@/assets/images/lynkpos-drawer-logo-black.png"
              alt="LynkPOS drawer logo black"
              width="129"
            />
            <img
              v-else
              src="@/assets/images/lynkpos-drawer-logo-white.png"
              alt="LynkPOS drawer logo white"
              width="129"
            />
          </div>
        </template>

        <v-divider />

        <v-list
          density="compact"
          nav
        >
          <v-list-item
            prepend-icon="mdi-account-group-outline"
            title="Usuarios"
            value="users"
          />
          <v-list-item
            prepend-icon="mdi-cash-lock"
            title="Cajas"
            value="cashRegisters"
          />
        </v-list>
      </v-navigation-drawer>

      <!-- TODO: navbar component -->
      <v-app-bar
        elevation="0"
        class="border border-b-[1px]"
      >
        <div class="flex items-center justify-between w-full">
          <v-btn
            icon="mdi-menu"
            class="ml-4"
            @click="drawer = !drawer"
          />
          <div class="flex items-center justify-center pr-8 gap-3">
            <v-list-item
              :title="'Karla Smith'"
              :subtitle="'Administrador'"
              lines="two"
            >
              <template #prepend>
                <v-avatar
                  size="50"
                  border
                >
                  <img
                    src="@/assets/images/user-avatar.png"
                    alt="User avatar"
                  />
                </v-avatar>
              </template>
            </v-list-item>
            <div>
              <button
                class="btn btn-plain"
                @click="toggleTheme"
              >
                <i
                  id="theme-toggle__icon"
                  class="oio-icon"
                  :class="isLightTheme ? 'oio-sun' : 'oio-moon'"
                ></i>
              </button>
            </div>
          </div>
        </div>
        <!-- <v-divider /> -->
      </v-app-bar>
      <v-main>
        <v-container>
          <div class="router-content h-full"><slot></slot></div>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
  <!-- ToastGroup -->
  <!-- ConfirmDialog -->
</template>

<style lang="scss" scoped></style>
