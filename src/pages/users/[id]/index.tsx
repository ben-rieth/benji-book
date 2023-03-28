import { RequestStatus } from "@prisma/client";
import classNames from "classnames";
import { addDays, formatDistance, isAfter } from "date-fns";
import type { GetServerSideProps} from "next";
import { type NextPage } from "next";
import type { User } from "next-auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import Button from "../../../components/general/Button";
import DangerButton from "../../../components/general/DangerButton";
import Loader from "../../../components/general/Loader/Loader";
import MainLayout from "../../../components/layouts/MainLayout";
import PostThumbnail from "../../../components/posts/PostThumbnail";
import Avatar from "../../../components/users/Avatar";
import { authOptions } from "../../../server/auth";
import { api } from "../../../utils/api";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { GoKebabVertical } from 'react-icons/go'
import { prisma } from "../../../server/db";
import { FiSettings } from 'react-icons/fi';

type AccountPageProps = {
    currentUser: User;
}

const AccountPage: NextPage<AccountPageProps> = ({ currentUser }) => {

    const router = useRouter();
    const queries = router.query;
    const id = queries.id as string;

    const apiUtils = api.useContext();
    const { data, isSuccess, isLoading } = api.users.getOneUser.useQuery({ userId: id });

    const { mutateAsync: sendFollowRequest } = api.follows.sendFollowRequest.useMutation({ 
        onMutate: () => apiUtils.users.getOneUser.cancel(),
        onSuccess: () => toast.success("Follow request sent!"),
        onError: () => toast.error("Cannot send follow request"),
        onSettled: () => apiUtils.users.getOneUser.invalidate({ userId: id })
    });

    const { mutate: removeFollowRequest } = api.follows.deleteFollowRequest.useMutation({
        onMutate: async () => {
            await apiUtils.users.getOneUser.cancel();
        },
        onError: () => toast.error("Could not remove request at this time."),
        onSuccess: () => toast.success("Follow request removed!"),
        onSettled: async () => {
            await apiUtils.users.getOneUser.invalidate({ userId: id })
        },
    })

    return (
        <MainLayout title="Benji Book" description="A user page">
            {isLoading && (
                <div className="w-full mt-10">
                    <Loader text="Getting user info" />
                </div>
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
                            <Avatar url={data.image} placeholder={data.imagePlaceholder} className="w-32 h-32 sm:w-48 sm:h-48 md:w-32 md:h-32 relative" />
                            <div className="flex flex-col items-center md:items-start relative group">
                                <p className="text-slate-300 text-base -mb-1">@{data.username}</p>
                                <h1 className="font-semibold text-4xl mb-2">{data.firstName} {data.lastName}</h1>
                                {data.bio && <p className="text-center md:text-left leading-tight line-clamp-3 lg:text-lg">{data.bio}</p>}

                                {(data.status === 'SELF' || data.status === RequestStatus.ACCEPTED) && (
                                    <div className="flex gap-5 w-fit -ml-2">
                                        <Link href={`/users/${data.id}/follows`}>
                                            <Button variant="minimal" >
                                                {data._count.following} Following
                                            </Button>
                                        </Link>
                                        <Link href={`/users/${data.id}/followers`}>
                                            <Button variant="minimal" >
                                                {data._count.followedBy} Followers
                                            </Button>
                                        </Link>
                                        {data.status === 'SELF' && (
                                            <Link href={`/users/${data.id}/requests`}>
                                                <Button variant="minimal" >
                                                    {data._count.requests} Requests
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={classNames("absolute top-5 right-5", { "hidden": data.status !== "ACCEPTED" && (data.status === 'SELF' || !data.followedByCurrent)})}>
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger>
                                    <GoKebabVertical className="w-5 h-5" />
                                </DropdownMenu.Trigger>

                                <DropdownMenu.Portal>
                                    <DropdownMenu.Content sideOffset={10} className="bg-white py-2 px-5 w-76 rounded-lg shadow-2xl flex flex-col">
                                        <DropdownMenu.Arrow className="fill-white" />

                                        <DropdownMenu.Item className={classNames({ "hidden": data.status !== "ACCEPTED" })}>
                                            <DangerButton
                                                alertTitle="Are you sure?"
                                                alertDescription="If you want to follow this person again in the future, you will have to send another request."
                                                alertActionLabel="Unfollow"
                                                variant="minimal"
                                                onClick={() => removeFollowRequest({ followerId: currentUser.id, followingId: data.id })}
                                            >
                                                Unfollow
                                            </DangerButton>
                                        </DropdownMenu.Item>

                                        <DropdownMenu.Item className={classNames({ "hidden": data.status === 'SELF' || !data.followedByCurrent })}>
                                            <DangerButton
                                                alertTitle="Are you sure?"
                                                alertDescription="This person will be able to send follow requests in the future."
                                                alertActionLabel="Remove Follower"
                                                variant="minimal"
                                                onClick={() => removeFollowRequest({ followerId: data.id, followingId: currentUser.id })}
                                            >
                                                Remove Follower
                                            </DangerButton>
                                        </DropdownMenu.Item>

                                    </DropdownMenu.Content>
                                </DropdownMenu.Portal>
                            </DropdownMenu.Root>
                        </div>
                        {data.status === 'SELF' && (
                            <Link href="/settings" className="absolute top-5 right-5">
                                <FiSettings className="w-5 h-5 hover:scale-105 hover:fill-sky-500 active:fill-sky-600" />
                            </Link>
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
                        {data.status === RequestStatus.PENDING && (
                            <>
                                <p className="text-xl font-semibold text-center mb-5">Follow Request Sent!</p>
                                <Button onClick={() => removeFollowRequest({ followingId: data.id, followerId: currentUser.id })}>
                                    Undo Request
                                </Button>
                            </>
                        )}
                        {data.status === RequestStatus.DENIED && isAfter(data.statusUpdatedAt as Date, addDays(new Date(), 7)) && (
                            <>
                                <p className="text-xl text-center">Your follow request was denied.</p>
                                <Button variant="filled" onClick={() => sendFollowRequest({ followingId: data.id })}>
                                    Send Another Request
                                </Button>
                            </>
                        )}
                        {data.status === RequestStatus.DENIED && !isAfter(data.statusUpdatedAt as Date, addDays(new Date(), 7)) && (
                            <>
                                <p className="text-xl text-center">Your follow request was denied.</p>
                                <p className="text-center">You can send another request in {formatDistance(new Date(), addDays(data.statusUpdatedAt as Date, 7))}</p>
                            </>
                        )}
                        {(data.status === RequestStatus.ACCEPTED || data.status === 'SELF') && (
                            <section className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-auto gap-8 md:gap-4">
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
        props: {
            currentUser: session.user
        }
    }
}