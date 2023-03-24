import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Button from "../components/general/Button";
import DangerButton from "../components/general/DangerButton";
import MainLayout from "../components/layouts/MainLayout";
import { api } from "../utils/api";
import UpdateAvatar from "../components/auth/UpdateAvatar";
import type { GetServerSideProps, NextPage } from "next";
import { getServerSession, type User } from "next-auth";
import { authOptions } from "../server/auth";
import UpdateProfileForm from "../components/auth/UpdateProfileForm";

type SettingsPageProps = {
    user: User;
}

const SettingsPage: NextPage<SettingsPageProps> = ({ user }) => {
    const router = useRouter();

    const { mutate: deleteAccount } = api.users.deleteAccount.useMutation({
        onMutate: () => {
            const id = toast.loading('Deleting your data data...');
            return { id }
        },

        onSuccess: async (_data, _variables, ctx) => {
            if (ctx?.id) toast.dismiss(ctx.id);
            await router.push("/");
        }
    });

    const { data: fullUserData, isSuccess: isFullDataSuccess } = api.users.getOneUser.useQuery({ userId: user.id });

    return (
        <MainLayout title="Settings" description="Your personal settings">
            <div className="flex flex-col items-center mt-5 gap-5 mx-5">
                <h1 className="font-semibold text-2xl">User Settings</h1>
                
                <section className="bg-white rounded-lg flex flex-col items-center  max-w-screen-md w-full p-3 gap-3">
                    <h2 className="font-semibold text-2xl">Account</h2>
                    <UpdateAvatar 
                        avatar={user.image} 
                        userId={user.id}
                        trigger={(
                            <Button>
                                Edit Profile Picture
                            </Button>
                        )}
                    />
                    {isFullDataSuccess && fullUserData?.status === 'SELF' && (
                        <UpdateProfileForm 
                            user={fullUserData}
                            trigger={(
                                <Button>
                                    Edit Profile Information
                                </Button>
                            )}
                        />
                    )}
                </section>
                
                <section className="bg-white rounded-lg flex flex-col items-center  max-w-screen-md w-full p-3">
                    <h2 className="font-semibold text-2xl text-red-500">Danger</h2>
                    <DangerButton
                        alertActionLabel="Delete Account"
                        alertTitle="Are you sure?"
                        alertDescription="This action cannot be undone. Your account and all related information (posts, likes, comments, relationships) will be removed permanently from our servers."
                        onClick={() => deleteAccount()}
                    >
                        Delete Account
                    </DangerButton>
                </section>
            </div>
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
        props: {
            user: session.user,
        }
    }
}

export default SettingsPage;