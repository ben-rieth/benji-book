import { useRouter } from "next/router";
import toast from "react-hot-toast";
import DangerButton from "../components/general/DangerButton";
import MainLayout from "../components/layouts/MainLayout";
import { api } from "../utils/api";

const SettingsPage = () => {

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

    return (
        <MainLayout title="Settings" description="Your personal settings">
            <div className="flex flex-col items-center mt-5 gap-5">
                <h1 className="font-semibold text-2xl">User Settings</h1>
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

export default SettingsPage;