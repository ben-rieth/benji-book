import type { GetServerSideProps, NextPage } from "next";
import { type User, getServerSession } from "next-auth";
import Button from "../components/general/Button";
import MainLayout from "../components/layouts/MainLayout";
import { authOptions } from "../server/auth";
import { api } from "../utils/api";

type FeedPageProps = {
    user: User;
}

const FeedPage: NextPage<FeedPageProps>  = ({ user }) => {
    const { data } = api.posts.getAllPosts.useQuery();

    return (
        <MainLayout title="Feed" description="Posts from the people that you follow!">
            <div className="flex flex-col items-center relative">
                <p>Feed</p>
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
            user: session.user
        }
    }
}

export default FeedPage;