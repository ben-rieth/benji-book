import { useRouter } from "next/router";
import { api } from "../../utils/api";
import MainLayout from "../../components/layouts/MainLayout";
import Post from "../../components/posts/Post";
import CommentCard from "../../components/posts/CommentCard";
import { Breadcrumbs, BreadcrumbsLink } from "../../components/navigation/Breadcrumbs";
import AddComment from "../../components/posts/AddComment";

const IndividualPostPage = () => {
    
    const router = useRouter();
    const postId = router.query.id as string;

    const { data: post, isLoading, isSuccess } = api.posts.getPost.useQuery({ postId, order: 'oldest' });

    if (isSuccess) {
        return (
            <MainLayout title="Benji Book" description="A user's post">
                <div className="hidden md:block w-[90vw] mx-auto mt-5 max-w-[70rem]">
                    <Breadcrumbs>
                        <BreadcrumbsLink title="Feed" href="/feed" />
                        <BreadcrumbsLink title={`@${post.author.username as string}`} href={`/users/${post.authorId}`} last />
                    </Breadcrumbs>
                </div>
                <div className="relative flex flex-col items-center w-11/12 mx-auto mt-5 md:flex-row md:gap-8 md:justify-center md:items-baseline">
                    <Post post={post} containerClasses="w-full max-w-xl flex-[3_3_0%] md:sticky md:top-5" />

                    <hr className="my-3 h-0.5 w-full bg-slate-300 md:hidden"/>
                    
                    <div className="flex flex-col max-w-lg w-full gap-3 flex-[2_2_0%]">
                        <p className="md:hidden">Comments</p>
                        <AddComment />
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