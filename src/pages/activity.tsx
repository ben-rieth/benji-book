import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import MainLayout from "../components/layouts/MainLayout";
import { authOptions } from "../server/auth";
import ActivityTabs from "../components/users/ActivityTabs";

const ActivityPage: NextPage = () => {
    return (
        <MainLayout title="Benji Book" description="Recent activity with your profile.">
            <ActivityTabs />
        </MainLayout>
    )
};

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
        props: {},
    }
}

export default ActivityPage;