import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { FC } from "react";
import { api } from "../../utils/api";

import Loader from "../general/Loader/Loader";
import UserCard from "../users/UserCard";

type LikesColumnProps = {
    postId: string;
}

const LikesColumn: FC<LikesColumnProps> = ({ postId }) => {
    const { data, isSuccess, isLoading } = api.posts.getPostLikes.useQuery({ postId });
    const [animateRef] = useAutoAnimate();

    return (
        <div className="flex flex-col w-full gap-3 mt-2" ref={animateRef}>
            {isSuccess && data.map(like => (
                <UserCard 
                    key={`${like.postId}-${like.userId}`}
                    user={like.user}
                />
            ))}
            {isSuccess && data.length === 0 && (
                <p className="text-center">No likes yet!</p>
            )}
            {isLoading && (
                <Loader text="Loading likes" />
            )}
        </div>
    );
}

export default LikesColumn;