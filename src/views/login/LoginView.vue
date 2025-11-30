<!-- eslint-disable no-unreachable -->
<script setup lang="ts">
  import { computed, ref } from 'vue';
  import type { LoginToken, User } from '@/domains/User';
  import { HOME_VIEW } from '@/router/paths';
  import { loginAuth, getUserInfo } from '@/services/user';
  import useAuthStore from '@/stores/user/AuthStore';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import useGlobalStore from '@/stores/GlobalStore';
  import type { ModalAction } from '@/domains/modal/Actions';
  import { Action } from '@/domains/modal/Actions';

  const authStore = useAuthStore();
  const router = useRouter();
  const { t } = useI18n();
  const globalStore = useGlobalStore();

  const rules = {
    required: (value: string) => !!value || 'Campo requerido.',
  };

  const confirmModalActions = computed<ModalAction[]>(() => [
    {
      label: t('general.accept'),
      value: Action.Success,
    },
  ]);

  const showPassword = ref(false);
  const password = ref('');
  const username = ref('');

  const handleLogin = async () => {
    try {
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
      authStore.setToken(response.data as LoginToken);

      // Now getUserInfo will automatically have the Authorization header via interceptor
      const userInfoResponse = await getUserInfo();

      authStore.setUserInfo(userInfoResponse.data as User);

      router.push({ name: HOME_VIEW.name });
    } catch (err) {
      // TODO: backend needs to handle a general error response
      showLoginErrorModal(
        t('login.modal.titleError'),
        t('login.modal.messageError'),
      );
    }
  };

  const showLoginErrorModal = (title: string, message: string) => {
    globalStore.showConfirmModal(
      true,
      title,
      message,
      () => {},
      () => {},
      confirmModalActions.value,
    );
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
                  name="password"
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
