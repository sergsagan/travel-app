import { findLocationLog } from '~/lib/db/queries/locationLog';
import { findLocation } from '~/lib/db/queries/location';
import defineAuthenticatedEventHandler from '~/utils/defineAuthenticatedEventHandler';
import { z } from "zod";

export default defineAuthenticatedEventHandler(async (event) => {
    const slug = getRouterParam(event,  'slug') as string;
    const location = await findLocation(slug, event.context.user.id);

    if (!location) {
        return sendError(event, createError({
            statusCode: 404,
            message: 'Location not found',
        }));
    }
    const id = getRouterParam(event,  'id') as string;

    if (!z.coerce.number().safeParse(id).success) {
        return sendError(event, createError({
            statusCode: 422,
            message: 'Invalid id',
        }));
    }
    const locationLog = await findLocationLog(Number(id), event.context.user.id);

    if (!locationLog) {
        return sendError(event, createError({
            statusCode: 404,
            message: 'Location Log not found',
        }));
    }

    return locationLog;
});
