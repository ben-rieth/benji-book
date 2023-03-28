import { useSession } from "next-auth/react";
import AuthLayout from "../components/layouts/AuthLayout";
import MainLayout from "../components/layouts/MainLayout";

const ServerErrorPage = () => {
    const { data: session } = useSession();

    if (session && session.user) {
        return (
            <MainLayout title="500" description="An unexpected error occurred">
                <h1 className="font-semibold text-2xl text-center mt-5">An error occurred on the server! Try your request again in a moment!</h1>

            </MainLayout>
        )
    }

    return (
        <AuthLayout description="An unexpected error ocurred.">
            <h1 className="font-semibold text-2xl text-center mt-5">An error occurred on the server! Try your request again in a moment!</h1>
        </AuthLayout>
    )
}

export default ServerErrorPage;