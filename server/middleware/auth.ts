import type { UserWithId } from '~/lib/auth';

export default defineEventHandler(async (event) => {
  const isTest = process.env.NODE_ENV === 'test';
  const isAuthEnabledInTests = process.env.TEST_ENABLE_AUTH === 'true';

  event.context.user = undefined;

  if (isTest && !isAuthEnabledInTests) {
    return;
  }

  if (isTest) {
    if (event.path.startsWith('/dashboard')) {
      await sendRedirect(event, '/', 302);
    }
    return;
  }

  const { auth } = await import('~/lib/auth');
  const session = await auth.api.getSession({ headers: event.headers });

  event.context.user = session?.user as unknown as UserWithId;

  if (event.path.startsWith('/dashboard') && !session?.user) {
    await sendRedirect(event, '/', 302);
  }
});
