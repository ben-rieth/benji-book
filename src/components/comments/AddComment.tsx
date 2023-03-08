import { useState } from "react";
import TextArea from "../inputs/TextArea";
import  {FaPaperPlane} from 'react-icons/fa';
import Button from "../general/Button";
import { api } from "../../utils/api";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import type { Comment, User } from "@prisma/client";
import { toast } from "react-hot-toast";

const AddComment = () => {

    const [comment, setComment] = useState<string>('');
    const { data: session } = useSession();
    
    const router = useRouter();
    const postId = router.query.id as string;

    const apiUtils = api.useContext();

    const { mutateAsync } = api.comments.leaveComment.useMutation({
        onMutate: async (values) => {
            await apiUtils.comments.getAllComments.cancel();

            apiUtils.comments.getAllComments.setData(
                { postId }, 
                prev => {
                    if (!prev) return;
                    return [
                        ...prev,
                        { 
                            postId: values.postId,
                            text: values.commentText,
                            authorId: session?.user?.id,
                            id: 'dummy-id-for-now',
                            author: { ...session?.user } 
                        } as Comment & { author: User | null },
                    ];
                }
            );
        },

        onError: () => {
            apiUtils.comments.getAllComments.setData(
                { postId },
                prev => {
                    if (!prev) return;
                    return prev.filter((comment) => comment.id !== 'dummy-id-for-now');
                }
            );

            toast.error("Could not leave comment. Try again.");
        },

        onSuccess: () => {
            toast.success(`Comment added to post`);
        },

        onSettled: async () => {
            await apiUtils.comments.getAllComments.invalidate({ postId })
        }
    });

    const handleSubmit = async () => {
        await mutateAsync({ postId, commentText: comment });
        setComment('');
    }

    return (
        <div className="p-2 rounded-lg shadow-lg w-full bg-white flex flex-col gap-2">
            <TextArea 
                id="leave-comment"
                name="comment"
                label="Leave Comment"
                showLabel={false}
                value={comment}
                onChange={(e) => setComment(e.currentTarget.value)}
                error={undefined}
                touched={undefined}
                placeholder="Leave Comment"
            />
            <Button variant="outline" onClick={handleSubmit}>
                <FaPaperPlane className="w-7 h-7" />
            </Button>
        </div>
    )
};

export default AddComment;