import classNames from "classnames";
import type { GetServerSideProps, NextPage } from "next";
import { type User, getServerSession } from "next-auth";
import Link from "next/link";
import Button from "../components/general/Button";
import Loader from "../components/general/Loader/Loader";
import MainLayout from "../components/layouts/MainLayout";
import Post from "../components/posts/Post";
import ActivityTabs from "../components/users/ActivityTabs";
import { authOptions } from "../server/auth";
import { api } from "../utils/api";

type FeedPageProps = {
    user: User;
}

const FeedPage: NextPage<FeedPageProps>  = ({ user }) => {
    const { data, isSuccess, isLoading, fetchNextPage, hasNextPage } = api.posts.getAllPosts.useInfiniteQuery(
        { limit: 10 }, { getNextPageParam: (lastPage) => lastPage.nextCursor}
    );

    return (
        <MainLayout title="Feed" description="Posts from the people that you follow!">
            <div className={classNames(
                "relative px-5 w-full max-w-screen-xl mx-auto mt-10 gap-10",
                {
                    "lg:grid grid-cols-[1fr_.75fr]": data?.pages[0]?.posts.length !== 0 && !isLoading
                }
            )}>
                {isSuccess && (
                    <section className="flex flex-col items-center gap-5">
                        {data.pages.map((group) => (
                            <>
                                {group.posts.map(post => (
                                    <Post 
                                        key={post.id}
                                        post={post} 
                                        linkToPostPage
                                        containerClasses="w-full max-w-xl"
                                        currentUser={user}
                                    />
                                ))}
                            </>
                        ))}
                        {hasNextPage && <Button onClick={fetchNextPage}>Load More</Button>}
                        {data.pages[0]?.posts.length === 0 && (
                            <section className="flex flex-col items-center gap-5">
                                <p className="text-center">No posts! Click below to look for other users to follow or create a new post yourself!</p>
                                <Link href="/users">
                                    <Button variant="filled">
                                        Search Users
                                    </Button>
                                </Link>
                                <Link href="/posts/create">
                                    <Button variant="filled">
                                        Create Post
                                    </Button>
                                </Link>
                            </section>
                        )}
                    </section>
                )}
                {isLoading && <Loader text="Getting Your Feed" />}
                <aside className={classNames("hidden sticky top-5 h-fit", { "lg:block": data?.pages[0]?.posts.length !== 0 && !isLoading})}>
                    <h2 className="font-semibold text-xl text-center">Recent Activity</h2>
                    <ActivityTabs defaultTab="likes" />
                </aside>
            </div>
        </MainLayout>
    );
}

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

export default FeedPage;