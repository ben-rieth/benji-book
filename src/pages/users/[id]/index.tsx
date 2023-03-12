import classNames from "classnames";
import type { GetServerSideProps} from "next";
import { type NextPage } from "next";
import type { User } from "next-auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import UpdateAvatar from "../../../components/auth/UpdateAvatar";
import UpdateProfileForm from "../../../components/auth/UpdateProfileForm";
import Button from "../../../components/general/Button";
import MainLayout from "../../../components/layouts/MainLayout";
import PostThumbnail from "../../../components/posts/PostThumbnail";
import Avatar from "../../../components/users/Avatar";
import { authOptions } from "../../../server/auth";
import { api } from "../../../utils/api";

type AccountPageProps = {
    currentUser: User;
}

const AccountPage: NextPage<AccountPageProps> = ({ currentUser }) => {

    const router = useRouter();
    const queries = router.query;
    const id = queries.id as string;

    const apiUtils = api.useContext();
    const { data, isSuccess, isLoading } = api.users.getOneUser.useQuery({ userId: id })

    const { mutateAsync: sendFollowRequest } = api.follows.sendFollowRequest.useMutation({ 
        onMutate: async () => {
            await apiUtils.users.getOneUser.cancel();
            apiUtils.users.getOneUser.setData(
                { userId: id }, 
                prev => {
                    if (!prev) return;
                    return {...prev, status: 'pending'}
                }
            );
        },

        onError: () => {
            apiUtils.users.getOneUser.setData(
                {userId: id },
                prev => {
                    if (!prev) return;
                    return { ...prev, status: null }
                }
            )
        },

        onSettled: async () => {
            await apiUtils.users.getOneUser.invalidate({ userId: id })
        }
    });

    const { mutate: removeFollowRequest } = api.follows.deleteFollowRequest.useMutation({
        onMutate: async () => {
            await apiUtils.users.getOneUser.cancel();
            apiUtils.users.getOneUser.setData(
                { userId: id }, 
                prev => {
                    if (!prev) return;
                    return {...prev, status: null }
                }
            );
        },

        onError: () => {
            apiUtils.users.getOneUser.setData(
                {userId: id },
                prev => {
                    if (!prev) return;
                    return { ...prev, status: 'pending' }
                }
            )

            toast.error("Could not undo request at this time.")
        },

        onSuccess: () => toast.success("Follow request undone!"),
        onSettled: async () => await apiUtils.users.getOneUser.invalidate({ userId: id }),
    })

    if (!data && isSuccess) {
        return (
            <p>User does not exist</p>
        )
    }

    return (
        <MainLayout title="Benji Book" description="A user page">
            {isLoading && (
                <p>Loading</p>
            )}
            {data && isSuccess && (
                <div className="flex flex-col items-center gap-5">
                    <header 
                        className={classNames(
                            "bg-white rounded-b-lg w-full flex flex-col gap-3 items-center md:items-start p-5 h-fit max-w-screen-lg shadow-lg relative",
                            "md:rounded-lg md:w-10/12 md:mt-10 "
                        )}
                    >
                        <div className="flex flex-col md:flex-row md:gap-5 items-center">
                            <div className="w-32 h-32 sm:w-48 sm:h-48 md:w-32 md:h-32 relative group">
                                <Avatar url={data.image} className="" />
                                {data.status === 'self' && (
                                    <div className={"absolute top-0 -right-3 hidden group-hover:block"}> 
                                        <UpdateAvatar userId={data.id} avatar={data.image} />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col items-center md:items-start relative group">
                                <p className="text-slate-300 text-base -mb-1">@{data.username}</p>
                                <h1 className="font-semibold text-4xl mb-2">{data.firstName} {data.lastName}</h1>
                                {data.bio && <p className="text-center md:text-left leading-tight line-clamp-3 md:text-sm lg:text-base">{data.bio}</p>}
                                
                                {data.status === 'self' && (
                                    <div className="absolute top-0 right-0 group-hover:block hidden">
                                        <UpdateProfileForm user={data} />
                                    </div>)
                                }
                            </div>
                        </div>

                        {(data.status === 'self' || data.status === 'accepted') && (
                            <div className="flex justify-center gap-10 w-full md:justify-start md:px-3.5">
                                <Link href={`/users/${data.id}/follows`}>
                                    <Button variant="minimal" propagate>
                                        {data._count.following} Following
                                    </Button>
                                </Link>
                                <Link href={`/users/${data.id}/followers`}>
                                    <Button variant="minimal" propagate>
                                        {data._count.followedBy} Followers
                                    </Button>
                                </Link>
                                {data.status === 'self' && (
                                    <Link href={`/users/${data.id}/requests`}>
                                        <Button variant="minimal" propagate>
                                            {data._count.requests} Requests
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </header>

                    <div className="w-full px-5 max-w-screen-lg md:w-10/12">
                        {!data.status && (
                            <div className="flex flex-col gap-3">
                                <p className="text-xl font-semibold text-center">You don&apos;t follow this person yet!</p>
                                <Button variant="filled" onClick={() => sendFollowRequest({ followingId: data.id })}>
                                    Send Follow Request
                                </Button>
                            </div>
                        )}
                        {data.status === 'pending' && (
                            <>
                                <p className="text-xl font-semibold text-center mb-5">Follow Request Sent!</p>
                                <Button onClick={() => removeFollowRequest({ followingId: data.id, followerId: currentUser.id })}>
                                    Undo Request
                                </Button>
                            </>
                        )}
                        {data.status === 'denied' && <p>Your follow request was denied.</p>}
                        {(data.status === 'accepted' || data.status === 'self') && (
                            <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-auto gap-8 md:gap-4">
                                {data.posts.map(post => (
                                    <PostThumbnail post={post} key={post.id} />
                                ))}
                            </section>
                        )}
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default AccountPage;

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
        props: {
            currentUser: session.user
        }
    }
}