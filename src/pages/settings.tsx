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
// import SelectInput from '../components/inputs/SelectInput';
import { Form, Formik } from "formik";
// import type { NotificationLocation, Theme } from "@prisma/client";
// import { allCapsToDash } from "../utils/toast";
import TextInput from "../components/inputs/TextInput";
import classNames from "classnames";

type SettingsPageProps = {
    user: User;
}

// type AppearanceFormValues = {
//     notificationLocation: NotificationLocation,
//     theme: Theme
// }

const SettingsPage: NextPage<SettingsPageProps> = ({ user }) => {
    const router = useRouter();

    // const apiUtils = api.useContext();
    const { mutate: deleteAccount } = api.users.deleteAccount.useMutation({
        onMutate: () => {
            const id = toast.loading('Deleting your use data...');
            return { id }
        },

        onSuccess: async (_data, _variables, ctx) => {
            if (ctx?.id) toast.dismiss(ctx.id);
            await router.push("/");
        },

        onError: (_data, _values, ctx) => {
            if (ctx?.id) toast.dismiss(ctx.id);
            toast.error("Could not delete account. Try again later.")
        },
    });

    const { data: fullUserData, isSuccess: isFullDataSuccess } = api.users.getOneUser.useQuery({ userId: user.id });

    // const { mutate } = api.settings.updateSettings.useMutation({
    //     onMutate: async (values) => {
    //         await apiUtils.settings.getNotificationLocation.cancel();
    //         await apiUtils.settings.getTheme.cancel();

    //         const prevData = apiUtils.settings.getNotificationLocation.getData();

    //         apiUtils.settings.getNotificationLocation.setData(
    //             undefined,
    //             prev => {
    //                 if (!prev) return;
    //                 return values.notificationLocation
    //             }
    //         )
            
    //         return {
    //             prevData
    //         }
    //     },
    //     onSuccess: () => toast.success("Appearance preferences updated!"),
    //     onError: (_err, _values, ctx) => {
    //         toast.error("Could not update preferences.")
    //         if (ctx)
    //             apiUtils.settings.getNotificationLocation.setData(undefined, ctx?.prevData);
    //     },
    //     onSettled: async () => {
    //         await apiUtils.settings.getNotificationLocation.invalidate();
    //         await apiUtils.settings.getTheme.invalidate();
    //     }
    // });

    const { mutate: maintainAccount } = api.settings.maintainAccount.useMutation({
        onSuccess: () => toast.success("Your account's data will be maintained!"),
        onError: () => toast.error("Key incorrect"),
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
                
                {/* <section className="bg-white rounded-lg flex flex-col items-center  max-w-screen-md w-full p-3 gap-3 shadow-md">
                    <h2 className="font-semibold text-2xl">Appearance</h2>

                    <Formik
                        initialValues={{
                            notificationLocation: 'BOTTOMRIGHT',
                            theme: 'SYSTEM'
                        } as AppearanceFormValues}
                        onSubmit={(values) => {
                            mutate({
                                notificationLocation: values.notificationLocation,
                                theme: values.theme
                            })
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
                                <div className="h-5" />

                                <Button onClick={props.submitForm}>
                                    Update Appearance Preferences
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </section> */}

                <section className={classNames("bg-white rounded-lg flex flex-col items-center  max-w-screen-md w-full p-3 shadow-md")}>
                    <h2 className="font-semibold text-2xl">Maintain Account</h2>
                    <p className="text-sm text-center md:px-10">By default all accounts are deleted on the first day of every month in the evening. If you would like to have your account and data maintained, please enter the maintain account code.</p>

                    <Formik
                        initialValues={{
                            key: ''
                        }}
                        onSubmit={(values) => {
                            maintainAccount({ key: values.key })
                        }}
                    >
                        {(props) => (
                            <Form className="flex flex-col items-center gap-2">
                                <TextInput 
                                    label="Key"
                                    id="key"
                                    name="key"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.key}
                                    error={undefined}
                                    touched={undefined}
                                />

                                <Button onClick={props.submitForm}>
                                    Submit Key
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </section>

                <section className="bg-white rounded-lg flex flex-col items-center  max-w-screen-md w-full p-3 shadow-md">
                    <h2 className="font-semibold text-2xl text-red-500 mb-5">Danger</h2>
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

    if (!session || !session.user || !session.user.setData) {
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