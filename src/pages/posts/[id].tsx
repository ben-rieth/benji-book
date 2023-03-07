import { useRouter } from "next/router";
import { api } from "../../utils/api";
import Image from 'next/image';
import { AiOutlineHeart } from "react-icons/ai";
import Avatar from "../../components/users/Avatar";
import MainLayout from "../../components/layouts/MainLayout";

const IndividualPostPage = () => {
    
    const router = useRouter();
    const postId = router.query.id as string;

    const { data: post, isLoading, isSuccess } = api.posts.getPost.useQuery({ postId });
    
    if (isSuccess) {
        return (
            <MainLayout title="Benji Book" description="A user's post">
                <div className="flex flex-col items-center w-[90vw] mx-auto mt-5">
                    <div className="flex flex-row gap-2 w-full items-center bg-white rounded-t-lg px-2 py-1">
                        <Avatar url={post.author.image} className="w-10 h-10" />
                        <div className="flex flex-col justify-center">
                            <p className="text-sm text-slate-300 -mb-1">@{post.author.username}</p>
                            <p className="text-lg">{post.author.firstName} {post.author.lastName}</p>
                        </div>
                    </div>
                    <div className="aspect-square w-full relative">
                        <Image 
                            src={post.image as string}
                            alt="Post Image"
                            fill
                            className="object-contain"
                        />
                        <div className="absolute bg-white p-3 bottom-0 right-0 rounded-tl-xl">
                            <AiOutlineHeart className="w-7 h-7 hover:fill-rose-500 hover:cursor-pointer" />
                        </div>
                    </div>
                    <p className="p-2 shadow-lg rounded-b-lg bg-white">{post.text}</p>

                    <hr className="my-3 h-0.5 w-full bg-slate-300"/>
                    <p>Comments</p>

                    {post.comments.map((comment) => (
                        <div key={comment.id} className="p-2 rounded-lg shadow-lg my-3 w-full bg-white">
                            <div className="flex flex-row gap-2 w-full items-center bg">
                                <Avatar url={comment.author?.image} className="w-10 h-10" />
                                <div className="flex flex-col justify-center">
                                    <p className="text-sm text-slate-300 -mb-1">@{comment.author?.username}</p>
                                    <p className="text-lg">{comment.author?.firstName} {comment.author?.lastName}</p>
                                </div>
                            </div>
                            <p  className="text-left text-sm">{comment.text}</p>
                        </div>
                    ))}
                </div>
            </MainLayout>
        )
    } else if (isLoading) {
        return <p>Loading</p>
    } else {
        return <p>Error</p>
    }



    // return (
    //     {isSuccess && (

    //     )}
        
    // )
};

export default IndividualPostPage;