import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth/next";
import SignInForm from "../components/auth/SignInForm";
import AuthLayout from "../components/layouts/AuthLayout";
import Logo from "../components/logo/Logo";
import { authOptions } from "../server/auth";

const Home: NextPage = () => {

  return (
    <AuthLayout description="Sign in to your Benji Book account!">
      <div className="flex flex-col items-center">
        <Logo />
        <p className="w-60 text-center text-sm">Disclaimer: This is a dummy app. Please do not actually use it.</p>
      </div>
      <SignInForm />
    </AuthLayout>
  );
};

export const getServerSideProps : GetServerSideProps = async ({ req, res}) => {
  const session = await getServerSession(req, res, authOptions);

  if (session && session.user?.setData) {
    return {
      redirect: {
        destination: '/feed',
        permanent: false
      }
    };

  } else if (session && !session.user?.setData) {
    return {
      redirect: {
        destination: '/onboarding',
        permanent: false,
      }
    }

  }

  return {
    props: {}
  };
}

export default Home;