import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '@/db';
import { weapons } from '@/db/schema';

export const weponsRouter = router({
  list: publicProcedure.query(async () => {
    return await db.select().from(weapons);
  }),
  add: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db.insert(weapons).values(input).returning();
      return result[0];
    }),
});
