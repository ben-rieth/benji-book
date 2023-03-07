import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const postRouter = createTRPCRouter({
    getAllPosts: protectedProcedure
        .query(({ ctx }) => {
            return ctx.prisma.follows.findMany({
                where: {
                    followerId: ctx.session.user.id,
                    status: 'accepted',
                },
                // get from the user's relationships
                select: {
                    following: {
                        // users that they follow
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            image: true,
                            // and their posts
                            posts: {
                                select: {
                                    id: true,
                                    text: true,
                                    image: true,
                                    createdAt: true,
                                    comments: true
                                }
                            }
                        }
                    }
                }
            })
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
            postId: z.string().cuid() 
        }))
        .query(async ({ input, ctx }) => {
            
            const post = await ctx.prisma.post.findUnique({
                where: { id: input.postId },
                include: {
                    author: true,
                    comments: {
                        include: {
                            author: true,
                        }
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
        .query(async ({ input, ctx }) => {
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