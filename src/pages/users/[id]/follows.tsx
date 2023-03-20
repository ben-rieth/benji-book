import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import RelationPageLayout from "../../../components/layouts/RelationPageLayout";
import UserCard from "../../../components/users/UserCard";
import { authOptions } from "../../../server/auth";
import { api } from "../../../utils/api";

const FollowingPage: NextPage = () => {
    const router = useRouter();
    const userId = router.query.id as string;

    const { data } = api.follows.getFollowing.useQuery({ userId });

    const apiUtils = api.useContext();
    const { mutate: sendFollowRequest } = api.follows.sendFollowRequest.useMutation({
        
        onMutate: async (values) => {
            await apiUtils.follows.getFollowing.cancel();
            apiUtils.follows.getFollowing.setData(
                { userId }, 
                prev => {
                    if (!prev) return;
                    return prev.map(item => {
                        if (userId !== values.followingId) return item;
                        return { ...item, following: { ...item.following, followedBy: [{ status: 'pending'}]}}
                    });
                }
            );
        },

        onError: (_err, values) => {
            apiUtils.follows.getFollowing.setData({ userId },
                prev => {
                    if (!prev) return;
                    return prev.map(item => {
                        if (userId !== values.followingId) return item;
                        return { ...item, following: { ...item.following, followedBy: []}}
                    });
                }   
            );

            toast.error("Could not send follow request.")
        },

        onSuccess: () => toast.success(`Sent Follow Request!`),
        onSettled: async () => await apiUtils.follows.getFollowing.invalidate({userId}),
    });

    return (
        <RelationPageLayout>
            <>
                <h2 className="text-2xl font-semibold">Following</h2>
                {data?.map(relation => (
                    <UserCard 
                        key={relation.following.id}
                        user={relation.following} 
                        onFollowRequest={() => sendFollowRequest({ followingId: relation.following.id })} 
                    />
                ))}
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