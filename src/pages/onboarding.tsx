import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import AboutYouForm from "../components/AboutYouForm/AboutYouForm";
import { authOptions } from "../server/auth";

const OnboardingPage: NextPage = () => {
    return (
        <AboutYouForm />
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

    if (session.user.hasData) {
        return {
            redirect: {
                destination: '/posts',
                permanent: false,
            }
        }
    }

    return { props: {} };
}