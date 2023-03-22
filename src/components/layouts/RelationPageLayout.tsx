import { useAutoAnimate } from "@formkit/auto-animate/react";
import { RequestStatus } from "@prisma/client";
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
}

const RelationPageLayout: FC<RelationPageLayoutProps> = ({ children }) => {

    const router = useRouter();
    const queries = router.query;
    const id = queries.id as string;

    const [animateRef] = useAutoAnimate();

    const { data: user, isSuccess, isLoading, isError } = api.users.getOneUser.useQuery({ userId: id })

    return (
        <MainLayout title="Benji Book" description="">
            {isSuccess && user && (user.status === RequestStatus.ACCEPTED || user.status === 'SELF') && (
                <div className="flex flex-col items-center gap-2">
                    <header 
                        className={classNames(
                            "bg-white rounded-b-lg w-full flex flex-col items-center md:items-start p-5 h-fit max-w-screen-lg shadow-lg relative",
                            "md:rounded-lg md:w-10/12 md:mt-10 "
                        )}
                    >
                        <div className="flex flex-col md:flex-row md:gap-5 items-center">
                            <Avatar url={user?.image} placeholder={user?.imagePlaceholder} className="w-32 h-32 sm:w-48 sm:h-48 md:w-32 md:h-32" />
                            <div className="flex flex-col items-center md:items-start">
                                <p className="text-slate-300 text-base -mb-1">@{user?.username}</p>
                                <Link href={`/users/${user.id}`}>
                                    <h1 className="font-semibold text-4xl mb-2 hover:underline">{user?.firstName} {user?.lastName}</h1>
                                </Link>
                                <div className="flex gap-5 w-fit -ml-2">
                                    <Link href={`/users/${user.id}/follows`}>
                                        <Button variant="minimal" >
                                            {user?._count.following} Following
                                        </Button>
                                    </Link>
                                    <Link href={`/users/${user.id}/followers`}>
                                        <Button variant="minimal" >
                                            {user?._count.followedBy} Followers
                                        </Button>
                                    </Link>
                                    {user.status === 'SELF' && (
                                        <Link href={`/users/${user.id}/requests`}>
                                            <Button variant="minimal" >
                                                {user._count.requests} Requests
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>
                    <section 
                        className="flex flex-col gap-2 items-center w-full px-10 max-w-screen-md"
                        ref={animateRef}
                    >
                        {children}
                    </section>
                </div>
            )}
            {isSuccess && !user && (
                <section className="max-w-xl mx-auto mt-10">
                    <ErrorBox message="User not found"/>
                </section>
            )}
            {isSuccess && user && (!user.status || user.status === RequestStatus.PENDING || user.status === RequestStatus.DENIED) && (
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