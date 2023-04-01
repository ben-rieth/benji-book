import type { Post, Comment, Likes } from "@prisma/client";
import Link from "next/link";
import type { FC } from "react";
import Button from "../general/Button";
import PostThumbnail from "./PostThumbnail";

type PostGridProps = {
    posts: (Post & { comments: Comment[], likedBy: Likes[] })[];
    self: boolean;
    archive?: boolean;
}

const PostGrid: FC<PostGridProps> = ({ posts, self, archive=false }) => {

    if (posts.length === 0) {
        return (
            <section className="w-full aspect-square md:aspect-auto flex flex-col items-center mt-5 gap-3">
                <p className="text-center">Nothing here!</p>
                {!archive && self && (
                    <Link href="/posts/create">
                        <Button variant="filled">
                            Create a Post
                        </Button>
                    </Link>
                )}
            </section>
        )
    }

    return (
        <section className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-auto gap-8 md:gap-4 mt-5">
            {posts.map(post => (
                <PostThumbnail post={post} key={post.id} />
            ))}
        </section>
    )
}

export default PostGrid;