import classNames from "classnames";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import MainLayout from "../../../components/layouts/MainLayout";
import Avatar from "../../../components/users/Avatar";
import { api } from "../../../utils/api";

const AccountPage: NextPage = () => {

    const router = useRouter();
    const { id } = router.query;

    const { data, isSuccess, isLoading } = api.users.getOneUser.useQuery({ userId: id as string })

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
                <div className="flex flex-col items-center">
                    <header 
                        className={classNames(
                            "bg-white rounded-b-lg w-full flex flex-col items-center px-5 py-3 h-fit max-w-screen-lg shadow-md",
                            "md:rounded-lg md:w-10/12 md:mt-10 md:flex-row md:gap-5"
                        )}
                    >
                        <Avatar url={data.image} className="w-32 h-32 sm:w-48 sm:h-48 md:w-32 md:h-32" />
                        <div className="flex flex-col items-center md:items-start">
                            <p className="text-slate-300 text-base">@{data.username}</p>
                            <h1 className="font-semibold text-4xl">{data.firstName} {data.lastName}</h1>
                            {data.bio && <p className="text-center md:text-left">{data.bio}</p>}
                        </div>
                    </header>

                    <div>
                        {!data.status && <p>You don&apos;t follow this person yet</p>}
                        {data.status === 'accepted' && <p>There will be posts here</p>}
                        {data.status === 'pending' && <p>Waiting on accepting</p>}
                        {data.status === 'denied' && <p>Denied</p>}
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default AccountPage;