import type { FC } from "react";
import { api } from "../../utils/api";
import Button from "../general/Button";
import DangerButton from "../general/DangerButton";
import Avatar from "./Avatar";
import toast from 'react-hot-toast';
import { useSession } from "next-auth/react";
import Link from "next/link";
import { RequestStatus } from "@prisma/client";

type RequestCardProps = {
    user: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        username: string | null;
        image: string | null;
        imagePlaceholder: string | null;
    }
}

const RequestCard: FC<RequestCardProps> = ({ user }) => {
    
    const { data: session } = useSession();

    const apiUtils = api.useContext();
    const { mutate } = api.follows.changeFollowStatus.useMutation({
        onSuccess: (_data, values) => {
            if (values.newStatus === RequestStatus.DENIED) {
                toast.success("Request denied")
            } else if (values.newStatus === RequestStatus.ACCEPTED) {
                toast.success("Request accepted!")
            }
        },

        onError: () => toast.error("Could not change request status."),
        onSettled: () => apiUtils.follows.invalidate(),
    });
    
    return (
        <article className="group bg-white shadow-md rounded-lg p-3 w-full flex flex-col gap-2 items-start sm:flex-row sm:items-center">
            <Link href={`/users/${user.id}`} className="flex flex-row gap-4 items-center flex-grow">
                <Avatar url={user.image} placeholder={user.imagePlaceholder} className="w-16 h-16" />
                <div className="flex flex-col">
                    <p className="text-base md:text-lg group-hover:text-sky-500">{user.firstName} {user.lastName}</p>
                    <p className="text-xs md:text-sm text-slate-300">@{user.username}</p>
                </div>
            </Link>
            <div className="flex gap-2 md:gap-5 w-full sm:w-fit">
                <Button 
                    variant="filled" 
                    onClick={() => mutate(
                        { followerId: user.id, followingId: session?.user?.id as string, newStatus: RequestStatus.ACCEPTED }
                    )}
                >
                    Accept
                </Button>
                <DangerButton
                    variant="filled" 
                    onClick={() => mutate(
                        { followerId: user.id, followingId: session?.user?.id as string, newStatus: RequestStatus.DENIED }
                    )}
                    alertActionLabel="Deny Request"
                    alertDescription={`@${user.username as string} will be able to send follow requests in the future even if this one is denied.`}
                    alertTitle={`Are you sure you want to deny @${user.username as string}'s request?`}
                >
                    Deny
                </DangerButton>
            </div>
        </article>
    )
}

export default RequestCard;