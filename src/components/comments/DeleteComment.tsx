import { AiFillDelete } from 'react-icons/ai';
import { api } from '../../utils/api';
import { toast } from 'react-hot-toast';
import { type FC } from 'react';
import type { Comment, User } from '@prisma/client';
import Alert from '../general/Alert';

type DeleteCommentProps = {
    comment: Comment & { author: User | null }
}

const DeleteComment: FC<DeleteCommentProps> = ({ comment }) => {

    const apiUtils = api.useContext();
    const { mutate: deleteComment } = api.comments.deleteComment.useMutation({
        onMutate: async () => {
            await apiUtils.comments.getAllComments.cancel();

            apiUtils.comments.getAllComments.setData(
                {postId: comment.postId },
                prev => {
                    if (!prev) return;
                    return prev.filter(item => item.id !== comment.postId)
                }
            )
        },
        onSuccess: () => toast.success("Comment deleted!"),
        onError: () => toast.error("Could not delete comment."),
        onSettled: () => apiUtils.comments.getAllComments.invalidate({ postId: comment.postId }),
    });

    return (
        <Alert 
            title="Are you sure?" 
            description="This action cannot be undone. This comment will be permanently deleted from our servers."
            actionLabel="Delete Comment"
            handleAction={() => deleteComment({ commentId: comment.id })}
        >
            <AiFillDelete className="fill-red-500 w-6 h-6 cursor-pointer hover:scale-110 hover:fill-red-600" />
        </Alert>
    )   
}

export default DeleteComment;