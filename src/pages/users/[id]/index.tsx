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
                    <header className="bg-white rounded-lg w-10/12 mt-10">
                        <Avatar url={data?.user?.image} className="w-16 h-16" />
                    </header>
                </div>
            )}
        </MainLayout>
    );
};

export default AccountPage;