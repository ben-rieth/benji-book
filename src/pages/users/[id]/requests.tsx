import type { NextPage, GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import ErrorBox from "../../../components/error/ErrorBox";
import MainLayout from "../../../components/layouts/MainLayout";
import RelationPageLayout from "../../../components/layouts/RelationPageLayout";
import UserCard from "../../../components/users/UserCard";
import { authOptions } from "../../../server/auth";
import { api } from "../../../utils/api";

const RequestsPage: NextPage = () => {
    
    const router = useRouter();
    const userId = router.query.id as string;

    const { data, isError } = api.follows.getRequests.useQuery({ userId});

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
                <h2 className="text-2xl font-semibold">Requested to Follow</h2>
                {data?.map(relation => (
                    <Link href={`/users/${relation.following.id}`} key={relation.following.id} className="w-full ">
                        <UserCard 
                            user={relation.following}
                        />
                    </Link>
                ))}
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