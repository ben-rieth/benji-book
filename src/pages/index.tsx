import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import SignInForm from "../components/auth/SignInForm";
import AuthLayout from "../components/layouts/AuthLayout";
import Logo from "../components/logo/Logo";
import { authOptions } from "../server/auth";

const Home: NextPage = () => {

  return (
    <AuthLayout description="Sign in to your Benji Book account!">
      <div className="flex flex-col items-center md:items-start">
        <Logo />
        <p className="w-60 text-center md:text-left text-sm">Disclaimer: This is a dummy app. Please do not actually use it.</p>
      </div>
      <SignInForm />
    </AuthLayout>
  );
};

export const getServerSideProps : GetServerSideProps = async ({ req, res}) => {
  const session = await getServerSession(req, res, authOptions);

  if (session && session.user.hasData) {
    return {
      redirect: {
        destination: '/posts',
        permanent: false
      }
    };

  } else if (session && !session.user.hasData) {
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