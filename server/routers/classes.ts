import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '@/db';
import { classes } from '@/db/schema';

export const classesRouter = router({
  list: publicProcedure.query(async () => {
    return await db.select().from(classes);
  }),
  add: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db.insert(classes).values(input).returning();
      return result[0];
    }),
});
