import { pgTable, uuid, timestamp, text, uniqueIndex } from 'drizzle-orm/pg-core'

export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    fullName: text('full_name'),
    username: text('username'),
    avatarUrl: text('avatar_url'),
  },
  (table) => ({
    usernameUnique: uniqueIndex('profiles_username_key').on(table.username),
  })
)


export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
