import type { User, Likes, Post as PostType } from "@prisma/client";
import type { FC} from "react";
import Avatar from "../users/Avatar";
import Image from 'next/image';
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "../general/icons";
import Alert from "../general/Alert";
import { api } from "../../utils/api";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import UpdatePost from "./UpdatePost";
import classNames from "classnames";
import LikeButton from "./LikeButton";
import type { User as AuthUser } from 'next-auth';
import { BsArchive } from "react-icons/bs";
import { TiArrowBack } from 'react-icons/ti';

type PostProps = {
    post: PostType & {
        author: User;
        likedBy: Likes[] };
    containerClasses?: string;
    linkToPostPage?: boolean;
    currentUser: AuthUser;
}

const Post : FC<PostProps> = ({ post, containerClasses="", linkToPostPage=false, currentUser }) => {
    
    const router = useRouter();

    const apiUtils = api.useContext();
    const { mutate: deletePost } = api.posts.deletePost.useMutation({
        onMutate: async () => {
            await apiUtils.posts.getPost.cancel();
            await apiUtils.posts.getAllPosts.cancel();

            const toastId = toast.loading("Deleting post...");

            return { toastId };
        },
        onError: (_err, _values, ctx) => {
            if (ctx?.toastId) toast.dismiss(ctx?.toastId);
            toast.error("Could not delete post")
        },
        onSuccess: async (_data, _err, ctx) =>{
            await router.push('/feed');
            if (ctx?.toastId) toast.dismiss(ctx?.toastId);
            toast.success("Post deleted!")
        },
        onSettled: async () => {
            await apiUtils.posts.getPost.invalidate({ postId: post.id })
            await apiUtils.posts.getAllPosts.invalidate()
        }

    });

    const { mutate: archivePost } = api.posts.toggleArchiveStatus.useMutation({
        onMutate: async () => {
            await apiUtils.posts.getPost.cancel();
            await apiUtils.posts.getAllPosts.cancel();
        },
        onError: (_err, values) => {
            if (values.status)
                toast.error("Could not archive post");
            else toast.error("Could not unarchive post");
        },
        onSuccess: (_data, values) =>{
            if (values.status)
                toast.success("Post archived!")
            else toast.success("Post unarchived!")
        },
        onSettled: async () => {
            await apiUtils.posts.getPost.invalidate({ postId: post.id })
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
                { currentUser.id === post.authorId && (
                    <div className="flex gap-3 absolute right-2 top-4 bg-white">
                        <UpdatePost post={post} />
                        {post.archived ? (
                            <TiArrowBack 
                                className="fill-emerald-500 w-6 h-6 cursor-pointer hover:scale-100 hover:fill-emerald-600"
                                onClick={() => archivePost({ postId: post.id, status: false })}
                            />
                        ) : (
                            <BsArchive 
                                className="fill-emerald-500 w-6 h-6 cursor-pointer hover:scale-100 hover:fill-emerald-600"
                                onClick={() => archivePost({ postId: post.id, status: true })}
                            />
                        )}
                        
                        <Alert 
                            title="Are you sure?" 
                            description="This action cannot be undone. This post will be permanently deleted from our servers."
                            actionLabel="Delete Post"
                            handleAction={() => deletePost({ postId: post.id })}
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
                    <LikeButton 
                        postId={post.id} 
                        currentUserId={currentUser.id} 
                        postLikes={post.likedBy} 
                    />
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