import { int, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from '../../db/schema/auth';
import { location } from './location';
import { relations } from "drizzle-orm";
import {createInsertSchema} from "drizzle-zod";
import { z } from "zod";
import {locationValidation} from "~/lib/zodSchemas";

export const locationLog = sqliteTable('locationLog', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  startedAt: int().notNull(),
  endedAt: int().notNull(),
  lat: real().notNull(),
  long: real().notNull(),
  description: text(),
  locationId: int().notNull().references(() => location.id),
  userId: int().notNull().references(() => user.id),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const InsertLocationSchemaLog = createInsertSchema(locationLog, locationValidation
).omit({
  id: true,
  userId: true,
  locationId: true,
  createdAt: true,
  updatedAt: true,
});

export const locationLogRelations = relations(locationLog, ({ one }) => ({
  location: one(location, {
    fields: [locationLog.locationId],
    references: [location.id],
  }),
}));

export type InsertLocationLog = z.infer<typeof InsertLocationSchemaLog>;
export type SelectLocationLog = typeof locationLog.$inferSelect;
