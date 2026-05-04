import { setup } from '@nuxt/test-utils';

await setup({
    server: true,
    browser: false,
})

process.env.CSRF_SECRET = 'test-secret-very-long-and-safe';
process.env.NODE_ENV = 'test';
