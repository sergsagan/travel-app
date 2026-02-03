import { InsertLocation, location } from "~/lib/db/schema";
import { createError } from 'h3'
import db from "~/lib/db";
import { verifyCsrf } from '~/server/utils/csrf'
import {and, DrizzleError, eq} from "drizzle-orm";
import slugify from 'slugify'
import { customAlphabet } from "nanoid";

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
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5);
    const existingLocation = await db.query.location.findFirst({
        where:
            and(
                eq(location.name, result.data.name),
                eq(location.userId, event.context.user.id)
            ),
    });

    if (existingLocation) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Location with this name already exists',
        })
    }

    let slug  = slugify(result.data.name)
    let existing = !!(await db.query.location.findFirst({
        where: eq(location.slug, slug),
    }));

    while (existing) {
        const id = nanoid();
        const idSlug = `${slug}-${id}`;
        existing = !!(await db.query.location.findFirst({
            where: eq(location.slug, idSlug),
        }));
        if (!existing) {
            slug = idSlug;
        }
    }

    try {
        const [created] = await db.insert(location).values({
            ...result.data,
            slug,
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
