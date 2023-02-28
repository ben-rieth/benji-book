import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession, type User } from "next-auth";
import { authOptions } from "../../server/auth";

const PostPage: NextPage<{user: User}> = ({ user }) => {
    return (
        <div>
            <p>{user.firstName}</p>
            <p>{user.lastName}</p>
            <p>{user.email}</p>
            <p>{user.username}</p>
        </div>
    )
};

export default PostPage;

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

    console.log(session.user);

    return {
        props: {
            user: session.user
        }
    };
}