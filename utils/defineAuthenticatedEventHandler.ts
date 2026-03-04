import type { H3Event } from 'h3';
import { createError } from 'h3';
import type { UserWithId } from '~/lib/auth';
import { verifyCsrf } from '~/utils/csrf';

type AuthenticatedEvent = H3Event & {
  context: H3EventContext & {
    user: UserWithId;
  };
};

export default function defineAuthenticatedEventHandler<T>(
  handler: (event: AuthenticatedEvent) => T,
) {
  return defineEventHandler(async (event) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(event.method)) {
      verifyCsrf(event);
    }

    if (!event.context.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      },
      );
    }

    return handler(event as AuthenticatedEvent);
  });
}
