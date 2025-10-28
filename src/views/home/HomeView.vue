<script setup lang="ts">
  import { LOGIN_VIEW } from '@/router/paths';
  import useAuthStore from '@/stores/user/AuthStore';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';

  const authStore = useAuthStore();
  const router = useRouter();
  const { t } = useI18n();

  const onLogout = () => {
    authStore.setUser(null);

    router.push({ name: LOGIN_VIEW.name });
  };
</script>

<template>
  <main class="home">
    <div>
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-6 items-center justify-center">
          <p>{{ t('home.title') }}</p>
          <button
            class="btn btn-ghost w-[108px] font-open-sans text-xs !py-2"
            @click="onLogout"
          >
            {{ t('general.logout') }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
  .project-title {
    color: #64d98a;
  }
</style>
