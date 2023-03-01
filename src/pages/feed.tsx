import type { GetServerSideProps, NextPage } from "next";
import { type User, getServerSession } from "next-auth";
import { authOptions } from "../server/auth";

type FeedPageProps = {
    user: User;
}

const FeedPage: NextPage<FeedPageProps>  = ({ user }) => {
    return (
        <div>
            {JSON.stringify(user)}
        </div>
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