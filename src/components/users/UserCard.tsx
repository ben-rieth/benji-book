import classNames from "classnames";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { type FC } from "react";
import Button from "../general/Button";
import Avatar from "./Avatar";

type UserCardProps = {
    user: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        username: string | null;
        image: string | null;
        followedBy?: {
            status: string;
        }[];
    }
    onFollowRequest?: () => void;
}

const UserCard:FC<UserCardProps> = ({ user, onFollowRequest }) => {
    let followStatus : string | undefined;
    
    if (user.followedBy && user.followedBy.length === 1) {
        followStatus = user.followedBy[0]?.status;
    }

    const { data: session } = useSession();

    return (
        <article className="group bg-white shadow-md rounded-lg p-3 w-full flex flex-row items-center">
            <Link href={`/users/${user.id}`} className="flex flex-row gap-4 items-center flex-grow">
                <Avatar url={user.image} className="w-16 h-16" />
                <div className="flex flex-col">
                    <p className="text-lg group-hover:text-sky-500">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-slate-300">@{user.username}</p>
                </div>
            </Link>
            {user.followedBy && (
                <div className={classNames("flex items-center justify-center w-28", { "hidden": user.id === session?.user?.id})}>
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
            )}
        </article>
    )
}

export default UserCard;