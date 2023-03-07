import { useRouter } from "next/router";
import { api } from "../../utils/api";
import MainLayout from "../../components/layouts/MainLayout";
import Post from "../../components/posts/Post";
import CommentCard from "../../components/posts/CommentCard";

const IndividualPostPage = () => {
    
    const router = useRouter();
    const postId = router.query.id as string;

    const { data: post, isLoading, isSuccess } = api.posts.getPost.useQuery({ postId });
    
    if (isSuccess) {
        return (
            <MainLayout title="Benji Book" description="A user's post">
                <div className="flex flex-col w-11/12 mx-auto mt-5 md:flex-row md:gap-14 md:justify-center">
                    <Post post={post} />

                    <hr className="my-3 h-0.5 w-full bg-slate-300 md:hidden"/>
                    
                    <div className="flex flex-col max-w-lg w-full gap-3">
                        <p className="md:hidden">Comments</p>
                        {post.comments.map((comment) => (
                            <CommentCard comment={comment} key={comment.id} />
                        ))}
                    </div>
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