import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
// import { ViteWebfontDownload } from 'vite-plugin-webfont-dl'; // npm i vite-plugin-webfont-dl
//  Vite documentation: SSL for your dev environment: https://stackoverflow.com/a/72998216/12811519
// import basicSsl from '@vitejs/plugin-basic-ssl'; // npm install -D @vitejs/plugin-basic-ssl

export default defineConfig(
  ({ mode }: { mode: string }): Record<string, unknown> => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
      build: {
        assetsDir: 'static',
        sourcemap: true,
      },
      plugins: [
        vue(),
        // ViteWebfontDownload(
        //   [
        //     'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
        //     'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap',
        //   ],
        //   { cache: false },
        // ),
        // // If you use https on localhost
        // ...(mode === 'development' ? [basicSsl()] : []),

        // // Optional
        // [...(mode === 'development' ? [basicSsl({
        //   /** name of certification */
        //   name: 'vuetres-template',
        //   /** custom trust domains */
        //   domains: ['*.custom.com'],
        //   /** path to certificate (custom certification directory) */
        //   certPath: '.cert/cert/vuetres-template.crt',
        // })] : [])],
      ],
      server: {
        https: mode === 'production',
        port: 7026, // docker config
        host: true,
        proxy: {
          '/api': {
            target: (env.VITE_DEV_BACKEND_URL || 'http://server:8000') + '/api',
            changeOrigin: true,
            rewrite: (path: string) => path.replace(/^\/api/, ''),
          },
        },
      },
      preview: {
        host: true,
        port: 7026,
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
        },
      },
      define: {
        // enable hydration mismatch details in production build
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      },
      cacheDir: process.env.VITE_CACHE_DIR || 'node_modules/.vite', // vite cache dir
    };
  },
);
