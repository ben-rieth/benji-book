import type { User, Likes, Post as PostType } from "@prisma/client";
import type { FC} from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import Avatar from "../users/Avatar";
import Image from 'next/image';
import Link from "next/link";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "../general/icons";
import Alert from "../general/Alert";
import { api } from "../../utils/api";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import UpdatePost from "./UpdatePost";
import classNames from "classnames";

type PostProps = {
    post: PostType & {
        author: User;
        likedBy: Likes[] };
    containerClasses?: string;
    changeLike: (liked: boolean) => void;
    linkToPostPage?: boolean
}

const Post : FC<PostProps> = ({ post, containerClasses="", changeLike, linkToPostPage=false }) => {
    
    let deleteToastId : string | undefined;
    const { data: session } = useSession();
    const router = useRouter();

    const apiUtils = api.useContext();
    const { mutate: deletePost } = api.posts.deletePost.useMutation({
        onMutate: async () => {
            await apiUtils.posts.getPost.cancel();
            await apiUtils.posts.getAllPosts.cancel();
        },
        onError: () => {
            toast.dismiss(deleteToastId);
            toast.error("Could not delete post")
        },
        onSuccess: async () =>{
            await router.push('/feed');
            toast.dismiss(deleteToastId);
            toast.success("Post deleted!")
        },
        onSettled: async () => {
            await apiUtils.posts.getAllPosts.invalidate()
        }

    });
    
    return (
        <article className={containerClasses}>
            <div className="w-full bg-white rounded-t-lg px-2 py-1 relative">
                <Link href={`/users/${post.authorId}`} className="flex flex-row gap-2 w-fit">
                    <Avatar url={post.author.image} placeholder={post.author.imagePlaceholder} className="w-10 h-10" />
                    <div className="flex flex-col justify-center">
                        <p className="text-sm text-slate-300 -mb-1">@{post.author.username}</p>
                        <p className="text-lg">{post.author.firstName} {post.author.lastName}</p>
                    </div>
                </Link>
                { session?.user?.id === post.authorId && (
                    <div className="flex gap-3 absolute right-2 top-4">
                        <UpdatePost post={post} />
                        <Alert 
                            title="Are you sure?" 
                            description="This action cannot be undone. This post will be permanently deleted from our servers."
                            actionLabel="Delete Post"
                            handleAction={() => {
                                deleteToastId = toast.loading("Deleting post...")
                                deletePost({ postId: post.id })
                            }}
                            trigger={<DeleteIcon />}
                        />
                    </div>)
                }
            </div>
            <div className="aspect-square w-full relative">
                {linkToPostPage ? (
                    <Link href={`/posts/${post.id}`} className="w-full">
                        <Image 
                            src={post.image as string}
                            alt="Post Image"
                            fill
                            priority
                            className={classNames(
                                "object-cover"
                            )}
                            placeholder={post.placeholder ? "blur" : "empty"}
                            blurDataURL={post.placeholder as string}
                        />
                    </Link>
                ) : (
                    <Image 
                        src={post.image as string}
                        alt="Post Image"
                        fill
                        priority
                        className={classNames(
                            "object-cover"
                        )}
                        placeholder={post.placeholder ? "blur" : "empty"}
                        blurDataURL={post.placeholder as string}
                    />
                )}
                
                <div className="absolute bg-white p-3 bottom-0 right-0 rounded-tl-xl">
                    {!!post.likedBy.find(like => like.userId === session?.user?.id) ? (
                        <BsHeartFill 
                            className="w-9 h-9 fill-rose-500 hover:fill-rose-600 hover:cursor-pointer" 
                            onClick={() => changeLike(false)}
                        /> 
                    ) : (
                        <BsHeart 
                            className="w-9 h-9 fill-rose-500 hover:fill-rose-600 hover:cursor-pointer" 
                            onClick={() => changeLike(true)}
                        /> 
                    )}
                </div>
            </div>
            <div className="p-2 shadow-lg rounded-b-lg bg-white">
                <p className=" md:text-lg xl:text-xl">{post.text}</p>
                <p className="text-sm md:text-base text-slate-400">
                    {post.likedBy.length} Likes&nbsp;|&nbsp;
                    {formatDistanceToNow(post.createdAt)} ago
                    {post.createdAt.toISOString() !== post.updatedAt.toISOString() && " | Updated"}
                </p>
            </div>
            
        </article>
    )
};

export default Post;