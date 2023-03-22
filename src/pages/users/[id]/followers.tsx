import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Loader from "../../../components/general/Loader/Loader";
import RelationPageLayout from "../../../components/layouts/RelationPageLayout";
import UserCard from "../../../components/users/UserCard";
import { authOptions } from "../../../server/auth";
import { api } from "../../../utils/api";

const FollowersPage: NextPage = () => {
    const router = useRouter();
    const userId = router.query.id as string;

    const { data, isLoading } = api.follows.getFollowers.useQuery({ userId });

    const apiUtils = api.useContext();
    const { mutate: sendFollowRequest } = api.follows.sendFollowRequest.useMutation({
        
        onMutate: async () => {
            await apiUtils.follows.getFollowers.cancel();
        },

        onError: () => {

            toast.error("Could not send follow request.")
        },

        onSuccess: () => toast.success(`Sent Follow Request!`),
        onSettled: async () => await apiUtils.follows.getFollowers.invalidate({userId}),
    });

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
                                onFollowRequest={() => sendFollowRequest({ followingId: relation.follower.id })} 
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



export default FollowersPage;