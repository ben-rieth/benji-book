import { api } from '../../utils/api';
import { toast } from 'react-hot-toast';
import { type FC } from 'react';
import type { Comment, User } from '@prisma/client';
import Alert from '../general/Alert';
import { DeleteIcon } from '../general/icons';

type DeleteCommentProps = {
    comment: Comment & { author: User | null }
}

const DeleteComment: FC<DeleteCommentProps> = ({ comment }) => {

    const apiUtils = api.useContext();
    const { mutate: deleteComment } = api.comments.deleteComment.useMutation({
        onMutate: async () => {
            await apiUtils.comments.getAllComments.cancel();
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
            trigger={<DeleteIcon />}
        />
    )   
}

export default DeleteComment;