import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import Loader from "../../../components/general/Loader/Loader";
import RelationPageLayout from "../../../components/layouts/RelationPageLayout";
import UserCard from "../../../components/users/UserCard";
import { authOptions } from "../../../server/auth";
import { prisma } from "../../../server/db";
import { api } from "../../../utils/api";

const FollowersPage: NextPage = () => {
    const router = useRouter();
    const userId = router.query.id as string;

    const { data, isLoading } = api.follows.getFollowers.useQuery({ userId });

    return (
        <RelationPageLayout>
            <>
                {data && (
                    <>
                        <h2 className="text-2xl font-semibold">Followers</h2>
                        {data.map(relation => (
                            <UserCard 
                                key={relation.follower.id}
                                user={relation.follower} 
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

export const getServerSideProps: GetServerSideProps = async ({ req, res, params }) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    const user = await prisma.user.findUnique({
        where: { id: params?.id as string }
    });

    if (!user) {
        return {
            notFound: true,
        }
    }

    return {
        props: {},
    }
}



export default FollowersPage;