import { router } from '../trpc';
import { actionsRouter } from './actions';
import { weponsRouter } from './wepons';

export const appRouter = router({
  actions: actionsRouter,
  weapons: weponsRouter,
});

export type AppRouter = typeof appRouter;
