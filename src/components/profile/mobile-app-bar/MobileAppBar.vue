<script lang="ts" setup>
  import SelectLanguage from '@/components/profile/select-language/SelectLanguage.vue';
  import mobileAppBar from './mobileAppBar';
  import UserAvatar from '@/components/profile/user-avatar/UserAvatar.vue';

  type Props = {
    title?: string;
    subtitle?: string;
  };

  defineProps<Props>();

  const { userMenu, isLightTheme, toggleTheme } = mobileAppBar();
</script>

<template>
  <v-btn
    icon
    color="primary"
    variant="outlined"
    @click="userMenu = !userMenu"
  >
    <v-avatar
      size="44"
      border
    >
      <img
        src="@/assets/images/user-avatar.png"
        alt="User avatar"
      />
    </v-avatar>

    <v-dialog
      v-model="userMenu"
      transition="dialog-bottom-transition"
      fullscreen
    >
      <v-card class="h-full">
        <div class="flex items-center justify-between mr-4 mt-2">
          <UserAvatar />
          <v-btn
            icon="mdi-close"
            flat
            @click="userMenu = false"
          />
        </div>
        <v-list>
          <v-divider />
          <v-list-item
            link
            @click="toggleTheme"
          >
            <v-list-item-title class="flex items-center gap-4 pa-4">
              <i
                id="theme-toggle__icon"
                class="oio-icon"
                :class="isLightTheme ? 'oio-sun' : 'oio-moon'"
              ></i>
              <span>
                {{ isLightTheme ? $t('theme.light') : $t('theme.dark') }}
              </span>
            </v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item>
            <SelectLanguage :is-mobile="true" />
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </v-btn>
</template>
