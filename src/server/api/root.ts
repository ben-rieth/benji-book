import commentRouter from "./routers/commentRouter";
import postRouter from "./routers/postRouter";
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
    comments: commentRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
