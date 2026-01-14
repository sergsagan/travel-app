import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { locationLog } from './locationLog';
import { user } from "../../db/schema/auth";

export const locationImage = sqliteTable('locationImage', {
  id: int().primaryKey({ autoIncrement: true }),
  key: text().notNull(),
  locationLogId: int().notNull().references(() => locationLog.id, { onDelete: "cascade" }),
  userId: int().notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});
