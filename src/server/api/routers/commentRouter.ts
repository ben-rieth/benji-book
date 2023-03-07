import { createTRPCRouter, protectedProcedure } from "../trpc";
import {z } from 'zod';

const commentRouter = createTRPCRouter({
    leaveComment: protectedProcedure
        .input(z.object({
            postId: z.string().cuid(),
            commentText: z.string(),
        }))
        .mutation( async ({ input, ctx }) => {
            await ctx.prisma.comment.create({
                data: {
                    postId: input.postId,
                    authorId: ctx.session.user.id,
                    text: input.commentText
                }
            })
        }
    ),

    updateComment: protectedProcedure
        .input(z.object({
            commentId: z.string().cuid(),
            newText: z.string(),
        }))
        .query(async ({ input, ctx }) => {
            await ctx.prisma.comment.update({
                where: { id: input.commentId },
                data: { text: input.newText }
            })
        }
    ),

    deleteComment: protectedProcedure
        .input(z.object({
            commentId: z.string().cuid(),
        }))
        .query(async ({ input, ctx }) => {
            await ctx.prisma.comment.delete({
                where: {
                    id: input.commentId
                }
            })
        }
    ),
});

export default commentRouter;