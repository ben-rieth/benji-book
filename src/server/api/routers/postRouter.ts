import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

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
                            name: true,
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
        .query(({ input}) => {
            return "get post";
        }
    ),

    updatePost: protectedProcedure
        .input(z.object({ 
            postId: z.string().cuid(),
            newText: z.string(), 
        }))
        .query(({ input }) => {
            return "update post";
        }
    ),

    deletePost: protectedProcedure
        .input(z.object({ 
            postId: z.string().cuid() 
        }))
        .query(({ input}) => {
            return "delete post";
        }
    ),

    likePost: protectedProcedure
        .input(z.object({ 
            postId: z.string().cuid(), 
        }))
        .query(({ input }) => {
            return 'like post'
        }
    ),

    unlikePost: protectedProcedure
        .input(z.object({
            postId: z.string().cuid(),
        }))
        .query(({ input }) => {
            return 'unlike post'
        }
    ),

});

export default postRouter;