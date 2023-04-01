import { RequestStatus } from "@prisma/client";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { type FC } from "react";
import Button from "../general/Button";
import Avatar from "./Avatar";
import { api } from "../../utils/api";
import toast from "react-hot-toast";

type UserCardProps = {
    user: {
        id: string;
        firstName: string;
        lastName: string;
        username: string;
        image: string | null;
        imagePlaceholder: string | null;
        followedBy?: {
            status: RequestStatus;
        }[];
    }
}

const UserCard:FC<UserCardProps> = ({ user }) => {
    let followStatus : RequestStatus | undefined;
    
    if (user.followedBy && user.followedBy.length === 1) {
        followStatus = user.followedBy[0]?.status;
    }

    const { data: session } = useSession();

    const apiUtils = api.useContext();
    const { mutate } = api.follows.sendFollowRequest.useMutation({

        onMutate: async () => {
            await apiUtils.users.getAllUsers.cancel();
            await apiUtils.users.getOneUser.cancel();
            await apiUtils.follows.getFollowing.cancel();
            await apiUtils.follows.getFollowers.cancel();
        },

        onError: () => {
            toast.error("Could not send follow request.")
        },

        onSuccess: () => toast.success(`Sent Follow Request!`),
        onSettled: async () => {
            await apiUtils.users.getAllUsers.invalidate();
            await apiUtils.users.getOneUser.invalidate({ userId: user.id })
            await apiUtils.follows.getFollowers.invalidate({ userId: user.id });
            await apiUtils.follows.getFollowing.invalidate({ userId: user.id });
        },
    });

    return (
        <article className="group bg-white shadow-md rounded-lg p-3 w-full flex flex-col gap-2 items-start sm:flex-row sm:items-center">
            <Link href={`/users/${user.id}`} className="flex flex-row gap-4 items-center flex-grow">
                <Avatar url={user.image} placeholder={user.imagePlaceholder} className="w-16 h-16" />
                <div className="flex flex-col">
                    <p className="text-lg group-hover:text-sky-500">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-slate-300">@{user.username}</p>
                </div>
            </Link>
            {user.followedBy && (
                <div className={classNames("flex items-center justify-center w-full", { "hidden": user.id === session?.user?.id || !user.followedBy})}>
                    {!followStatus && (
                        <Button variant="filled" onClick={() => mutate({ followingId: user.id })}>
                            Follow
                        </Button>
                    )}
                    {(followStatus === RequestStatus.PENDING) && (
                        <Button variant="outline" disabled>
                            Pending
                        </Button>
                    )}
                    {(followStatus === RequestStatus.DENIED) && (
                        <Button variant="outline" disabled>
                            Denied
                        </Button>
                    )}
                    {followStatus === RequestStatus.ACCEPTED && (
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