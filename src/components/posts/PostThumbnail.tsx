import type { Post } from "@prisma/client";
import Image from "next/image";
import { type FC } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import classNames from "classnames";
import { AiOutlineClose, AiOutlineHeart } from "react-icons/ai";

type PostThumbnailProps = {
    post: Post;
}

const PostThumbnail:FC<PostThumbnailProps> = ({ post }) => {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <article className="aspect-square w-full relative cursor-pointer hover:scale-105">
                    <Image 
                        src={post.image as string}
                        alt="Post Image"
                        fill
                        className="object-contain"
                    />
                </article>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
                <Dialog.Content 
                    className={classNames(
                        "data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[550px] translate-x-[-50%] translate-y-[-50%]",
                        "bg-white rounded-lg shadow-lg focus:outline-none p-7",
                        "flex flex-col items-center gap-2"
                    )
                }>
                    <div className="aspect-square w-11/12 relative mt-6">
                        <Image 
                            src={post.image as string}
                            alt="Post Image"
                            fill
                            className="object-contain"
                        />
                        <div className="absolute bg-white p-3 -bottom-1 -right-1 rounded-tl-xl">
                            <AiOutlineHeart className="w-7 h-7 hover:fill-rose-500 hover:cursor-pointer" />
                        </div>
                    </div>
                    <p>{post.text}</p>

                    <Dialog.Close asChild>
                        <AiOutlineClose 
                            aria-label="Close" 
                            className="fill-red-500 absolute top-5 right-5 w-7 h-7 cursor-pointer hover:fill-red-600 active:bg-red-300 rounded-full p-1"
                        />
                    </Dialog.Close>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
};

export default PostThumbnail;