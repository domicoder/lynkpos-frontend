<script setup lang="ts">
  import { HOME_VIEW } from '@/router/paths';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const { t } = useI18n();

  const backHome = () => {
    router.push({ name: HOME_VIEW.name });
  };
</script>

<template>
  <main class="home">
    <div class="flex flex-col items-center justify-center">
      <div class="flex flex-col gap-6 w-[400px]">
        <div class="flex flex-col gap-6 items-center justify-center">
          <p>{{ t('about.title') }}</p>
          <i18n-t
            scope="global"
            keypath="about.description"
            tag="p"
            class="text-xs text-justify"
          >
            <template #appName>
              <span class="text-primary-color underline underline-offset-2">
                {{ t('general.appNameOnly') }}
              </span>
            </template>
            <template #owner>
              <span class="text-primary-color underline underline-offset-2">
                {{ `@${t('general.owner')}` }}
              </span>
            </template>
          </i18n-t>
          <button
            class="btn btn-ghost w-[96px] font-open-sans text-xs !py-2"
            @click="backHome"
          >
            {{ t('general.backHome') }}
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
