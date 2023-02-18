import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

const postRouter = createTRPCRouter({
    getAllPosts: protectedProcedure.query(() => {
        return "all posts";
    }),

    createNewPost: protectedProcedure.query(() => {
        return "create";
    }),

    getPost: protectedProcedure
        .input(z.object({ id: z.string().cuid() }))
        .query(({ input}) => {
            return "get post";
        }
    ),

    updatePost: protectedProcedure
        .input(z.object({ id: z.string().cuid() }))
        .query(({ input}) => {
            return "update post";
        }
    ),

    deletePost: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(({ input}) => {
        return "delete post";
    }
),

});

export default postRouter;