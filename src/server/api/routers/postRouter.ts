import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

const postRouter = createTRPCRouter({
    getAllPosts: protectedProcedure.query(() => {
        return "all posts";
    }),

    createNewPost: protectedProcedure
        .input(z.object({
            postText: z.string(),
        }))
        .query(() => {
            return "create";
        }
    ),

    getPost: protectedProcedure
        .input(z.object({ 
            postId: z.string().cuid() 
        }))
        .query(({ input}) => {
            return "get post";
        }
    ),

    updatePost: protectedProcedure
        .input(z.object({ 
            postId: z.string().cuid(),
            newText: z.string(), 
        }))
        .query(({ input }) => {
            return "update post";
        }
    ),

    deletePost: protectedProcedure
        .input(z.object({ 
            postId: z.string().cuid() 
        }))
        .query(({ input}) => {
            return "delete post";
        }
    ),

    likePost: protectedProcedure
        .input(z.object({ 
            postId: z.string().cuid(), 
        }))
        .query(({ input }) => {
            return 'like post'
        }
    ),

    unlikePost: protectedProcedure
        .input(z.object({
            postId: z.string().cuid(),
        }))
        .query(({ input }) => {
            return 'unlike post'
        }
    ),

});

export default postRouter;