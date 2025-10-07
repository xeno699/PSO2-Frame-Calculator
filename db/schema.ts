import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core';

export const classes = pgTable('classes', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
});

export const actions = pgTable('actions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  power: integer('power').notNull(),
  frames: integer('frames').notNull(),
  maxUsage: integer('max_usage').default(1).notNull(),
  buffer: integer('buffer').default(0).notNull(),
  classId: integer('class_id')
    .notNull()
    .references(() => classes.id),
});
