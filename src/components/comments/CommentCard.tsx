import type { FC } from 'react';
import type { Comment, User } from '@prisma/client';
import Avatar from '../users/Avatar';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useSession } from 'next-auth/react';
import UpdateComment from './UpdateComment';
import DeleteComment from './DeleteComment';

type CommentCardProps = {
    comment: Comment & { author: User | null };
    postAuthor: string;
}

const CommentCard : FC<CommentCardProps> = ({ comment, postAuthor }) => {

    const { data: session } = useSession();

    return (
        <div key={comment.id} className="relative p-2 rounded-lg shadow-lg w-full bg-white" id={comment.id}>
            <Link className="flex flex-row gap-2 w-fit items-center" href={`/users/${comment.authorId as string}`}>
                <Avatar url={comment.author?.image} className="w-10 h-10" />
                <div className="flex flex-col justify-center">
                    <p className="text-sm text-slate-300 -mb-1">
                        {comment.author ? `@${comment.author.username as string}` : '@deleted_user'}
                    </p>
                    <p className="text-lg">
                        {comment.author ? 
                            `${comment.author.firstName as string} ${comment.author.lastName as string}` 
                            : 'Deleted User'
                        }
                    </p>
                </div>
            </Link>
            <p  className="text-left text-sm">{comment.text}</p>
            <p className="text-sm text-slate-400">
                {formatDistanceToNow(comment.createdAt)} ago
                {comment.createdAt.toISOString() !== comment.updatedAt.toISOString() && " | Updated"}
            </p>

            <div className="flex gap-3 absolute top-2 right-2">
                {session?.user?.id === comment.authorId && <UpdateComment comment={comment} />}
                {(session?.user?.id === comment.authorId || session?.user?.id === postAuthor) && <DeleteComment comment={comment} />}
            </div>
        </div>
    )
}

export default CommentCard;