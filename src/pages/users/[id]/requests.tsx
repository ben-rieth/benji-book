import type { NextPage, GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import ErrorBox from "../../../components/error/ErrorBox";
import MainLayout from "../../../components/layouts/MainLayout";
import RelationPageLayout from "../../../components/layouts/RelationPageLayout";
import UserCard from "../../../components/users/UserCard";
import { authOptions } from "../../../server/auth";
import { api } from "../../../utils/api";
import Loader from "../../../components/general/Loader/Loader";

const RequestsPage: NextPage = () => {
    
    const router = useRouter();
    const userId = router.query.id as string;

    const { data, isError, isLoading } = api.follows.getRequests.useQuery({ userId});

    if (isError) {
        return (
            <MainLayout title="Benji Book" description="">
                <section className="max-w-xl mx-auto mt-10">
                    <ErrorBox message="Not authorized."/>
                </section>
            </MainLayout>
        )
    }
    
    return (
        <RelationPageLayout>
            <>
                {data && (
                    <>
                        <h2 className="text-2xl font-semibold">Requested to Follow</h2>
                        {data.map(relation => (
                            <UserCard 
                                key={relation.following.id}
                                user={relation.following}
                            />
                        ))}
                    </>
                )}
                {isLoading && (
                    <Loader />
                )}
            </>
        </RelationPageLayout>
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
        props: {},
    }
}

export default RequestsPage;