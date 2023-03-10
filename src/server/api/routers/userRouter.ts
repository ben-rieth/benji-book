import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import type { FullUser, PrivateUser, Self } from '../../../types/User';

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
                            }
                        },
                        followedBy: true,
                        following: true,
                        likes: true,
                    }
                });

                return user ? { ...user, status: 'self' } : null;
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
                        followedBy: true,
                        following: true,
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
                }
            });

            if (relationship?.status === 'pending') return user ? { ...user, status: 'pending' } : null;
            if (relationship?.status === 'denied') return user ? { ...user, status: 'denied' } : null;
            
            return user ? { ...user, status: null } : null;
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
});

export default userRouter;