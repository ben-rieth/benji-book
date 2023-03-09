import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from 'zod';
import { TRPCError } from "@trpc/server";

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

                const [user, followers] = await Promise.all([
                    ctx.prisma.user.findUnique({
                        where: { id: input.userId },
                        include: {
                            _count: {
                                select: { 
                                    followedBy: true,
                                    following: true,
                                },
                            },
                        },
                    }),
                    ctx.prisma.follows.findMany({
                        where: {
                            followingId: input.userId,
                        },
                        select: {
                            follower: true,
                        }
                    })
                ])

                return {
                    user,
                    followers,
                }
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

            const [user, followers] = await Promise.all([
                ctx.prisma.user.findUnique({
                    where: { id: input.userId },
                    include: {
                        _count: {
                            select: { 
                                followedBy: true,
                                following: true,
                            },
                        },
                    },
                }),
                ctx.prisma.follows.findMany({
                    where: {
                        followingId: input.userId,
                    },
                    include: {
                        follower: true,
                    }
                })
            ])

            return {
                user,
                followers,
            }
        }),

        getFollowing: protectedProcedure
            .input(z.object({
                userId: z.string().cuid(),
            }))
            .query(async ({ ctx, input }) => {
                if (input.userId === ctx.session.user.id) {
                    const [user, following] = await Promise.all([
                        ctx.prisma.user.findUnique({
                            where: { id: input.userId },
                            include: {
                                _count: {
                                    select: { 
                                        followedBy: true,
                                        following: true,
                                    },
                                },
                            },
                        }),
                        ctx.prisma.follows.findMany({
                            where: {
                                followerId: input.userId,
                            },
                            include: {
                                following: true,
                            }
                        })
                    ])
    
                    return {
                        user,
                        following,
                    }
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

                const [user, following] = await Promise.all([
                    ctx.prisma.user.findUnique({
                        where: { id: input.userId },
                        include: {
                            _count: {
                                select: { 
                                    followedBy: true,
                                    following: true,
                                },
                            },
                        },
                    }),
                    ctx.prisma.follows.findMany({
                        where: {
                            followerId: input.userId,
                        },
                        include: {
                            following: true,
                        }
                    })
                ])

                return {
                    user,
                    following,
                }
            }),
});

export default followsRouter;