import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistance } from 'date-fns';

type LikeCardProps = {
    postId: string;
    postImage: string | null;
    postPlaceholder: string | null;
    username: string | null;
    userId: string;
    createdAt: Date;
}

const LikeCard: FC<LikeCardProps> = ({ postId, postImage, postPlaceholder, username, userId, createdAt }) => {
    return (
        <article className="group bg-white shadow-md rounded-lg p-3 w-full flex flex-row gap-5 items-center">
            <Link href={`/posts/${postId}`} className="relative aspect-square w-24 hover:scale-105">
                <Image 
                    src={postImage as string}
                    alt="Image for the post"
                    className="object-cover rounded-lg"
                    placeholder={postPlaceholder ? 'blur' : 'empty'}
                    blurDataURL={postPlaceholder as string}
                    fill
                />
            </Link>

            <p>
                <Link href={`/users/${userId}`} className="hover:underline">@{username}</Link> liked your post {formatDistance(createdAt, new Date())} ago.
            </p>
        </article>
    )
}

export default LikeCard;