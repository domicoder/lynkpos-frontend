<script setup lang="ts">
  import { ref } from 'vue';
  import type { UserLogin } from '@/domains/User';
  import { HOME_VIEW } from '@/router/paths';
  import { loginAuth } from '@/services/user';
  import useAuthStore from '@/stores/user/AuthStore';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';

  const authStore = useAuthStore();
  const router = useRouter();
  const { t } = useI18n();

  const rules = {
    required: (value: string) => !!value || 'Campo requerido.',
  };

  const show1 = ref(false);
  const password = ref('');
  const username = ref('');

  const handleLogin = async () => {
    try {
      await loginAuth({
        email: 'LynkPOS@example.com',
        password: '123456A.',
      });
      // TODO: handle success flow
    } catch (error) {
      // eslint-disable-next-line no-console
      // TODO: handle error modal
    }

    // API Auth response
    const userLogin: UserLogin = {
      id: '1',
      email: 'LynkPOS@example.com',
      username: '123456A.',
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
      <div class="flex flex-row w-full justify-center">
        <div class="flex flex-row gap-6 items-center justify-center w-[50%]">
          <v-col
            cols="6"
            md="6"
            sm="6"
          >
            <v-text-field
              v-model="username"
              label="Usuario"
              type="input"
              placeholder="example@example.com"
              :rules="[rules.required]"
              variant="outlined"
            />
            <v-text-field
              v-model="password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required]"
              :type="show1 ? 'text' : 'password'"
              placeholder="********"
              label="Contraseña"
              name="input-10-1"
              variant="outlined"
              @click:append="show1 = !show1"
            />

            <v-btn
              rounded="xl"
              size="x-large"
              block
              @click="handleLogin"
            >
              {{ t('general.login') }}
            </v-btn>
          </v-col>
        </div>
        <div class="flex flex-row gap-0 items-center justify-center w-[50%]">
          <p>
            <img
              src="@/assets/images/LynkPOS-logo.png"
              alt="logo"
              width="50"
            />
          </p>
          <h2 class="text-2xl font-bold">
            {{ t('general.appName') }}
          </h2>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
  .login {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

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
