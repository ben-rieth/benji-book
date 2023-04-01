import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import MainLayout from "../../components/layouts/MainLayout";
import CreatePost from "../../components/posts/CreatePost";
import { authOptions } from "../../server/auth";

const CreatePostPage: NextPage = () => {
    return (
        <MainLayout title="Create" description="Create a post for Benji Book!">
            <div className="flex flex-col items-center mt-5">
                <CreatePost />
            </div>
        </MainLayout>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user || !session.user.setData) {
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

export default CreatePostPage;