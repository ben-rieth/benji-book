import { createTRPCRouter, protectedProcedure } from "../trpc";
import {z } from 'zod';

const commentRouter = createTRPCRouter({
    getAllComments: protectedProcedure
        .input(z.object({
            postId: z.string().cuid(),
        }))
        .query(({ input }) => {
            return "get all comments"
        }
    ),

    leaveComment: protectedProcedure
        .input(z.object({
            postId: z.string().cuid(),
            commentText: z.string(),
            commentAuthorId: z.string().cuid(),
        }))
        .query(({ input }) => {
            return "new comment"
        }
    ),

    updateComment: protectedProcedure
        .input(z.object({
            postId: z.string().cuid(),
            commentId: z.string().cuid(),
            newText: z.string(),
        }))
        .query(({ input }) => {
            return "updated comment";
        }
    ),

    deleteComment: protectedProcedure
        .input(z.object({
            postId: z.string().cuid(),
            commentId: z.string().cuid(),
        }))
        .query(({ input }) => {
            return "deleted comment";
        }
    ),
});

export default commentRouter;