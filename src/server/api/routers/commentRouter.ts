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

            const comment = await ctx.prisma.comment.findUnique({
                where: { id: input.commentId },
                include: {
                    post: {
                        select: {
                            authorId: true,
                        }
                    }
                }
            });

            if (!comment) throw new TRPCError({ code: "NOT_FOUND" })

            if (comment.authorId !== ctx.session.user.id && comment.post.authorId !== ctx.session.user.id) {
                throw new TRPCError({ code: "FORBIDDEN" })
            }

            await ctx.prisma.comment.delete({
                where: {
                    id: input.commentId,
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

            if (!post) {
                throw new TRPCError({ code: 'NOT_FOUND'});
            }

            if (post.authorId === ctx.session.user.id) 
                return {
                    comments,
                    postAuthor: post.authorId
                };

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

            return {
                comments,
                postAuthor: post.authorId
            };
        })
});

export default commentRouter;