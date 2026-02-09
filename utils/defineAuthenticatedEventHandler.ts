import { verifyCsrf } from "~/utils/csrf";
import { createError } from "h3";
import type { H3Event } from "h3";
import type { UserWithId } from "~/lib/auth";

type AuthenticatedEvent = H3Event & {
    context: H3EventContext & {
        user: UserWithId
    }
}

export default function defineAuthenticatedEventHandler(
    handler: (event: AuthenticatedEvent) => any) {
    return defineEventHandler(async(event) => {
        if (!['GET', 'HEAD', 'OPTIONS'].includes(event.method)) {
            verifyCsrf(event)
        }

        if (!event.context.user) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized' }
            )
        }

        return handler(event as AuthenticatedEvent);
    })
}
