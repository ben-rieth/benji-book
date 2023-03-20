import type { FC } from "react";
import { api } from "../../utils/api";
import Button from "../general/Button";
import DangerButton from "../general/DangerButton";
import Avatar from "./Avatar";
import toast from 'react-hot-toast';
import { useSession } from "next-auth/react";
import Link from "next/link";

type RequestCardProps = {
    user: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        username: string | null;
        image: string | null;
    }
}

const RequestCard: FC<RequestCardProps> = ({ user }) => {
    
    const { data: session } = useSession();

    const apiUtils = api.useContext();
    const { mutate } = api.follows.changeFollowStatus.useMutation({
        onSuccess: (_data, values) => {
            if (values.newStatus === 'denied') {
                toast.success("Request denied")
            } else if (values.newStatus === 'accepted') {
                toast.success("Request accepted!")
            }
        },

        onError: () => toast.error("Could not change request status."),
        onSettled: () => apiUtils.follows.invalidate(),
    });
    
    return (
        <article className="group bg-white shadow-md rounded-lg p-3 w-full flex flex-row items-center">
            <Link href={`/users/${user.id}`} className="flex flex-row gap-4 items-center flex-grow">
                <Avatar url={user.image} className="w-16 h-16" />
                <div className="flex flex-col">
                    <p className="text-lg group-hover:text-sky-500">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-slate-300">@{user.username}</p>
                </div>
            </Link>
            <div className="flex gap-5">
                <Button 
                    variant="filled" 
                    onClick={() => mutate(
                        { followerId: user.id, followingId: session?.user?.id as string, newStatus: 'accepted' }
                    )}
                >
                    Accept
                </Button>
                <DangerButton
                    variant="filled" 
                    onClick={() => mutate(
                        { followerId: user.id, followingId: session?.user?.id as string, newStatus: 'denied' }
                    )}
                >
                    Deny
                </DangerButton>
            </div>
        </article>
    )
}

export default RequestCard;