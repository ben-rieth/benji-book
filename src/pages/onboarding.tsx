import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import AboutYouForm from "../components/auth/AboutYouForm";
import Button from "../components/general/Button";
import AuthLayout from "../components/layouts/AuthLayout";
import Logo from "../components/logo/Logo";
import { authOptions } from "../server/auth";

const OnboardingPage: NextPage = () => {

    const router = useRouter();

    const logOut = async () => {
        const data = await signOut({ redirect: false, callbackUrl: '/' });
        await router.push(data.url)
    }
    
    return (
        <AuthLayout description="Tell us about yourself so we can setup your Benji Book account!">
            <Logo />
            <AboutYouForm />
            <Button variant="minimal" onClick={logOut}>
                Return to Sign In Page
            </Button>
        </AuthLayout>
    );
};

export default OnboardingPage;

export const getServerSideProps: GetServerSideProps = async ({ req, res}) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    if (session?.user?.setData) {
        return {
            redirect: {
                destination: '/feed',
                permanent: false,
            }
        }
    }

    return { props: {} };
}