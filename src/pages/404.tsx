import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "../components/general/Button";
import MainLayout from "../components/layouts/MainLayout";
import AuthLayout from "../components/layouts/AuthLayout";

const NotFoundPage = () => {
    const { data: session } = useSession();

    if (session && session.user) {
        return (
            <MainLayout title="404" description="Could not find the page you were looking for.">
                <h1 className="font-semibold text-2xl text-center">That page does not exist!</h1>
                <Link href="/feed">
                    <Button variant="minimal">
                        Return to Feed
                    </Button>
                </Link>
                <Link href="/account">
                    <Button variant="minimal">
                        Your Account Page
                    </Button>
                </Link>
            </MainLayout>
        )
    }

    return (
        <AuthLayout description="Could not find the page you were looking for.">
            <h1 className="font-semibold text-2xl text-center">That page does not exist!</h1>
                <Link href="/">
                    <Button variant="minimal">
                        Sign In to Benjibook
                    </Button>
                </Link>
        </AuthLayout>
    )
}

export default NotFoundPage;