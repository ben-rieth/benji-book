import { type FC } from "react";
import { api } from "../../utils/api";
import Button from "../general/Button";
import Avatar from "./Avatar";

type UserCardProps = {
    user: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        username: string | null;
        image: string | null;
        followedBy: {
            status: string;
        }[];
    }
    onFollowRequest: () => void;
}

const UserCard:FC<UserCardProps> = ({ user, onFollowRequest }) => {
    let followStatus : string | undefined;
    
    if (user.followedBy.length === 1) {
        followStatus = user.followedBy[0]?.status;
    }

    return (
        <article className="group bg-white shadow-md rounded-lg p-3 w-full flex flex-row items-center justify-between">
            <div className="flex flex-row gap-4 items-center">
                <Avatar url={user.image} className="w-16 h-16" />
                <div className="flex flex-col">
                    <p className="text-lg group-hover:text-sky-500">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-slate-300">@{user.username}</p>
                </div>
            </div>
            <div className="flex items-center justify-center w-28">
                {!followStatus && (
                    <Button variant="filled" onClick={onFollowRequest}>
                        Follow
                    </Button>
                )}
                {(followStatus === 'pending' || followStatus === 'denied') && (
                    <Button variant="outline" disabled>
                        Pending
                    </Button>
                )}
                {followStatus === 'accepted' && (
                    <Button variant="outline" disabled>
                        Following
                    </Button>
                )}
            </div>
        </article>
    )
}

export default UserCard;