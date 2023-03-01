import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import AboutYouForm from "../components/auth/AboutYouForm";
import AuthLayout from "../components/layouts/AuthLayout";
import Logo from "../components/logo/Logo";
import { authOptions } from "../server/auth";

const OnboardingPage: NextPage = () => {
    return (
        <AuthLayout description="Tell us about yourself so we can setup your Benji Book account!">
            <Logo />
            <AboutYouForm />
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