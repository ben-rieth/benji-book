import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { AiFillDelete } from 'react-icons/ai';
import { api } from '../../utils/api';
import { toast } from 'react-hot-toast';
import { type FC } from 'react';
import type { Comment, User } from '@prisma/client';
import classNames from 'classnames';

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
        <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
                <AiFillDelete className="fill-red-500 w-6 h-6 cursor-pointer hover:scale-110 hover:fill-red-600" />
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
                
                <AlertDialog.Content className={classNames(
                        "data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[550px] translate-x-[-50%] translate-y-[-50%]",
                        "bg-white rounded-lg shadow-lg focus:outline-none p-7"
                    )}
                >
                    <AlertDialog.Title className="font-semibold text-xl text-black mb-2">Are you sure?</AlertDialog.Title>
                    <AlertDialog.Description className="text-sm mb-5">This action cannot be undone. This comment will be permanently deleted from our servers.</AlertDialog.Description>

                    <div className="flex justify-end gap-2 sm:gap-10">
                        <AlertDialog.Cancel asChild>
                            <button className="text-sm sm:text-base text-slate-600 bg-slate-300 hover:text-slate-700 hover:scale-105 rounded-lg px-6 py-2 outline-none focus:shadow-lg">
                                Cancel
                            </button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild>
                            <button 
                                className="text-sm sm:text-base text-red-600 bg-red-300 hover:scale-105 hover:text-red-700 py-2 rounded-lg px-6 outline-none focus:shadow-lg"
                                onClick={() => deleteComment({ commentId: comment.id })}
                            >
                                Delete Comment
                            </button>
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    )   
}

export default DeleteComment;