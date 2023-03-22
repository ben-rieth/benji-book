import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import type { Likes, Post, User } from "@prisma/client";
import { RequestStatus } from "@prisma/client";
import { v2 as cloudinary } from 'cloudinary';
import { env } from "../../../env.mjs";
import { getPlaiceholder } from "plaiceholder";


cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
});

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
                        OR: [
                            {followedBy: {
                                some: {
                                    followerId: ctx.session.user.id,
                                    status: RequestStatus.ACCEPTED,
                                }
                            }},
                            { id: ctx.session.user.id }
                        ]
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
            image: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {

            const { id } = await ctx.prisma.post.create({
                data: {
                    authorId: ctx.session.user.id,
                    text: input.postText,
                }
            });
            try {
                const res = await cloudinary.uploader.upload(input.image, { public_id: id });
                const { base64 } = await getPlaiceholder(res.secure_url);
                await ctx.prisma.post.update({
                    where: { id },
                    data: {
                        image: res.secure_url,
                        placeholder: base64
                    }
                });
            } catch (err) {
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
            }


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

            if (post.authorId === ctx.session.user.id) {
                return post;
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

            if (!relationship?.status || relationship.status !== RequestStatus.ACCEPTED) {
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

            if (!relationship?.status || relationship.status !== RequestStatus.ACCEPTED) {
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
        .mutation( async ({ input, ctx }) => {
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
        .mutation(async ({ input, ctx }) => {

            await ctx.prisma.post.delete({
                where: {
                    id_authorId: {
                        id: input.postId,
                        authorId: ctx.session.user.id
                    }
                },
                include: {
                    likedBy: true,
                    comments: true,
                }
            });

            await cloudinary.uploader.destroy(input.postId)
        }
    ),

    toggleLike: protectedProcedure
        .input(z.object({
            postId: z.string().cuid(),
            liked: z.boolean(),
        }))
        .mutation(async ({ input, ctx }) => {
            if (!input.liked) {
                await ctx.prisma.likes.delete({
                    where: {
                        userId_postId: {
                            userId: ctx.session.user.id,
                            postId: input.postId
                        }
                    }
                });

                return input.postId;
            }

            await ctx.prisma.likes.create({
                data: {
                    postId: input.postId,
                    userId: ctx.session.user.id
                }
            });
            
            return input.postId;
        }
    ),
});

export default postRouter;