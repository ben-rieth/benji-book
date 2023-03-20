import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import MainLayout from "../components/layouts/MainLayout";
import { authOptions } from "../server/auth";
import { api } from "../utils/api";

const ActivityPage: NextPage = () => {

    const { data } = api.follows.getReceivedRequests.useQuery();

    return (
        <MainLayout title="Benji Book" description="Recent activity with your profile.">
            <div className="flex flex-col gap-5">
                <section>
                    <h2>Follow Requests</h2>
                    <p>{data && JSON.stringify(data)}</p>
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