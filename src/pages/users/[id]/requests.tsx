import type { NextPage, GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../server/auth";

const RequestsPage: NextPage = () => {
    return (
        <div></div>
    )
}

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
        props: {},
    }
}

export default RequestsPage;