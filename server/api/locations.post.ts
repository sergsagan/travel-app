import type { DrizzleError } from 'drizzle-orm';

import { createError } from 'h3';
import slugify from 'slugify';

import { findLocationByName, findUniqueSlug, insertLocation } from '~/lib/db/queries/location';
import { InsertLocationSchema } from '~/lib/db/schema';
import defineAuthenticatedEventHandler from '~/utils/defineAuthenticatedEventHandler';
import sendZodError from "~/utils/sendZodError";

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, InsertLocationSchema.safeParse);

  if (!result.success) {
    return sendZodError(event, result.error);
  }
  const existingLocation = await findLocationByName(result.data, event.context.user.id);

  if (existingLocation) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Location with this name already exists',
    });
  }

  const slug = await findUniqueSlug(slugify(result.data.name));

  try {
    return insertLocation(result.data, slug, event.context.user.id);
  }
  catch (e) {
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
