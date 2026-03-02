import { setCsrfCookie } from '~/utils/csrf';

export default defineEventHandler((event) => {
  const token = setCsrfCookie(event);

  return { token };
});
