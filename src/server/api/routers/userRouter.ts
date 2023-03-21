import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import type { FullUser, PrivateUser, Self } from '../../../types/User';

import { v2 as cloudinary } from 'cloudinary';
import { env } from "../../../env.mjs";
import { TRPCError } from '@trpc/server';

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
});

const userRouter = createTRPCRouter({
    getAllUsers: protectedProcedure
        .input(z.object({
            query: z.string(),
        }))
        .query(({ ctx, input }) => {
            if (input.query === '') return [];

            return ctx.prisma.user.findMany({
                where: { 
                    id: { not: ctx.session.user.id },
                    OR: [
                        { firstName: { contains: input.query }},
                        { lastName: { contains: input.query }},
                        { username: { contains: input.query }}
                    ],
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    image: true,
                    followedBy: {
                        where: {
                            followerId: ctx.session.user.id,
                        },
                        select: {
                            status: true,
                        }
                    }
                },
            });
        }
    ),

    getOneUser: protectedProcedure
        .input(z.object({
            userId: z.string().cuid(),
        }))
        .query(async ({ input, ctx }) : Promise<FullUser | PrivateUser | Self | null> => {
            // if user is getting their own info
            if (input.userId === ctx.session.user.id) {
                const user = await ctx.prisma.user.findUnique({
                    where: { id: input.userId },
                    include: {
                        posts: {
                            include: {
                                comments: true,
                                likedBy: true,
                            },
                            orderBy: {
                                createdAt: 'desc',
                            },
                        },
                        likes: true,
                    }
                });

                const [followedByCount, followingCount, requestCount] = await Promise.all([
                    ctx.prisma.follows.count({
                        where: { followingId: input.userId, status: 'accepted' }
                    }),
                    ctx.prisma.follows.count({
                        where: { followerId: input.userId, status: 'accepted' }
                    }),
                    ctx.prisma.follows.count({
                        where: { followerId: input.userId, status: 'pending' },
                    })
                ]);

                return user ? { 
                    ...user, 
                    status: 'self',
                    _count: { 
                        followedBy: followedByCount, 
                        following: followingCount, 
                        requests: requestCount,
                }
                } : null;
            }
                // otherwise find relationship of two people
            const relationship = await ctx.prisma.follows.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: ctx.session.user.id,
                        followingId: input.userId
                    }
                },
                select: {
                    status: true,
                    updatedAt: true,
                }
            });

            // return all info if the session user is following the searched for user
            if (relationship?.status && relationship.status === 'accepted') {
                const user = await ctx.prisma.user.findUnique({
                    where: { id: input.userId },
                    include: {
                        posts: {
                            include: {
                                comments: true,
                                likedBy: true,
                            }
                        },
                        _count: {
                            select: {
                                followedBy: {
                                    where: {
                                        status: 'accepted'
                                    }
                                },
                                following: {
                                    where: {
                                        status: 'accepted'
                                    }
                                },
                            }
                        }
                    }
                });

                return user ? { ...user, status: 'accepted' } : null;
            }

            // return limited info if users don't follow
            const user = await ctx.prisma.user.findUnique({
                where: {
                    id: input.userId,
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    image: true,
                    bio: true,
                    username: true,
                    _count: {
                        select: {
                            followedBy: {
                                where: {
                                    status: 'accepted'
                                }
                            },
                            following: {
                                where: {
                                    status: 'accepted'
                                }
                            },
                        }
                    }
                }
            });

            if (relationship?.status === 'pending') 
                return user ? 
                    { ...user, status: 'pending', statusUpdatedAt: relationship.updatedAt as Date} 
                    : null;
            if (relationship?.status === 'denied') 
                return user ? 
                    { ...user, status: 'denied', statusUpdatedAt: relationship.updatedAt as Date } 
                    : null;
            
            return user ? { ...user, status: null, statusUpdatedAt: null } : null;
        }
    ),

    deleteAccount: protectedProcedure
        .query(async ({ ctx }) => {
            await ctx.prisma.user.delete({
                where: { id: ctx.session.user.id }
            });
        }
    ),

    updateName: protectedProcedure
        .input(z.object({
            newFirst: z.string(),
            newLast: z.string(),
        }))
        .query(async ({ input, ctx}) => {
            await ctx.prisma.user.update({
                where: { id: ctx.session.user.id },
                data: {
                    firstName: input.newFirst,
                    lastName: input.newLast,
                }
            })
        }
    ),

    updateAccount: protectedProcedure
        .input(z.object({
            firstName: z.string(),
            lastName: z.string(),
            username: z.string(),
            gender: z.enum(['male', 'female', 'transgender', 'non-binary', 'agender', 'other']).optional(),
            birthday: z.date().optional(),
            bio: z.string().optional(),
        }))
        .mutation(({ input, ctx }) => {
            return ctx.prisma.user.update({
                where: { id: ctx.session.user.id },
                data: {
                    firstName: input.firstName,
                    lastName: input.lastName,
                    username: input.username,
                    gender: input.gender,
                    birthday: input.birthday,
                    bio: input.bio,
                    setData: true,
                }
            });

        }
    ),

    updateAvatar: protectedProcedure
        .input(z.object({
            userId: z.string(),
            image: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {

            try {
                const res = await cloudinary.uploader.upload(input.image, { public_id: `${input.userId}-avatar`, overwrite: true });
                // const { base64 } = await getPlaiceholder(res.secure_url);
                await ctx.prisma.user.update({
                    where: { id: input.userId },
                    data: {
                        image: res.secure_url
                    }
                });
            } catch (err) {
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
            }
        }),
});

export default userRouter;