import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import ErrorBox from "../../../components/error/ErrorBox";
import MainLayout from "../../../components/layouts/MainLayout";
import UserCard from "../../../components/users/UserCard";
import { authOptions } from "../../../server/auth";
import { api } from "../../../utils/api";

const FollowersPage: NextPage = () => {
    const router = useRouter();
    const userId = router.query.id as string;

    const { data, isSuccess, isError, isLoading } = api.users.getFollowers.useQuery({ userId });

    return (
        <MainLayout title="Benji Book" description="">
            {isSuccess && (
                <section className="flex flex-col gap-2 items-center w-full px-10 mt-10">
                    {data.map(relation => (
                        <Link href={`/users/${relation.follower.id}`} key={relation.follower.id} className="w-full ">
                            <UserCard user={relation.follower} />
                        </Link>
                    ))}
                </section>
            )}
            {isError && (
                <section className="max-w-xl mx-auto mt-10">
                    <ErrorBox message="Not authorized."/>
                </section>
            )}
            {isLoading && (
                <p>Loading</p>
            )}
        </MainLayout>
    );
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



export default FollowersPage;