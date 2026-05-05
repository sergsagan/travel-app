import { fetch, setup } from '@nuxt/test-utils';
import { afterAll, describe, expect, it } from 'vitest';

process.env.TEST_ENABLE_AUTH = 'true';

describe('auth flow integration',  () => {

  afterAll(() => {
    delete process.env.TEST_ENABLE_AUTH;
  });

  it('allows public home page', async () => {
    const res = await fetch('/');

    expect(res.status).toBe(200);
  });

  it('redirects unauthenticated user from /dashboard to /', async () => {
    const res = await fetch('/dashboard', {
      redirect: 'manual',
    });

    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('/');
  });

  it('returns 401 for protected API without session', async () => {
    const res = await fetch('/api/locations');

    expect(res.status).toBe(401);
  });
});
