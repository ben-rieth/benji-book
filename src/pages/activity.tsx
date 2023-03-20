import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import MainLayout from "../components/layouts/MainLayout";
import RequestCard from "../components/users/RequestCard";
import { authOptions } from "../server/auth";
import { api } from "../utils/api";

const ActivityPage: NextPage = () => {

    const { data, isSuccess } = api.follows.getReceivedRequests.useQuery();

    return (
        <MainLayout title="Benji Book" description="Recent activity with your profile.">
            <div className="flex flex-col gap-5 max-w-screen-sm mx-auto mt-10">
                <section className="w-full">
                    <h2 className="text-2xl font-semibold text-center mb-5">Follow Requests</h2>
                    {isSuccess && data.map(item => (
                        <RequestCard user={item.follower} key={item.follower.id} />
                    ))}
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