import { api } from "../../utils/api";
import MainLayout from "../../components/layouts/MainLayout";
import Post from "../../components/posts/Post";
import * as Breadcrumbs from "../../components/navigation/Breadcrumbs";
import CommentColumn from './../../components/comments/CommentColumn';
import type { User } from "next-auth";
import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";
import Loader from "../../components/general/Loader/Loader";
import * as Tabs from '@radix-ui/react-tabs';
import LikesColumn from "../../components/posts/LikesColumn";
import { prisma } from "../../server/db";
import ErrorBox from "../../components/error/ErrorBox";

type IndividualPostPageProps = {
    user: User;
    postId: string;
}

const IndividualPostPage: NextPage<IndividualPostPageProps> = ({ user, postId }) => {

    const { data: post, isLoading, isSuccess, error } = api.posts.getPost.useQuery({ postId });

    const username = post?.author?.username ? post.author.username : "";

    return (
        <MainLayout title="Benji Book" description="A user's post">
            {isSuccess && (
                <>
                    <div className="hidden md:block w-[90vw] mx-auto mt-5 max-w-[70rem]">
                        <Breadcrumbs.Root>
                            <Breadcrumbs.Link title="Feed" href="/feed" />
                            <Breadcrumbs.Link title={`@${username}`} href={`/users/${post.authorId}`} />
                        </Breadcrumbs.Root>
                    </div>
                    <div className="relative flex flex-col items-center w-11/12 mx-auto mt-5 md:flex-row md:gap-8 md:justify-center md:items-baseline">
                        <Post 
                            post={post} 
                            containerClasses="w-full max-w-xl flex-[3_3_0%] md:sticky md:top-5"
                            currentUser={user}
                        />
                        
                        <Tabs.Root className="flex flex-col w-full mx-auto px-5 flex-[2_2_0%] max-w-lg mt-5 md:mt-0" defaultValue="comments">
                            <Tabs.List className="shrink-0 flex gap-2 border-b border-black w-full px-2">
                                <Tabs.Trigger asChild value="comments">
                                    <p className="text-sm lg:text-base px-5 py-2 rounded-t-lg w-fit text-center cursor-pointer  bg-white data-[state=active]:text-sky-500">
                                        Comments ({post._count.comments})
                                    </p>
                                </Tabs.Trigger>
                                <Tabs.Trigger value="likes" asChild>
                                    <p className="text-sm lg:text-base px-5 py-2 rounded-t-lg w-fit text-center cursor-pointer bg-white data-[state=active]:text-sky-500">
                                        Likes ({post._count.likedBy})
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
                </>
            )}
            {isLoading && (
                <Loader text="Loading post" />
            )}
            {error && (
                <ErrorBox 
                    message={error.data?.code === "FORBIDDEN" ? "Not authorized to view this post" : "Something went wrong. Cannot get post."} 
                />
            )}
        </MainLayout>
    )
};

export const getServerSideProps: GetServerSideProps = async ({ req, res, params }) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    const post = await prisma.post.findUnique({
        where: { id: params?.id as string }
    });

    if (!post) return { notFound: true }

    return {
        props: {
            user: session.user,
            postId: post.id,
        }
    }
}

export default IndividualPostPage;