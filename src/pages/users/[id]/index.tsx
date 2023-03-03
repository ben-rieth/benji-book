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
                    <header className="bg-white rounded-b-lg md:rounded-lg w-full md:w-10/12 md:mt-10 flex flex-col p-5">
                        <div className="flex">
                            <Avatar url={data.image} className="w-16 h-16" />
                        </div>
                        <h1 className="font-semibold text-3xl">{data.firstName} {data.lastName}</h1>
                        {data.bio && <p>{data.bio}</p>}
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