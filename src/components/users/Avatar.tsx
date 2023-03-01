import { type FC } from "react";
import Image from 'next/image';
import classNames from "classnames";

type AvatarProps = {
    url: string | null;
    size?: 'sm' | 'md';
}

const Avatar:FC<AvatarProps> = ({ url, size='md' }) => {
    const sizeClasses = classNames({
        "w-10 h-10": size === 'sm',
        "w-14 h-14": size === 'md',
    })  
    
    if (url) {
        return (
            <div className={`${sizeClasses} relative`}>
                <Image src={url} fill alt="profile pic" className="object-contain rounded-full" />
            </div>
        )
    }

    return (
        <div className={`${sizeClasses} bg-slate-500 rounded-full`}></div>
    )
};

export default Avatar;