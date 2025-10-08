import { router } from '../trpc';
import { actionsRouter } from './actions';
import { classesRouter } from './classes';

export const appRouter = router({
  actions: actionsRouter,
  classes: classesRouter,
});

export type AppRouter = typeof appRouter;
