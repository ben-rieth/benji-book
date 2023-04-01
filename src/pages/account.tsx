import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../server/auth";

const AccountPage= () => {
    return (
        <p>Not here</p>
    )
}
export const getServerSideProps: GetServerSideProps = async ({ req, res}) => {
    const session = await getServerSession(req, res, authOptions);

    if (session && session.user && session.user.setData) {
        return {
            redirect: {
                destination: `/users/${session.user?.id}`,
                permanent: true,
            }
        }
    }

    return {
        redirect: {
            destination: '/',
            permanent: false,
        }
    }
}

export default AccountPage;