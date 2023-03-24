import type { Likes } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { type User, getServerSession } from "next-auth";
import Link from "next/link";
import toast from "react-hot-toast";
import Button from "../components/general/Button";
import Loader from "../components/general/Loader/Loader";
import MainLayout from "../components/layouts/MainLayout";
import Post from "../components/posts/Post";
import { authOptions } from "../server/auth";
import { api } from "../utils/api";

type FeedPageProps = {
    user: User;
}

const FeedPage: NextPage<FeedPageProps>  = ({ user }) => {
    const { data, isSuccess, isLoading, fetchNextPage, hasNextPage } = api.posts.getAllPosts.useInfiniteQuery(
        { limit: 10 }, { getNextPageParam: (lastPage) => lastPage.nextCursor}
    );

    const apiUtils = api.useContext();
    const { mutate } = api.posts.toggleLike.useMutation({
        onMutate: async (values) => {
            await apiUtils.posts.getAllPosts.cancel();

            apiUtils.posts.getAllPosts.setInfiniteData(
                { limit: 5 },
                prev => {
                    if (!prev) 
                        return {
                            pages: [],
                            pageParams: [],
                        };
                    
                    return {
                        ...prev, 
                        pages: prev.pages.map(page => ({
                            ...page,
                            posts: page.posts.map((item) => {
                                if (item.id !== values.postId) return item;

                                return { 
                                    ...item,
                                    likedBy: [
                                        ...item.likedBy,
                                        {
                                            postId: values.postId,
                                            userId: user.id,
                                        } as Likes
                                    ]
                                }
                            })
                        }))
                    }
                }
            )
        },

        onError: () => toast.error("Could not like post"),

        onSettled: async () => {
            await apiUtils.posts.getAllPosts.invalidate({ limit: 5 });
        }
    });

    console.log(data);

    return (
        <MainLayout title="Feed" description="Posts from the people that you follow!">
            <div className="flex flex-col items-center relative px-5 w-full mt-10 ">
                {isSuccess && (
                    <section className="flex flex-col items-center gap-5 w-full">
                        {data.pages.map((group) => (
                            <>
                                {group.posts.map(post => (
                                    <Post 
                                        key={post.id}
                                        post={post} 
                                        linkToPostPage
                                        containerClasses="w-full max-w-xl" 
                                        changeLike={(liked) => mutate({ postId: post.id, liked })}
                                    />
                                ))}
                            </>
                        ))}
                        {hasNextPage && <Button onClick={fetchNextPage}>Load More</Button>}
                        {data.pages[0]?.posts.length === 0 && (
                            <section className="flex flex-col items-center gap-5">
                                <p>No posts! Click below to look for other users to follow!</p>
                                <Link href="/users">
                                    <Button variant="filled">
                                        Search Users
                                    </Button>
                                </Link>
                            </section>
                        )}
                    </section>
                )}
                {isLoading && <Loader text="Getting Your Feed" />}
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