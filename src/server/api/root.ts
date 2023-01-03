import { createTRPCRouter } from "./trpc";
import { blocksRouter } from "./routers/blocks";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  blocks: blocksRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
