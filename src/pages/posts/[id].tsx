import { useRouter } from "next/router";
import { api } from "../../utils/api";
import MainLayout from "../../components/layouts/MainLayout";
import Post from "../../components/posts/Post";
import { Breadcrumbs, BreadcrumbsLink } from "../../components/navigation/Breadcrumbs";
import CommentColumn from './../../components/comments/CommentColumn';
import type { User } from "next-auth";
import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";
import Loader from "../../components/general/Loader/Loader";
import * as Tabs from '@radix-ui/react-tabs';
import LikesColumn from "../../components/posts/LikesColumn";

type IndividualPostPageProps = {
    user: User;
}

const IndividualPostPage: NextPage<IndividualPostPageProps> = ({ user }) => {
    
    const router = useRouter();
    const postId = router.query.id as string;

    const { data: post, isLoading, isSuccess } = api.posts.getPost.useQuery({ postId });

    const username = post?.author?.username ? post.author.username : "";

    if (isSuccess && post) {
        return (
            <MainLayout title="Benji Book" description="A user's post">
                <div className="hidden md:block w-[90vw] mx-auto mt-5 max-w-[70rem]">
                    <Breadcrumbs>
                        <BreadcrumbsLink title="Feed" href="/feed" />
                        <BreadcrumbsLink title={`@${username}`} href={`/users/${post.authorId}`} last />
                    </Breadcrumbs>
                </div>
                <div className="relative flex flex-col items-center w-11/12 mx-auto mt-5 md:flex-row md:gap-8 md:justify-center md:items-baseline">
                    <Post 
                        post={post} 
                        containerClasses="w-full max-w-xl flex-[3_3_0%] md:sticky md:top-5"
                        currentUser={user}
                    />
                    
                    <Tabs.Root className="flex flex-col w-full mx-auto px-5 flex-[2_2_0%] max-w-lg" defaultValue="comments">
                        <Tabs.List className="shrink-0 flex gap-2 border-b border-black w-full px-2">
                            <Tabs.Trigger asChild value="comments">
                                <p className="text-sm sm:text-base px-5 py-2 rounded-t-lg w-fit text-center cursor-pointer  bg-white data-[state=active]:text-sky-500">
                                    Comments
                                </p>
                            </Tabs.Trigger>
                            <Tabs.Trigger value="likes" asChild>
                                <p className="text-sm sm:text-base px-5 py-2 rounded-t-lg w-fit text-center cursor-pointer bg-white data-[state=active]:text-sky-500">
                                    Likes
                                </p>
                            </Tabs.Trigger>
                        </Tabs.List>
                        <Tabs.Content value="comments">
                            <CommentColumn postId={post.id} />
                        </Tabs.Content>
                        <Tabs.Content value="likes">
                            <LikesColumn postId={post.id} />
                        </Tabs.Content>
                    </Tabs.Root>

                    
                </div>
            </MainLayout>
        )
    } else if (isLoading) {
        return (
            <div className="w-full mt-5">
                <Loader text="Loading post" />
            </div>
        )
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