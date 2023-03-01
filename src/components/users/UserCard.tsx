import Image from "next/image";
import { type FC } from "react";

type UserCardProps = {
    user: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        username: string | null;
        image: string | null;
    }
}

const UserCard:FC<UserCardProps> = ({ user }) => {
    return (
        <article className="group bg-white shadow-md rounded-lg p-3 flex flex-row gap-4 w-full items-center">
            {user.image ? (
                <div className="w-14 h-14 relative">
                    <Image src={user.image} fill alt="profile pic" className="object-contain rounded-full" />
                </div>
            ) : (
                <div className="rounded-full"></div>
            )}
            <div className="flex flex-col">
                <p className="text-lg group-hover:text-sky-500">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-slate-300">@{user.username}</p>
            </div>
        </article>
    )
}

export default UserCard;