import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import Button from "../components/general/Button";
import MainLayout from "../components/layouts/MainLayout";
import LikeCard from "../components/posts/LikeCard";
import RequestCard from "../components/users/RequestCard";
import { authOptions } from "../server/auth";
import { api } from "../utils/api";

const ActivityPage: NextPage = () => {

    const { data: requestsData, isSuccess: isRequestsSuccess } = api.follows.getReceivedRequests.useQuery();
    const { data: likesData, isSuccess: isLikesSuccess } = api.users.getLikes.useQuery();

    return (
        <MainLayout title="Benji Book" description="Recent activity with your profile.">
            <div className="flex flex-col gap-5 max-w-screen-sm mx-auto mt-10 px-5">
                <section className="w-full">
                    <h2 className="text-2xl font-semibold text-center mb-5">Follow Requests</h2>
                    {isRequestsSuccess && requestsData.map(item => (
                        <RequestCard user={item.follower} key={item.follower.id}/>
                    ))}
                    {isRequestsSuccess && requestsData.length === 0 && (
                        <>
                            <p className="text-center">No follow requests right now!</p>
                            <Link href="/users">
                                <Button variant="minimal">
                                    Search for Users
                                </Button>
                            </Link>
                        </>
                    )}
                </section>
                <hr />
                <section className="w-full">
                    <h2 className="text-2xl font-semibold text-center mb-5">Recent Likes</h2>
                    {isLikesSuccess && likesData.map(like => (
                        <LikeCard 
                            key={`${like.post.id}-${like.user.id}`}
                            postId={like.post.id}
                            postImage={like.post.image}
                            postPlaceholder={like.post.placeholder}
                            createdAt={like.createdAt}
                            username={like.user.username}
                            userId={like.user.id}
                        />
                    ))}
                    {isLikesSuccess && likesData.length === 0 && (
                        <>
                            <p className="text-center">No likes yet.</p>
                            <Link href="/posts/create">
                                <Button variant="minimal">
                                    Create a New Post
                                </Button>
                            </Link>
                        </>
                    )}
                </section>
            </div>
        </MainLayout>
    )
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
        props: {},
    }
}

export default ActivityPage;