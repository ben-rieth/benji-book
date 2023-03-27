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
import SelectInput from '../components/inputs/SelectInput';
import { Form, Formik } from "formik";
import type { NotificationLocation, Theme } from "@prisma/client";
import { allCapsToDash } from "../utils/toast";

type SettingsPageProps = {
    user: User;
}

type AppearanceFormValues = {
    notificationLocation: NotificationLocation,
    theme: Theme
}

const SettingsPage: NextPage<SettingsPageProps> = ({ user }) => {
    const router = useRouter();

    const apiUtils = api.useContext();
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

    const { mutate } = api.settings.updateSettings.useMutation({
        onSuccess: () => toast.success("Appearance preferences updated!"),
        onError: () => toast.error("Could not update preferences."),
        onSettled: async () => {
            await apiUtils.settings.invalidate()
        }
    });

    return (
        <MainLayout title="Settings" description="Your personal settings">
            <div className="flex flex-col items-center mt-5 gap-5 mx-5">
                <h1 className="font-semibold text-2xl">User Settings</h1>
                
                <section className="bg-white rounded-lg flex flex-col items-center  max-w-screen-md w-full p-3 gap-3 shadow-md">
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
                
                <section className="bg-white rounded-lg flex flex-col items-center  max-w-screen-md w-full p-3 gap-3 shadow-md">
                    <h2 className="font-semibold text-2xl">Appearance</h2>

                    <Formik
                        initialValues={{
                            notificationLocation: 'BOTTOMRIGHT',
                            theme: 'SYSTEM'
                        } as AppearanceFormValues}
                        onSubmit={(values) => {
                            mutate({...values})
                        }}
                    >
                        {(props) => (
                            <Form className="flex flex-col items-center">
                                <SelectInput 
                                    label="Notification Location"
                                    placeholder="Notification Location"
                                    name="notificationLocation"
                                    onChange={(text) => {
                                        props.setFieldValue('notificationLocation', text);
                                        toast.success("Example Notification", { position: allCapsToDash(text) })
                                    }}
                                    items={[
                                        { value: 'TOPLEFT', text: 'Top Left' },
                                        { value: 'TOPCENTER', text: 'Top Center' },
                                        { value: 'TOPRIGHT', text: 'Top Right' },
                                        { value: 'BOTTOMLEFT', text: 'Bottom Left' },
                                        { value: 'BOTTOMCENTER', text: 'Bottom Center' },
                                        { value: 'BOTTOMRIGHT', text: 'Bottom Right (default)' }
                                    ]}
                                    value={props.values.notificationLocation as string}
                                />

                                <SelectInput
                                    label="Theme"
                                    placeholder="Theme"
                                    name="theme"
                                    onChange={(text) => {
                                        props.setFieldValue('theme', text)
                                    }}
                                    items={[
                                        { value: 'LIGHT', text: 'Light' },
                                        { value: 'DARK', text: 'Dark' },
                                        { value: 'SYSTEM', text: 'System Default' }
                                    ]}
                                    value={props.values.theme as string}
                                />

                                <div className="h-5" />

                                <Button>
                                    Update Appearance Preferences
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </section>

                <section className="bg-white rounded-lg flex flex-col items-center  max-w-screen-md w-full p-3 shadow-md">
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