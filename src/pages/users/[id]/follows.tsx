import classNames from "classnames";
import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import ErrorBox from "../../../components/error/ErrorBox";
import Button from "../../../components/general/Button";
import MainLayout from "../../../components/layouts/MainLayout";
import Avatar from "../../../components/users/Avatar";
import UserCard from "../../../components/users/UserCard";
import { authOptions } from "../../../server/auth";
import { api } from "../../../utils/api";

const FollowingPage: NextPage = () => {
    const router = useRouter();
    const userId = router.query.id as string;

    const { data, isSuccess, isError, isLoading } = api.follows.getFollowing.useQuery({ userId });

    return (
        <MainLayout title="Benji Book" description="">
            {isSuccess && (
                <div className="flex flex-col items-center gap-2">
                    <header 
                        className={classNames(
                            "bg-white rounded-b-lg w-full flex flex-col items-center p-5 h-fit max-w-screen-lg shadow-lg relative",
                            "md:rounded-lg md:w-10/12 md:mt-10 md:flex-row md:gap-5"
                        )}
                    >
                        <Avatar url={data.user?.image} className="w-32 h-32 sm:w-48 sm:h-48 md:w-32 md:h-32" />
                        <div className="flex flex-col items-center md:items-start">
                            <p className="text-slate-300 text-base -mb-1">@{data.user?.username}</p>
                            <h1 className="font-semibold text-4xl mb-2">{data.user?.firstName} {data.user?.lastName}</h1>
                        </div>

                        <div className="flex justify-center gap-10 w-full">
                            <Link href={`/users/${data.user?.id as string}/follows`}>
                                <Button variant="minimal">
                                    {data.user?._count.following} Following
                                </Button>
                            </Link>
                            <Link href={`/users/${data.user?.id as string}/followers`}>
                                <Button variant="minimal">
                                    {data.user?._count.followedBy} Followers
                                </Button>
                            </Link>
                        </div>
                    </header>
                    <h2 className="text-2xl font-semibold">Following</h2>
                    <section className="flex flex-col gap-2 items-center w-full px-10 ">
                        {data.following.map(relation => (
                            <Link href={`/users/${relation.following.id}`} key={relation.following.id} className="w-full ">
                                <UserCard user={relation.following} onFollowRequest={() => console.log("")} />
                            </Link>
                        ))}
                    </section>
                </div>
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



export default FollowingPage;