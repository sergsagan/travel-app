import { InsertLocation } from "~/lib/db/schema";
import { createError } from 'h3'
import { DrizzleError } from "drizzle-orm";
import slugify from 'slugify'
import { findLocationByName, findUniqueSlug, insertLocation } from "~/lib/db/queries/location";
import defineAuthenticatedEventHandler from "~/utils/defineAuthenticatedEventHandler";

export default defineAuthenticatedEventHandler(async(event) => {
    const result = await readValidatedBody(event,  InsertLocation.safeParse);

    if (!result.success) {
        const statusMessage = result.error.issues.map((issue) => `${issue.path.join('')} : ${issue.message}`).join('; ')

        const data = result.error.issues.reduce((errors, issue) => {
            errors[issue.path.join('')] = issue.message;
            return errors;
        }, {} as Record<string, string>)

        throw createError({
            statusCode: 422,
            statusMessage,
            data,
        })
    }
    const existingLocation = await findLocationByName(result.data,  event.context.user.id);

    if (existingLocation) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Location with this name already exists',
        })
    }

    const slug  = await findUniqueSlug(slugify(result.data.name));

    try {
        return insertLocation(result.data, slug, event.context.user.id)
    } catch (e) {
        const error = e as DrizzleError;
        // @ts-expect-error -- drizzle/libsql error typing
        const causeMessage = error.cause?.message || '';
        if (causeMessage.includes('location.slug')) {
            throw createError({
                statusCode: 409,
                statusMessage: 'Location with this name already exists',
            });
        }
        throw error;
    }

});
