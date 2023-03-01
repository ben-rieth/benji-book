import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";
import { api } from "../../utils/api";

const SearchUsersPage: NextPage = () => {

    const { data, isSuccess } = api.users.getAllUsers.useQuery();

    return (
        <main>
            {isSuccess && JSON.stringify(data)}
        </main>
    )
};

export const getServerSideProps : GetServerSideProps = async ({ req, res }) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    if (!session.user) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    return {
        props: {}
    };
}

export default SearchUsersPage;