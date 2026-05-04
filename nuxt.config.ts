// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';
import type { Plugin } from 'vite';
const tailwindVitePlugin = tailwindcss();
import process from 'node:process';

import { fileURLToPath } from 'node:url'

const mockPath = fileURLToPath(new URL('./tests/mocks/drizzle.ts', import.meta.url))

import './lib/env';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  experimental: {
    serverAppConfig: false,
    payloadExtraction: true
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    'nuxt-maplibre',
  ],
  css: ['~/assets/css/main.css'],
  eslint: {
    config: {
      standalone: false,
    },
  },
  vite: {
    plugins: tailwindVitePlugin as unknown as Plugin[],
    optimizeDeps: {
      include: [
        'maplibre-gl',
        'better-auth/vue',
        '@indoorequal/vue-maplibre-gl',
        'drizzle-orm/sqlite-core',
        'drizzle-zod',
        'drizzle-orm',
        'zod',
        '@vee-validate/zod'
      ]
    },
    build: {
      cssCodeSplit: false,
    },
  },
  colorMode: {
    dataValue: 'theme',
  },
  nitro: {
    compressPublicAssets: true,
    watchOptions: {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/.nuxt/**',
        '**/local.db',
      ],
    },
    alias: process.env.VITEST
        ? {
          'drizzle-orm/libsql': mockPath,
        }
        : {},
  },
  runtimeConfig: {
    csrfSecret: process.env.CSRF_SECRET,
    public: {
      disableAuth: process.env.NODE_ENV === 'test',
    },
  },
});
