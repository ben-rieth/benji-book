import { type FC } from "react";
import Image from 'next/image';
import classNames from "classnames";
type AvatarProps = {
    url: string | null | undefined;
    className?: string;
}

const Avatar:FC<AvatarProps> = ({ url, className="" }) => {
    
    if (url) {
        return (
            <div className={classNames("rounded-full relative", className)}>
                <Image src={url} fill alt="profile pic" className="object-contain rounded-full" />
            </div>
        )
    }

    return (
        <div className={classNames("rounded-full bg-slate-500", className)}></div>
    )
};

export default Avatar;