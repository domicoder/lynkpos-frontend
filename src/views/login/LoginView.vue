<script setup lang="ts">
  import type { UserLogin } from '@/domains/User';
  import { HOME_VIEW } from '@/router/paths';
  import { loginAuth } from '@/services/user';
  import useAuthStore from '@/stores/user/AuthStore';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';

  const authStore = useAuthStore();
  const router = useRouter();
  const { t } = useI18n();

  const handleLogin = async () => {
    try {
      await loginAuth({
        email: 'vuetres-template@example.com',
        password: 'vuetres',
      });
      // TODO: handle success flow
    } catch (error) {
      // eslint-disable-next-line no-console
      // TODO: handle error modal
    }

    // API Auth response
    const userLogin: UserLogin = {
      id: '1',
      email: 'vuetres-template@example.com',
      username: 'vuetres-template',
      token: 'token-A4X3-A4X3-A4X3',
      roles: [
        {
          id: '1',
          // role_name: 'no-auth-1',
          role_name: 'Admin',
          description: 'Administrator role with full access',
          created_at: '2023-01-01T12:00:00Z',
        },
        {
          id: '2',
          // role_name: 'no-auth-2',
          role_name: 'Editor',
          description: 'Editor role with limited access',
          created_at: '2023-01-02T12:00:00Z',
        },
      ],
      permissions: [
        {
          id: '1',
          permission_name: 'read',
          description: 'Permission to read content',
          created_at: '2023-01-01T12:00:00Z',
        },
        {
          id: '2',
          permission_name: 'write',
          description: 'Permission to write content',
          created_at: '2023-01-02T12:00:00Z',
        },
      ],
      created_at: '2023-01-01T12:00:00Z',
      updated_at: '2023-07-01T12:00:00Z',
    };

    authStore.setUser(userLogin);

    router.push({ name: HOME_VIEW.name });
  };
</script>

<template>
  <main class="login">
    <div class="login-card">
      <div class="flex flex-col gap-6">
        <div class="flex flex-col items-center justify-center">
          <p>
            <img
              src="@/assets/images/vuetres-template-logo.svg"
              alt="logo"
              width="50"
            />
          </p>
          <div class="flex flex-col w-full items-center justify-center">
            <h1 class="text-lg">
              <p class="project-title italic -skew-y-6">
                {{ t('general.appName') }}
              </p>
            </h1>
            <p class="-skew-y-6 pb-4">{{ t('general.appDescription') }}</p>
          </div>
        </div>
        <div class="flex flex-col gap-6 items-center justify-center">
          <p>{{ t('login.title') }}</p>
          <button
            class="btn btn-ghost w-[108px] font-open-sans text-xs !py-2"
            @click="handleLogin"
          >
            {{ t('general.login') }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
  .login-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  .project-title {
    color: #64d98a;
  }
</style>
