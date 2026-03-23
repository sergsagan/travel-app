import { findLocation } from '~/lib/db/queries/location';
import defineAuthenticatedEventHandler from '~/utils/defineAuthenticatedEventHandler';

export default defineAuthenticatedEventHandler(async (event) => {
    const slug = getRouterParam(event,  'slug') as string;
    const location = await findLocation(slug, event.context.user.id);

    if (!location) {
        return sendError(event, createError({
            statusCode: 404,
            message: 'Location not found',
        }));
    }
    return location;
});
