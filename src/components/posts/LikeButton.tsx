import type { Likes } from "@prisma/client";
import { type FC, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { api } from "../../utils/api";

type LikeButtonProps = {
    postId: string;
    postLikes: Likes[];
    currentUserId: string;
}

const LikeButton: FC<LikeButtonProps> = ({ postId, currentUserId, postLikes }) => {
    const likedByCurrentUser = useMemo(() => !!postLikes.find(like => like.userId === currentUserId), [currentUserId, postLikes]);

    const apiUtils = api.useContext();

    const optimisticallyUpdateInfinitePosts = useCallback((postId: string, userId: string, liked: boolean, utils: typeof apiUtils) => {
        utils.posts.getAllPosts.setInfiniteData(
            { limit: 10 },
            prev => {
                if (!prev) 
                    return {
                        pages: [],
                        pageParams: [],
                    };

                return {
                    ...prev, 
                    pages: prev.pages.map(page => ({
                        ...page,
                        posts: page.posts.map((item) => {
                            if (item.id !== postId) return item;

                            return { 
                                ...item,
                                likedBy: liked ? [
                                    ...item.likedBy,
                                    {
                                        postId: postId,
                                        userId: userId,
                                        createdAt: new Date(),
                                    } as Likes
                                ] : item.likedBy.filter(like => like.postId !== postId && like.userId !== userId)
                            }
                        })
                    }))
                }
                
            }
        );
    }, []);

    const optimisticallyUpdateSinglePost = useCallback((postId: string, userId: string, liked: boolean, utils: typeof apiUtils) => {
        utils.posts.getPost.setData(
            { postId }, 
            prev => {
                if (!prev) return;
                return {
                    ...prev, 
                    likedBy: liked ? [
                        ...prev.likedBy,
                        {
                            postId: postId,
                            userId: userId,
                            createdAt: new Date(),
                        } as Likes
                    ] : prev.likedBy.filter(like => like.postId !== postId && like.userId !== userId)
                }
            }
        );
    }, [])

    const { mutate } = api.posts.toggleLike.useMutation({
        onMutate: async (values) => {
            await apiUtils.posts.getAllPosts.cancel();
            await apiUtils.posts.getPost.cancel();

            const infinitePrevData = apiUtils.posts.getAllPosts.getInfiniteData({ limit: 10 });
            const prevData = apiUtils.posts.getPost.getData({ postId: values.postId });

            optimisticallyUpdateInfinitePosts(values.postId, currentUserId, values.liked, apiUtils);
            optimisticallyUpdateSinglePost(values.postId, currentUserId, values.liked, apiUtils);
            
            return { infinitePrevData, prevData };
        },

        onError: (_err, values, ctx) => {
            apiUtils.posts.getPost.setData({ postId: values.postId }, ctx?.prevData);
            apiUtils.posts.getAllPosts.setInfiniteData({ limit: 10 }, ctx?.infinitePrevData);
            toast.error("Could not like post")
        },

        onSettled: async () => {
            await apiUtils.posts.getAllPosts.invalidate({ limit: 10 });
        }
    });

    if (likedByCurrentUser) {
        return (
            <BsHeartFill 
                className="w-7 h-7 fill-rose-500 hover:fill-rose-600 hover:cursor-pointer" 
                onClick={() => mutate({ liked: false, postId })}
            /> 
        )
    } else {
        return (
            <BsHeart 
                className="w-7 h-7 fill-rose-500 hover:fill-rose-600 hover:cursor-pointer" 
                onClick={() => mutate({ liked: true, postId })}
            /> 
        )
    }

}

export default LikeButton;