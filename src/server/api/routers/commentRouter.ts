import { createTRPCRouter, protectedProcedure } from "../trpc";
import {z } from 'zod';
import { TRPCError } from "@trpc/server";

const commentRouter = createTRPCRouter({
    leaveComment: protectedProcedure
        .input(z.object({
            postId: z.string().cuid(),
            commentText: z.string(),
        }))
        .mutation( async ({ input, ctx }) => {
            
            const comment = await ctx.prisma.comment.create({
                data: {
                    postId: input.postId,
                    authorId: ctx.session.user.id,
                    text: input.commentText
                }
            });

            return comment.id;
        }
    ),

    updateComment: protectedProcedure
        .input(z.object({
            commentId: z.string().cuid(),
            newText: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            const { count } = await ctx.prisma.comment.updateMany({
                where: { 
                    id: input.commentId,
                    authorId: ctx.session.user.id,
                },
                data: { text: input.newText }
            });

            if (count === 0) {
                throw new TRPCError({ code: 'UNAUTHORIZED' })
            }
        }
    ),

    deleteComment: protectedProcedure
        .input(z.object({
            commentId: z.string().cuid(),
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.prisma.comment.delete({
                where: {
                    id: input.commentId
                }
            })
        }
    ),

    getAllComments: protectedProcedure
        .input(z.object({
            postId: z.string().cuid(),
            sortOrder: z.enum(["oldest", "newest"]).optional()
        }))
        .query(async ({ input, ctx }) => {

            const [comments, post] = await Promise.all([
                ctx.prisma.comment.findMany({
                    where: { postId: input.postId },
                    include: {
                        author: true,
                    }
                }),
                ctx.prisma.post.findUnique({
                    where: { id: input.postId }
                }),
            ]);

            if (post.authorId === ctx.session.user.id) return comments;

            if (!post) {
                throw new TRPCError({ code: 'NOT_FOUND'});
            }

            const relationship = await ctx.prisma.follows.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: ctx.session.user.id,
                        followingId: post?.authorId,
                    },
                },
                select: {
                    status: true,
                }
            });

            if (!relationship?.status || relationship.status !== 'accepted') {
                throw new TRPCError({ code: 'FORBIDDEN' })
            }

            return comments;
        })
});

export default commentRouter;