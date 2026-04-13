import { auth } from '~/lib/auth';
import type { UserWithId } from '~/lib/auth';

export default defineEventHandler(async (event) => {
  const isAuthDisabledInTests
    = process.env.NODE_ENV === 'test'
      && process.env.TEST_ENABLE_AUTH !== 'true';

  if (isAuthDisabledInTests) {
    return;
  }
  const session = await auth.api.getSession({
    headers: event.headers,
  });
  event.context.user = session?.user as unknown as UserWithId;
  if (event.path.startsWith('/dashboard')) {
    if (!session?.user) {
      await sendRedirect(event, '/', 302);
    }
  }
});
