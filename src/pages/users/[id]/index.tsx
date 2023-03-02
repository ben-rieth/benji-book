import { type NextPage } from "next";
import { useRouter } from "next/router";
import MainLayout from "../../../components/layouts/MainLayout";
import Avatar from "../../../components/users/Avatar";
import { api } from "../../../utils/api";

const AccountPage: NextPage = () => {

    const router = useRouter();
    const { id } = router.query;

    const { data, isSuccess } = api.users.getOneUser.useQuery({ userId: id as string })

    return (
        <MainLayout title="Benji Book" description="A user page">
            {isSuccess && (
                <div className="flex flex-col items-center">
                    <header className="bg-white rounded-lg w-10/12 mt-10 flex flex-col p-5">
                        <div className="flex">
                            <Avatar url={data?.user?.image} className="w-16 h-16" />
                        </div>
                        <h1 className="font-semibold text-3xl">{data.user?.firstName} {data.user?.lastName}</h1>
                        <p>This is a bio</p>
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