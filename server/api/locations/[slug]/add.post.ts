import defineAuthenticatedEventHandler from "~/utils/defineAuthenticatedEventHandler";
import { InsertLocationSchemaLog } from "~/lib/db/schema";
import sendZodError from "~/utils/sendZodError";
import { findLocation } from "~/lib/db/queries/location";
import { insertLocationLog } from "~/lib/db/queries/locationLog";

export default defineAuthenticatedEventHandler(async (event) => {
    const slug = getRouterParam(event,  'slug') as string;
    const location = await findLocation(slug, event.context.user.id);

    if (!location) {
        return sendError(event, createError({
            statusCode: 404,
            message: 'Location not found',
        }));
    }

    const result = await readValidatedBody(event, InsertLocationSchemaLog.safeParse);

    if (!result.success) {
        return sendZodError(event, result.error);
    }

    return insertLocationLog(location.id, result.data, event.context.user.id);
});
