import { router } from "../trpc";
import { actionsRouter } from "./actions";

export const appRouter = router({
  actions: actionsRouter,
});

export type AppRouter = typeof appRouter;