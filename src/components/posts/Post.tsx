import type { User, Likes, Comment, Post as PostType } from "@prisma/client";
import type { FC } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import Avatar from "../users/Avatar";
import Image from 'next/image';
import Link from "next/link";
import { api } from "../../utils/api";

type PostProps = {
    post: PostType & {
        comments: (Comment & {
            author: User | null;
        })[];
        author: User;
        likedBy: Likes[] };
    containerClasses?: string;
}

const Post : FC<PostProps> = ({ post, containerClasses="" }) => {
    
    const { mutate: like } = api.posts.toggleLike.useMutation();
    
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
                    className="object-contain"
                />
                <div className="absolute bg-white p-3 bottom-0 right-0 rounded-tl-xl">
                    <AiOutlineHeart className="w-7 h-7 hover:fill-rose-500 hover:cursor-pointer" />
                </div>
            </div>
            <p className="p-2 shadow-lg rounded-b-lg bg-white md:text-lg">{post.text}</p>
        </article>
    )
};

export default Post;