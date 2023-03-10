import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import type { Likes, Post, User } from "@prisma/client";

const postRouter = createTRPCRouter({
    getAllPosts: protectedProcedure
        .input(z.object({
            limit: z.number().min(1).max(30).nullish(),
            cursor: z.string().nullish(),
        }))
        .query(async ({ ctx, input }) => {

            const limit = input.limit ?? 10;

            const posts : (Post & { author: User, likedBy: Likes[]})[] = await ctx.prisma.post.findMany({
                take: limit + 1,
                cursor: input.cursor ? { id: input.cursor } : undefined,
                where: {
                    author: {
                        followedBy: {
                            some: {
                                followerId: ctx.session.user.id,
                                status: 'accepted',
                            }
                        }
                    }
                },
                include: {
                    author: true,
                    likedBy: true,
                },
                orderBy: {
                    createdAt: 'desc',
                }
            
            });

            let nextCursor: string | undefined = undefined;
            if (posts.length > limit) {
                const nextItem = posts.pop();
                nextCursor = !!nextItem ? nextItem.id : undefined;
            }

            return {
                posts,
                nextCursor
            }
        }),

    createNewPost: protectedProcedure
        .input(z.object({
            postText: z.string(),
        }))
        .query(async ({ input, ctx }) => {
            await ctx.prisma.post.create({
                data: {
                    authorId: ctx.session.user.id,
                    text: input.postText,
                }
            });
        }
    ),

    getPost: protectedProcedure
        .input(z.object({
            postId: z.string().cuid(),
        }))
        .query(async ({ input, ctx }) => {
            const post = await ctx.prisma.post.findUnique({
                where: { id: input.postId },
                include: {
                    author: true,
                    likedBy: true,
                }
            });

            if (!post) {
                throw new TRPCError({ code: "NOT_FOUND" });
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

            return post;
        }
    ),

    getPostWithComments: protectedProcedure
        .input(z.object({ 
            postId: z.string().cuid(),
        }))
        .query(async ({ input, ctx }) => {

            const post = await ctx.prisma.post.findUnique({
                where: { id: input.postId },
                include: {
                    author: true,
                    comments: {
                        include: {
                            author: true,
                        },
                        orderBy: {
                            updatedAt: 'desc',
                        },
                    },
                    likedBy: true,
                }
            });

            if (!post) {
                throw new TRPCError({ code: "NOT_FOUND" });
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

            return post;
        }
    ),

    updatePost: protectedProcedure
        .input(z.object({ 
            postId: z.string().cuid(),
            newText: z.string(), 
        }))
        .query( async ({ input, ctx }) => {
            await ctx.prisma.post.update({
                where: {
                    id_authorId: {
                        id: input.postId,
                        authorId: ctx.session.user.id,
                    }
                },
                data: {
                    text: input.newText,
                }
            })
        }
    ),

    deletePost: protectedProcedure
        .input(z.object({ 
            postId: z.string().cuid() 
        }))
        .query(async ({ input, ctx }) => {
            await ctx.prisma.post.delete({
                where: {
                    id_authorId: {
                        id: input.postId,
                        authorId: ctx.session.user.id
                    }
                }
            })
        }
    ),

    toggleLike: protectedProcedure
        .input(z.object({
            postId: z.string().cuid(),
            liked: z.boolean(),
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.prisma.likes.upsert({
                where: {
                    userId_postId: {
                        userId: ctx.session.user.id,
                        postId: input.postId
                    }
                },
                update: {
                    unliked: !input.liked,
                },
                create: {
                    userId: ctx.session.user.id,
                    postId: input.postId,
                    unliked: !input.liked,
                }
            })
        }
    ),
});

export default postRouter;