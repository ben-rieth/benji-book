import type { FC } from 'react';
import type { Comment, User } from '@prisma/client';
import Avatar from '../users/Avatar';
import Link from 'next/link';

type CommentCardProps = {
    comment: Comment & { author: User | null };
}

const CommentCard : FC<CommentCardProps> = ({ comment }) => {
    return (
        <div key={comment.id} className="p-2 rounded-lg shadow-lg w-full bg-white">
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
        </div>
    )
}

export default CommentCard;