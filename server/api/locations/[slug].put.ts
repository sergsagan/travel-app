import { findLocationByName, updateLocationBySlug } from '~/lib/db/queries/location';
import defineAuthenticatedEventHandler from '~/utils/defineAuthenticatedEventHandler';
import { InsertLocationSchema } from "~/lib/db/schema";
import sendZodError from "~/utils/sendZodError";

export default defineAuthenticatedEventHandler(async (event) => {
    const slug = getRouterParam(event,  'slug') as string;
    const result = await readValidatedBody(event, InsertLocationSchema.safeParse);

    if (!result.success) {
        return sendZodError(event, result.error);
    }

    const existingLocation = await findLocationByName(result.data, event.context.user.id);

    if (existingLocation && existingLocation.slug !== slug) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Location with this name already exists',
        });
    }

    return updateLocationBySlug(result.data, slug, event.context.user.id);
});
