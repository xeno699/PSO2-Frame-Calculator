import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '@/db';
import { actions } from '@/db/schema';

export const actionsRouter = router({
  list: publicProcedure.query(async () => {
    return await db.select().from(actions);
  }),
  add: publicProcedure
    .input(
      z.object({
        name: z.string(),
        power: z.number(),
        frames: z.number(),
        maxUsage: z.number().default(1),
        buffer: z.number().default(0),
        classId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db.insert(actions).values(input).returning();
      return result[0];
    }),
});
