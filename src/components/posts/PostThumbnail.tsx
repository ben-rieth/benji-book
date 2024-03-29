import type { Likes, Post, Comment } from "@prisma/client";
import Image from "next/image";
import { type FC } from "react";
import Link from "next/link";

type PostThumbnailProps = {
    post: Post & { comments: Comment[], likedBy: Likes[] };
}

const PostThumbnail:FC<PostThumbnailProps> = ({ post }) => {
    return (
        <Link href={`/posts/${post.id}`}>
            <article className="aspect-square w-full relative cursor-pointer md:hover:scale-105 overflow-hidden">
                <Image 
                    src={post.image as string}
                    alt="Post Image"
                    fill
                    className="object-cover rounded"
                />
            </article>
        </Link>
    )
};

export default PostThumbnail;