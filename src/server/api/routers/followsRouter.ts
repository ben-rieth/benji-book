import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from 'zod';
import { TRPCError } from "@trpc/server";
import { prisma } from "../../db";

const getUserAndFollowers = (inputUserId: string, currentUserId?: string) => {
    return Promise.all([
        // prisma.user.findUnique({
        //     where: { id: inputUserId },
        //     include: {
        //         _count: {
        //             select: { 
        //                 followedBy: {
        //                     where: {
        //                         status: 'accepted'
        //                     }
        //                 },
        //                 following: {
        //                     where: {
        //                         status: 'accepted'
        //                     }
        //                 },
        //             },
        //         },
        //     },
        // }),
        prisma.follows.findMany({
            where: {
                followingId: inputUserId,
                status: 'accepted',
            },
            select: {
                follower: {
                    select: {
                        firstName: true,
                        lastName: true,
                        image: true, 
                        username: true,
                        id: true,
                        followedBy: {
                            where: {
                                followerId: currentUserId,
                            },
                            select: {
                                status: true,
                            }
                        }
                    }
                }
            }
        })
    ])
}

const getUserAndFollowing = (inputUserId: string, currentUserId?: string) => {
    return Promise.all([
        // prisma.user.findUnique({
        //     where: { id: inputUserId },
        //     include: {
        //         _count: {
        //             select: { 
        //                 followedBy: {
        //                     where: {
        //                         status: 'accepted'
        //                     }
        //                 },
        //                 following: {
        //                     where: {
        //                         status: 'accepted'
        //                     }
        //                 },
        //             },
        //         },
        //     },
        // }),
        prisma.follows.findMany({
            where: {
                followerId: inputUserId,
                status: 'accepted',
            },
            select: {
                following: {
                    select: {
                        firstName: true,
                        lastName: true,
                        image: true, 
                        username: true,
                        id: true,
                        followedBy: {
                            where: {
                                followerId: currentUserId,
                            },
                            select: {
                                status: true,
                            }
                        }
                    }
                },
            }
        })
    ])
}

const followsRouter = createTRPCRouter({
    sendFollowRequest: protectedProcedure
        .input(z.object({
            followingId: z.string().cuid(),
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.prisma.follows.create({
                data: {
                    followerId: ctx.session.user.id,
                    followingId: input.followingId,
                    status: 'pending',
                }
            });
        }
    ),

    deleteFollowRequest: protectedProcedure
        .input(z.object({
            followingId: z.string().cuid(),
            followerId: z.string().cuid()
        }))
        .mutation(async ({ input, ctx }) => {

            if (ctx.session.user.id !== input.followingId && ctx.session.user.id !== input.followerId) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }

            await ctx.prisma.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: input.followerId,
                        followingId: input.followingId,
                    }
                }
            });
        }),

    changeFollowStatus: protectedProcedure
        .input(z.object({
            followerId: z.string().cuid(),
            followingId: z.string().cuid(),
            newStatus: z.enum(['accepted', 'denied'])
        }))
        .query(async ({ input, ctx }) => {
            
            if (input.followingId !== ctx.session.user.id) {
                return;
            }

            await ctx.prisma.follows.update({
                where: {
                    followerId_followingId: {
                        followerId: input.followerId,
                        followingId: input.followingId,
                    }
                },
                data: {
                    status: input.newStatus,
                }
            })

        }
    ),

    getFollowers: protectedProcedure
        .input(z.object({
            userId: z.string().cuid(),
        }))
        .query(async ({ ctx, input }) => {
            if (input.userId === ctx.session.user.id) {

                const [followers] = await getUserAndFollowers(input.userId, input.userId);

                return followers;
            }

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

            if (!relationship?.status || relationship?.status !== 'accepted') {
                throw new TRPCError({ code: 'FORBIDDEN' })
            }

            const [followers] = await getUserAndFollowers(input.userId, ctx.session.user.id);

            return followers;
        }),

        getFollowing: protectedProcedure
            .input(z.object({
                userId: z.string().cuid(),
            }))
            .query(async ({ ctx, input }) => {
                if (input.userId === ctx.session.user.id) {
                    const [following] = await getUserAndFollowing(input.userId, input.userId);
    
                    return following;

                }

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

                if (!relationship?.status || relationship?.status !== 'accepted') {
                    throw new TRPCError({ code: 'FORBIDDEN' })
                }

                const [following] = await getUserAndFollowing(input.userId, ctx.session.user.id);

                return following;
            }),

        getRequests: protectedProcedure
            .input(z.object({
                userId: z.string().cuid()
            }))
            .query(({ ctx, input }) => {

                if (input.userId !== ctx.session.user.id) {
                    throw new TRPCError({ code: 'FORBIDDEN' })
                }

                return ctx.prisma.follows.findMany({
                    where: {
                        followerId: ctx.session.user.id,
                        status: 'pending',
                    },
                    select: {
                        following: {
                            select: {
                                firstName: true,
                                lastName: true,
                                image: true, 
                                username: true,
                                id: true,
                            }
                        },
                    }
                })
            }),

        getReceivedRequests: protectedProcedure
            .query(({ ctx }) => {
                return ctx.prisma.follows.findMany({
                    where: {
                        followingId: ctx.session.user.id,
                        status: 'pending',
                    },
                });
            })
});

export default followsRouter;