import type { FC } from "react";
import Button from "../general/Button";
import DangerButton from "../general/DangerButton";
import Avatar from "./Avatar";

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
    return (
        <article className="group bg-white shadow-md rounded-lg p-3 w-full flex flex-row items-center justify-between">
            <div className="flex flex-row gap-4 items-center">
                <Avatar url={user.image} className="w-16 h-16" />
                <div className="flex flex-col">
                    <p className="text-lg group-hover:text-sky-500">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-slate-300">@{user.username}</p>
                </div>
            </div>
            <div className="flex gap-5">
                <Button variant="filled" onClick={() => console.log("Pressed")}>
                    Accept
                </Button>
                <DangerButton onClick={() => console.log("Danger!")}>
                    Deny
                </DangerButton>
            </div>
        </article>
    )
}

export default RequestCard;