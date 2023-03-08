import { type FC } from "react";
import { api } from "../../utils/api";
import AddComment from './AddComment';
import CommentCard from './CommentCard';
import { useAutoAnimate } from '@formkit/auto-animate/react';

type CommentColumnProps = {
    postId: string;
}

const CommentColumn: FC<CommentColumnProps> = ({ postId }) => {
    
    const { data: comments, isSuccess, isLoading } = api.comments.getAllComments.useQuery({ postId });
    const [animateRef] = useAutoAnimate();

    return (
        <div className="flex flex-col max-w-lg w-full gap-3 flex-[2_2_0%]" ref={animateRef}>
            {isSuccess && (
                <>
                    <p className="md:hidden">Comments</p>
                    <AddComment />
                    {comments.map((comment) => (
                        <CommentCard comment={comment} key={comment.id} />
                    ))}
                </>
                
            )} 
            {isLoading && (
                <p>Loading Comments</p>
            )}
        </div>
    );
}

export default CommentColumn;