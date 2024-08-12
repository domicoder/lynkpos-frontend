/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;

  export default component;
}

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_ENV: string;
  readonly VITE_BASE_API: string;
  readonly VITE_DEV_BACKEND_URL: string;
  readonly VITE_PRIVATE_TOKEN_NPM: string;
  readonly VITE_CACHE_DIR: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
