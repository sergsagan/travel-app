import type { InferSelectModel } from 'drizzle-orm';

import { and, eq } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';

import type { InsertLocation } from '~/lib/db/schema';

import db from '~/lib/db';
import { location } from '~/lib/db/schema';

type Location = InferSelectModel<typeof location>;
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5);

export async function findLocation(slug: string, userId: number) {
  return db.query.location.findFirst({
    where: and(
        eq(location.slug, slug),
        eq(location.userId, userId),
    ),
  });
}

export async function findLocations(userId: number) {
  return db.query.location.findMany({
    where: eq(location.userId, userId),
  });
}

export async function findLocationByName(existing: InsertLocation, userId: number) {
  return db.query.location.findFirst({
    where: and(
      eq(location.name, existing.name),
      eq(location.userId, userId),
    ),
  });
}
export async function findLocationBySlug(slug: string) {
  return db.query.location.findFirst({
    where: eq(location.slug, slug),
  });
}

export async function findUniqueSlug(slug: string) {
  let existing = !!(await findLocationBySlug(slug));

  while (existing) {
    const id = nanoid();
    const idSlug = `${slug}-${id}`;
    existing = !!(await findLocationBySlug(idSlug));
    if (!existing) {
      return idSlug;
    }
  }

  return slug;
}

export async function insertLocation(insertable: InsertLocation, slug: string, userId: number): Promise<Location> {
  const created = await db.insert(location).values({
    ...insertable,
    slug,
    userId,
  }).returning();

  if (!created[0]) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create location',
    });
  }

  return created[0];
}
