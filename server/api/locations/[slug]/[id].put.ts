import { findLocation } from '~/lib/db/queries/location';
import defineAuthenticatedEventHandler from '~/utils/defineAuthenticatedEventHandler';
import { z } from "zod";
import { updateLocationLog } from '~/lib/db/queries/locationLog';
import sendZodError from "~/utils/sendZodError";
import { InsertLocationSchemaLog } from "~/lib/db/schema";

export default defineAuthenticatedEventHandler(async (event) => {
    const slug = getRouterParam(event,  'slug') as string;

    const result = await readValidatedBody(event, InsertLocationSchemaLog.safeParse);

    if (!result.success) {
        return sendZodError(event, result.error);
    }

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
    const locationLog = await updateLocationLog(Number(id), location.id, result.data, event.context.user.id);

    if (!locationLog) {
        return sendError(event, createError({
            statusCode: 404,
            message: 'Location Log not found',
        }));
    }

    return locationLog;
});
