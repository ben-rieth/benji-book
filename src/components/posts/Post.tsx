import type { User, Likes, Post as PostType } from "@prisma/client";
import type { FC} from "react";
import { useMemo } from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { TbHeartBroken } from 'react-icons/tb';
import Avatar from "../users/Avatar";
import Image from 'next/image';
import Link from "next/link";
import { api } from "../../utils/api";
import { useSession } from "next-auth/react";

type PostProps = {
    post: PostType & {
        author: User;
        likedBy: Likes[] };
    containerClasses?: string;
}

const Post : FC<PostProps> = ({ post, containerClasses="" }) => {
    
    const { data: session } = useSession();

    const apiUtils = api.useContext();
    const { mutate } = api.posts.toggleLike.useMutation({
        onMutate: async (values) => {
            await apiUtils.posts.getPost.cancel();

            apiUtils.posts.getPost.setData(
                { postId: values.postId }, 
                prev => {
                    if (!prev) return;
                    return {
                        ...prev, 
                        likedBy: [
                            ...prev.likedBy,
                            {
                                postId: values.postId,
                                userId: session?.user?.id,
                                unliked: !values.liked,
                            } as Likes
                        ]
                    }
                }
            );
        },

        onSettled: async () => {
            await apiUtils.posts.getPost.invalidate({ postId: post.id });
        }
    });

    const likedStatus: 'none' | 'liked' | 'unliked' = useMemo(() => {
        const like = post.likedBy.find(like => like.userId === session?.user?.id);

        if (!like) return 'none';

        if (like.unliked) return 'unliked';
        
        return 'liked';
    }, [post.likedBy, session?.user?.id]);

    const likePost = () => {
        mutate({ postId: post.id, liked: true });
    }

    const unlikePost = () => {
        mutate({ postId: post.id, liked: false })
    }
    
    return (
        <article className={containerClasses}>
            <div className="w-full bg-white rounded-t-lg px-2 py-1">
                <Link href={`/users/${post.authorId}`} className="flex flex-row gap-2 w-fit">
                    <Avatar url={post.author.image} className="w-10 h-10" />
                    <div className="flex flex-col justify-center">
                        <p className="text-sm text-slate-300 -mb-1">@{post.author.username}</p>
                        <p className="text-lg">{post.author.firstName} {post.author.lastName}</p>
                    </div>
                </Link>
            </div>
            <div className="aspect-square w-full relative">
                <Image 
                    src={post.image as string}
                    alt="Post Image"
                    fill
                    priority
                    className="object-contain"
                />
                <div className="absolute bg-white p-3 bottom-0 right-0 rounded-tl-xl">
                    {likedStatus === 'liked' && <BsHeartFill className="w-7 h-7 fill-rose-500 hover:fill-rose-600 hover:cursor-pointer" onClick={unlikePost}/> }
                    {likedStatus === 'unliked' && <TbHeartBroken className="w-7 h-7 scale-125 fill-rose-500 hover:fill-rose-600 hover:cursor-pointer" onClick={likePost}/> }
                    {likedStatus === 'none' && <BsHeart className="w-7 h-7 hover:fill-rose-500 hover:cursor-pointer" onClick={likePost} />}
                </div>
            </div>
            <p className="p-2 shadow-lg rounded-b-lg bg-white md:text-lg">{post.text}</p>
        </article>
    )
};

export default Post;