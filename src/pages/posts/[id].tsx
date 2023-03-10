import { useRouter } from "next/router";
import { api } from "../../utils/api";
import MainLayout from "../../components/layouts/MainLayout";
import Post from "../../components/posts/Post";
import { Breadcrumbs, BreadcrumbsLink } from "../../components/navigation/Breadcrumbs";
import CommentColumn from './../../components/comments/CommentColumn';
import type { Likes, User } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import toast from "react-hot-toast";
import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";

type IndividualPostPageProps = {
    user: User;
}

const IndividualPostPage: NextPage<IndividualPostPageProps> = ({ user }) => {
    
    const router = useRouter();
    const postId = router.query.id as string;

    const { data: post, isLoading, isSuccess } = api.posts.getPost.useQuery({ postId });

    const apiUtils = api.useContext();
    const { mutate } = api.posts.toggleLike.useMutation({
        onMutate: async (values) => {
            await apiUtils.posts.getPost.cancel();

            apiUtils.posts.getPost.setData(
                { postId: values.postId }, 
                prev => {
                    if (!prev) return;
                    return {
                        ...prev, 
                        likedBy: [
                            ...prev.likedBy,
                            {
                                postId: values.postId,
                                userId: user.id,
                            } as Likes
                        ]
                    }
                }
            );
        },

        onError: () => toast.error("Could not like post"),

        onSettled: async () => {
            await apiUtils.posts.getPost.invalidate({ postId: post?.id });
        }
    });

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
                    <Post 
                        post={post} 
                        containerClasses="w-full max-w-xl flex-[3_3_0%] md:sticky md:top-5" 
                        changeLike={(liked) => mutate({ postId: post.id, liked })}
                    />

                    <hr className="my-3 h-0.5 w-full bg-slate-300 md:hidden"/>
                    
                    <CommentColumn postId={post.id} />
                </div>
            </MainLayout>
        )
    } else if (isLoading) {
        return <p>Loading</p>
    } else {
        return <p>Error</p>
    }
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    return {
        props: {
            user: session.user,
        }
    }
}

export default IndividualPostPage;