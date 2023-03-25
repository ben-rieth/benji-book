import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import RelationPageLayout from "../../../components/layouts/RelationPageLayout";
import UserCard from "../../../components/users/UserCard";
import { authOptions } from "../../../server/auth";
import { api } from "../../../utils/api";
import Loader from "../../../components/general/Loader/Loader";

const FollowingPage: NextPage = () => {
    const router = useRouter();
    const userId = router.query.id as string;

    const { data, isLoading } = api.follows.getFollowing.useQuery({ userId });

    return (
        <RelationPageLayout>
            <>
                {data && (
                    <>
                        <h2 className="text-2xl font-semibold">Following</h2>
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



export default FollowingPage;