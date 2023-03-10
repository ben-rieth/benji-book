import type { GetServerSideProps, NextPage } from "next";
import { type User, getServerSession } from "next-auth";
import { useEffect } from "react";
import Button from "../components/general/Button";
import MainLayout from "../components/layouts/MainLayout";
import Post from "../components/posts/Post";
import { authOptions } from "../server/auth";
import { api } from "../utils/api";

type FeedPageProps = {
    user: User;
}

const FeedPage: NextPage<FeedPageProps>  = () => {
    const { data, isSuccess, isLoading, fetchNextPage, hasNextPage } = api.posts.getAllPosts.useInfiniteQuery(
        { limit: 5 }, { getNextPageParam: (lastPage) => lastPage.nextCursor}
    );

    return (
        <MainLayout title="Feed" description="Posts from the people that you follow!">
            <div className="flex flex-col items-center relative px-5">
                {isSuccess && (
                    <section className="flex flex-col gap-5 mt-10">
                        {data.pages.map((group) => (
                            <>
                                {group.posts.map(post => (
                                    <Post post={post} key={post.id} containerClasses="w-full max-w-xl" />
                                ))}
                            </>
                        ))}
                        {hasNextPage && <Button onClick={fetchNextPage}>Load More</Button>}
                    </section>
                )}
                {isLoading && <p>Loading</p>}
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
        props: {}
    }
}

export default FeedPage;