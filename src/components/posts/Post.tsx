import type { User, Likes, Post as PostType } from "@prisma/client";
import type { FC} from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import Avatar from "../users/Avatar";
import Image from 'next/image';
import Link from "next/link";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { AiFillEdit } from "react-icons/ai";

type PostProps = {
    post: PostType & {
        author: User;
        likedBy: Likes[] };
    containerClasses?: string;
    changeLike: (liked: boolean) => void;
}

const Post : FC<PostProps> = ({ post, containerClasses="", changeLike }) => {
    
    const { data: session } = useSession();
    
    return (
        <article className={containerClasses}>
            <div className="w-full bg-white rounded-t-lg px-2 py-1 relative">
                <Link href={`/users/${post.authorId}`} className="flex flex-row gap-2 w-fit">
                    <Avatar url={post.author.image} className="w-10 h-10" />
                    <div className="flex flex-col justify-center">
                        <p className="text-sm text-slate-300 -mb-1">@{post.author.username}</p>
                        <p className="text-lg">{post.author.firstName} {post.author.lastName}</p>
                    </div>
                </Link>
                { session?.user?.id === post.authorId && <AiFillEdit className="absolute top-2 right-2 w-8 h-8 fill-sky-500 hover:fill-sky-600 cursor-pointer" />}
            </div>
            <div className="aspect-square w-full relative">
                <Image 
                    src={post.image as string}
                    alt="Post Image"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute bg-white p-3 bottom-0 right-0 rounded-tl-xl">
                    {!!post.likedBy.find(like => like.userId === session?.user?.id) ? (
                        <BsHeartFill 
                            className="w-9 h-9 fill-rose-500 hover:fill-rose-600 hover:cursor-pointer" 
                            onClick={() => changeLike(false)}
                        /> 
                    ) : (
                        <BsHeart 
                            className="w-9 h-9 fill-rose-500 hover:fill-rose-600 hover:cursor-pointer" 
                            onClick={() => changeLike(true)}
                        /> 
                    )}
                </div>
            </div>
            <div className="p-2 shadow-lg rounded-b-lg bg-white">
                <p className=" md:text-lg xl:text-xl">{post.text}</p>
                <p className="text-sm md:text-base text-slate-400">
                    {post.likedBy.length} Likes&nbsp;|&nbsp;
                    {formatDistanceToNow(post.createdAt)} ago
                    {post.createdAt.toISOString() !== post.updatedAt.toISOString() && " | Updated"}
                </p>
            </div>
            
        </article>
    )
};

export default Post;