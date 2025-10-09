import { pgTable, serial, varchar, integer, doublePrecision } from 'drizzle-orm/pg-core';

export const weapons = pgTable('weapons', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
});

export const actions = pgTable('actions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  power: doublePrecision('power').notNull(),
  frames: integer('frames').notNull(),
  maxUsage: integer('max_usage').default(1).notNull(),
  weaponId: integer('weapon_id')
    .notNull()
    .references(() => weapons.id),
});
