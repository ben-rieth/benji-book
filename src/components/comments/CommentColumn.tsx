import { type FC } from "react";
import { api } from "../../utils/api";
import AddComment from './AddComment';
import CommentCard from './CommentCard';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import Loader from "../general/Loader/Loader";

type CommentColumnProps = {
    postId: string;
}

const CommentColumn: FC<CommentColumnProps> = ({ postId }) => {
    
    const { data, isSuccess, isLoading } = api.comments.getAllComments.useQuery({ postId });
    const [animateRef] = useAutoAnimate();

    return (
        <div className="flex flex-col w-full gap-3 mt-2" ref={animateRef}>
            {isSuccess && (
                <>
                    <AddComment />
                    {data.comments.map((comment) => (
                        <CommentCard comment={comment} key={comment.id} postAuthor={data.postAuthor} />
                    ))}
                </>
                
            )} 
            {isLoading && (
                <Loader text="Loading post" />
            )}
        </div>
    );
}

export default CommentColumn;