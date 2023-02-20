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
        .query(() => {
            return 'get all users'
        }
    ),

    getOneUser: protectedProcedure
        .input(z.object({
            userId: z.string().cuid(),
        }))
        .query(({ input }) => {
            return 'get user'
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