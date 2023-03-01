import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession } from "next-auth";
import UserCard from "../../components/users/UserCard";
import { authOptions } from "../../server/auth";
import { api } from "../../utils/api";

const SearchUsersPage: NextPage = () => {

    const { data, isSuccess } = api.users.getAllUsers.useQuery();

    return (
        <main className="bg-neutral-100 h-screen">
            {isSuccess && (
                <section className="flex flex-col gap-5 items-center">
                    {data.map(user => (
                        <UserCard user={user} key={user.id} />
                    ))}
                </section>
            )}
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