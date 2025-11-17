<script lang="ts" setup>
  import userAvatar from './userAvatar';

  type Props = {
    title?: string;
    subtitle?: string;
  };

  defineProps<Props>();

  const { user } = userAvatar();
</script>

<template>
  <v-list-item
    :title="user?.nombre ?? ''"
    :subtitle="user?.rol?.nombre ?? ''"
    lines="two"
  >
    <template #prepend>
      <v-avatar
        size="44"
        border
      >
        <img
          src="@/assets/images/user-avatar.png"
          alt="User avatar"
        />
      </v-avatar>
    </template>
  </v-list-item>
</template>
