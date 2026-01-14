import { relations, sql } from "drizzle-orm";
import {sqliteTable, text, integer, index, int} from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: integer({mode: 'boolean'})
    .notNull(),
  image: text(),
  createdAt: integer()
    .notNull(),
  updatedAt: integer()
    .notNull(),
});

export const session = sqliteTable(
  "session",
  {
    id: text().primaryKey().notNull(),
    expiresAt: integer().notNull(),
    token: text().notNull().unique(),
    createdAt: integer()
      .notNull(),
    updatedAt: integer()
      .notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: int().notNull().references(() => user.id, { onDelete: "cascade" }),
  },
);

export const account = sqliteTable(
  "account",
  {
    id: text().primaryKey().notNull(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: int().notNull().references(() => user.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: integer(),
    refreshTokenExpiresAt: integer(),
    scope: text(),
    password: text(),
    createdAt: integer().notNull(),
    updatedAt: integer().notNull(),
  },
);

export const verification = sqliteTable(
  "verification",
  {
    id: text().primaryKey().notNull(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: integer().notNull(),
    createdAt: integer().notNull(),
    updatedAt: integer().notNull()
  },
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
