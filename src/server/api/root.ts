import commentRouter from "./routers/commentRouter";
import followsRouter from "./routers/followsRouter";
import postRouter from "./routers/postRouter";
import settingsRouter from "./routers/settingsRouter";
import userRouter from "./routers/userRouter";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
    users: userRouter,
    posts: postRouter,
    comments: commentRouter,
    follows: followsRouter,
    settings: settingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
