import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

const userRouter = createTRPCRouter({
    getAllUsers: protectedProcedure
        .query(({ ctx }) => {
            return ctx.prisma.user.findMany({
                where: { id: { not: ctx.session.user.id } },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    image: true,
                }
            });
        }
    ),

    getOneUser: protectedProcedure
        .input(z.object({
            userId: z.string().cuid(),
        }))
        .query(async ({ input, ctx }) => {
            
            // if user is getting their own info
            if (input.userId === ctx.session.user.id) {
                return {
                    status: 'self',
                    user: ctx.prisma.user.findUnique({
                        where: { id: input.userId },
                        include: {
                            posts: true,
                            followedBy: true,
                            following: true,
                        }
                    })
                }
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


            let user;
            // return all info if the session user is following the searched for user
            if (relationship?.status && relationship.status === 'accepted') {
                user = await ctx.prisma.user.findUnique({
                    where: { id: input.userId },
                    include: {
                        posts: true,
                        followedBy: true,
                        following: true,
                    }
                });
            } else {
                // return limited info if users don't follow
                user = await ctx.prisma.user.findUnique({
                    where: {
                        id: input.userId,
                    },
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        image: true,
                    }
                });
            }

            return {
                status: relationship?.status,
                user,
            };
        }
    ),
    
    sendFollowRequest: protectedProcedure
        .input(z.object({
            followerId: z.string().cuid(),
            followingId: z.string().cuid(),
        }))
        .query(async ({ input, ctx }) => {
            await ctx.prisma.follows.create({
                data: {
                    followerId: input.followerId,
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

    setUpAccount: protectedProcedure
        .input(z.object({
            firstName: z.string(),
            lastName: z.string(),
            username: z.string(),
            gender: z.enum(['male', 'female', 'transgender', 'non-binary', 'agender', 'other']).optional(),
            birthday: z.date().optional(),
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
                    setData: true,
                }
            });

        })


});

export default userRouter;