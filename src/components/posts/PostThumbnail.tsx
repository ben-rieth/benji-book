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
            <article className="aspect-square w-full relative cursor-pointer hover:scale-105">
                <Image 
                    src={post.image as string}
                    alt="Post Image"
                    fill
                    className="object-contain"
                />
            </article>
        </Link>
    )
};

export default PostThumbnail;