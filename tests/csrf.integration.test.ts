import { fetch, setup } from '@nuxt/test-utils';
import { describe, expect, it } from 'vitest';

process.env.CSRF_SECRET = 'test-secret-123';

async function getCsrfContext() {
  const res = await fetch('/api/csrf');
  expect(res.status).toBe(200);

  const body = await res.json();
  expect(body.token).toBeDefined();

  const setCookie = res.headers.get('set-cookie');
  expect(setCookie).toBeTruthy();
  expect(setCookie).toContain('csrf_token=');
  if (!setCookie) {
    throw new Error('CSRF cookie header is missing');
  }
  const [csrfCookie] = setCookie.split(';');
  if (!csrfCookie) {
    throw new Error('CSRF cookie value is missing');
  }

  return {
    csrfToken: body.token as string,
    csrfCookie,
  };
}

describe('csrf integration', async () => {
  await setup({
    server: true,
    browser: false,
    setupTimeout: 300_000,
  });

  it('sets csrf cookie and returns token', async () => {
    const { csrfToken, csrfCookie } = await getCsrfContext();
    expect(csrfToken).toBeTruthy();
    expect(csrfCookie).toContain('csrf_token=');
  });

  it('rejects POST without csrf', async () => {
    const res = await fetch('/api/locations', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Kyiv',
        lat: 50,
        long: 30,
      }),
    });

    expect(res.status).toBe(403);
  });

  it('rejects POST with invalid csrf', async () => {
    const { csrfCookie } = await getCsrfContext();

    const res = await fetch('/api/locations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': 'invalid',
        'cookie': csrfCookie,
      },
      body: JSON.stringify({
        name: 'Kyiv',
        lat: 50,
        long: 30,
      }),
    });

    expect(res.status).toBe(403);
  });

  it('passes CSRF validation and then fails auth', async () => {
    const { csrfToken, csrfCookie } = await getCsrfContext();

    const res = await fetch('/api/locations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': csrfToken,
        'cookie': csrfCookie,
      },
      body: JSON.stringify({
        name: 'Kyiv',
        lat: 50,
        long: 30,
      }),
    });

    expect(res.status).toBe(401);
  });
});
