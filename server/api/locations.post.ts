import { InsertLocation, location } from "~/lib/db/schema";
import { createError } from 'h3'
import db from "~/lib/db";
import { verifyCsrf } from '~/server/utils/csrf'
import { DrizzleError } from "drizzle-orm";


export default defineEventHandler(async(event) => {
    verifyCsrf(event);

    if (!event.context.user) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
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

    try {
        const [created] = await db.insert(location).values({
            ...result.data,
            slug: result.data.name.replaceAll(' ', '-').toLowerCase(),
            userId: event.context.user.id,
        }).returning();
        return created
    } catch (e) {
        const error = e as DrizzleError;
        // @ts-ignore
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
