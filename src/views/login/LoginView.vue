<!-- eslint-disable no-unreachable -->
<script setup lang="ts">
  import { ref } from 'vue';
  import type { LoginToken, User } from '@/domains/User';
  import { HOME_VIEW } from '@/router/paths';
  import { loginAuth, getUserInfo } from '@/services/user';
  import useAuthStore from '@/stores/user/AuthStore';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';

  const authStore = useAuthStore();
  const router = useRouter();
  const { t } = useI18n();

  const rules = {
    required: (value: string) => !!value || 'Campo requerido.',
  };

  const showPassword = ref(false);
  const password = ref('');
  const username = ref('');

  const handleLogin = async () => {
    try {
      const token = {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjRjMjI1MThjLTAwMDktNDA1MC1lMmM5LTA4ZGUxZTMyYThmMSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IjEiLCJleHAiOjE3NjM5OTI1NjQsImlzcyI6InB1bnRvX3ZlbnRhIiwiYXVkIjoidXNlciJ9.A7nrbaLWE64n3cYr2IhEUCjMTaFVTP0A4oI6_mZNd5E',
      };
      const userInfo = {
        id: '4c22518c-0009-4050-e2c9-08de1e32a8f1',
        nombre: 'Pipo Dinatale',
        usuarioNombre: 'pipo',
        rol: {
          id: 1,
          nombre: 'ADMIN',
        },
      };

      authStore.setToken(token as LoginToken);
      authStore.setUserInfo(userInfo as User);

      router.push({ name: HOME_VIEW.name });

      return;

      // TODO: hardcode until the backend is ready (API LiveDemo)
      const response = await loginAuth({
        usuarioNombre: username.value,
        password: password.value,
      });

      // check if the response is not ok (status !== 200)
      if (response.status !== 200) {
        alert('Error al iniciar sesión');

        // TODO: handle error modal
        return;
      }

      // Set token in store first - the Axios interceptor will automatically
      // add the Authorization header to all subsequent requests
      authStore.setToken(response.data.data as LoginToken);

      // Now getUserInfo will automatically have the Authorization header via interceptor
      const userInfoResponse = await getUserInfo();

      authStore.setUserInfo(userInfoResponse.data as User);

      router.push({ name: HOME_VIEW.name });
    } catch (error) {
      // TODO: handle error modal
      // eslint-disable-next-line no-console
      console.log('error', error);
      // eslint-disable-next-line no-alert
      alert('Error al iniciar sesión');
      // TODO: handle error modal
    }
  };
</script>

<template>
  <main class="login">
    <div class="login-card">
      <div class="flex md:flex-row flex-col w-full justify-center">
        <div
          class="flex flex-row gap-6 items-center justify-center md:w-[50%] w-full"
        >
          <v-col cols="10">
            <div class="md:mb-5 mb-[100px] md:mt-0 mt-10">
              <h2 class="md:text-[40px] text-[24px] font-bold">
                {{ t('general.welcome') }}
              </h2>
              <p
                class="md:text-[16px] text-[10px] font-normal text-primary-white"
              >
                {{ t('general.appDescription') }}
              </p>
            </div>

            <form @submit.prevent="handleLogin">
              <div class="flex flex-col gap-2">
                <v-text-field
                  v-model="username"
                  :label="t('login.username')"
                  type="input"
                  placeholder="example@example.com"
                  :rules="[rules.required]"
                  variant="outlined"
                  class="w-full"
                />
                <v-text-field
                  v-model="password"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required]"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="********"
                  :label="t('login.password')"
                  name="input-10-1"
                  variant="outlined"
                  class="w-full"
                  autocomplete="new-password"
                  @click:append-inner="showPassword = !showPassword"
                />
              </div>

              <v-btn
                rounded="xl"
                size="x-large"
                block
                type="submit"
                color="blue-dark"
                class="text-none md:mt-8 mt-[110px]"
                elevation="0"
              >
                {{ t('general.login') }}
              </v-btn>
            </form>
          </v-col>
        </div>
        <div
          class="flex flex-col gap-0 items-center justify-center md:w-[50%] w-full h-dvh bg-blue-dark/[37%] rounded-tl-[412px]"
        >
          <div>
            <img
              src="@/assets/images/LynkPOS-logo.png"
              alt="logo"
              width="319"
              class="md:block hidden"
            />
          </div>
          <h2 class="md:text-[80px] text-[40px] font-bold text-blue-dark">
            {{ t('general.appName') }}
          </h2>
          <div>
            <img
              src="@/assets/images/login-ecommerce.png"
              alt="LynkPOS login image"
              width="319"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
  .login {
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
