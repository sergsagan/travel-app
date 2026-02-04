// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';
import process from 'node:process'
import './lib/env';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
  ],
  css: ['~/assets/css/main.css'],
  eslint: {
    config: {
      standalone: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  colorMode: {
    dataValue: 'theme',
  },
  nitro: {
    watchOptions: {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/.nuxt/**',
        '**/local.db',
      ],
    },
  },
  runtimeConfig: {
    csrfSecret: process.env.CSRF_SECRET, // server-only
    public: {
      disableAuth: process.env.NODE_ENV === 'test',
    },
  },
});
