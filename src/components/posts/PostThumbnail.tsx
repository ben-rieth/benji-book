import type { Likes, Post, Comment } from "@prisma/client";
import Image from "next/image";
import { type FC } from "react";
// import * as Dialog from '@radix-ui/react-dialog';
// import * as ScrollArea from '@radix-ui/react-scroll-area';
// import classNames from "classnames";
// import { AiOutlineClose, AiOutlineHeart } from "react-icons/ai";
import Link from "next/link";

type PostThumbnailProps = {
    post: Post & { comments: Comment[], likedBy: Likes[] };
}

const PostThumbnail:FC<PostThumbnailProps> = ({ post }) => {
    return (
        <Link href={`/posts/${post.id}`}>
            <article className="aspect-square w-full relative cursor-pointer hover:scale-105">
                <Image 
                    src={post.image as string}
                    alt="Post Image"
                    fill
                    className="object-contain"
                />
            </article>
        </Link>
        // <Dialog.Root>
        //     <Dialog.Trigger asChild>
        //         <article className="aspect-square w-full relative cursor-pointer hover:scale-105">
        //             <Image 
        //                 src={post.image as string}
        //                 alt="Post Image"
        //                 fill
        //                 className="object-contain"
        //             />
        //         </article>
        //     </Dialog.Trigger>
        //     <Dialog.Portal>
        //         <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
        //         <Dialog.Content
        //             className={classNames(
        //                 "data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[550px] translate-x-[-50%] translate-y-[-50%]",
        //                 "bg-white rounded-lg shadow-lg focus:outline-none p-7 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-100",
                        
        //             )
        //         }>
                    // <div className="flex flex-col items-center gap-2">
                    //     <div className="aspect-square w-full relative mt-6">
                    //         <Image 
                    //             src={post.image as string}
                    //             alt="Post Image"
                    //             fill
                    //             className="object-contain"
                    //         />
                    //         <div className="absolute bg-white p-3 -bottom-1 -right-1 rounded-tl-xl">
                    //             <AiOutlineHeart className="w-7 h-7 hover:fill-rose-500 hover:cursor-pointer" />
                    //         </div>
                    //     </div>
                    //     <p>{post.text}</p>

                    //     <hr />

                    //     {post.comments.map((comment) => (
                    //         <p key={comment.id} className="text-left w-full border-black border">{comment.text}</p>
                    //     ))}
                    // </div>

        //         </Dialog.Content>
        //     </Dialog.Portal>
        // </Dialog.Root>
    )
};

export default PostThumbnail;