import type { GetServerSideProps, NextPage } from "next";
import { type User, getServerSession } from "next-auth";
import { authOptions } from "../server/auth";
import { api } from "../utils/api";

type FeedPageProps = {
    user: User;
}

const FeedPage: NextPage<FeedPageProps>  = ({ user }) => {
    const { data } = api.posts.getAllPosts.useQuery();

    return (
        <main>
            {JSON.stringify(user)}
            <p>Posts</p>
            {JSON.stringify(data)}
        </main>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    if (!session.user) {
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