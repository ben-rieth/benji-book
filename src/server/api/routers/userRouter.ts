import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

const userRouter = createTRPCRouter({
    getFollowers: protectedProcedure
        .input(z.object({
            userId: z.string().cuid(),
        }))
        .query(({ input }) => {
            return 'get user followers'
        }
    ),

    getFollowing: protectedProcedure
        .input(z.object({
            userId: z.string().cuid(),
        }))
        .query(({ input }) => {
            return 'get people that user follows'
        }
    ),

    getAllUsers: protectedProcedure
        .query(({ ctx }) => {
            return ctx.prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
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
            // if not following, just return id, name, image
            // if following, all info
            const relationship = await ctx.prisma.follows.findFirst({
                where: { 
                    followerId: ctx.session.user.id,
                    followingId: input.userId
                },
                select: {
                    status: true,
                }
            });

            let user;
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
                user = await ctx.prisma.user.findUnique({
                    where: {
                        id: input.userId,
                    },
                    select: {
                        id: true,
                        name: true,
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
        .query(({ input }) => {
            return 'send follow request'
        }
    ),

    changeFollowStatus: protectedProcedure
        .input(z.object({
            followerId: z.string().cuid(),
            followingId: z.string().cuid(),
            newStatus: z.enum(['accepted', 'denied'])
        }))
        .query(({ input }) => {
            return 'accept request'
        }
    ),


});

export default userRouter;