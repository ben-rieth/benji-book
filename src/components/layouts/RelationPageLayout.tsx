import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FC, ReactNode } from "react";
import { api } from "../../utils/api";
import ErrorBox from "../error/ErrorBox";
import Button from "../general/Button";
import Avatar from "../users/Avatar";
import MainLayout from "./MainLayout";

type RelationPageLayoutProps = {
    // user: FullUser | PrivateUser | Self | undefined | null;
    children: ReactNode;
    isError: boolean;
}

const RelationPageLayout: FC<RelationPageLayoutProps> = ({ isError, children }) => {

    const router = useRouter();
    const queries = router.query;
    const id = queries.id as string;

    const { data: user, isSuccess, isLoading } = api.users.getOneUser.useQuery({ userId: id })

    return (
        <MainLayout title="Benji Book" description="">
            {isSuccess && user && (user.status === 'accepted' || user.status === 'self') && (
                <div className="flex flex-col items-center gap-2">
                    <header 
                        className={classNames(
                            "bg-white rounded-b-lg w-full flex flex-col items-center p-5 h-fit max-w-screen-lg shadow-lg relative",
                            "md:rounded-lg md:w-10/12 md:mt-10 md:flex-row md:gap-5"
                        )}
                    >
                        <Avatar url={user?.image} className="w-32 h-32 sm:w-48 sm:h-48 md:w-32 md:h-32" />
                        <div className="flex flex-col items-center md:items-start">
                            <p className="text-slate-300 text-base -mb-1">@{user?.username}</p>
                            <h1 className="font-semibold text-4xl mb-2">{user?.firstName} {user?.lastName}</h1>
                        </div>

                        <div className="flex justify-center gap-10 w-full">
                            <Link href={`/users/${user.id}/follows`}>
                                <Button variant="minimal">
                                    {user?._count.following} Following
                                </Button>
                            </Link>
                            <Link href={`/users/${user.id}/followers`}>
                                <Button variant="minimal">
                                    {user?._count.followedBy} Followers
                                </Button>
                            </Link>
                            {user.status === 'self' && (
                                <Link href={`/users/${user.id}/requests`}>
                                    <Button variant="minimal" propagate>
                                        {user._count.requests} Requests
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </header>
                    {children}
                </div>
            )}
            {isSuccess && !user && (
                <section className="max-w-xl mx-auto mt-10">
                    <ErrorBox message="User not found"/>
                </section>
            )}
            {isSuccess && user && (!user.status || user.status === 'pending' || user.status === 'denied') && (
                <section className="max-w-xl mx-auto mt-10">
                    <ErrorBox message="Not authorized."/>
                </section>
            )}
            {isError && (
                <section className="max-w-xl mx-auto mt-10">
                    <ErrorBox message="Error getting user data."/>
                </section>
            )}
            {isLoading && (
                <p>Loading</p>
            )}
        </MainLayout>
    )
}

export default RelationPageLayout;