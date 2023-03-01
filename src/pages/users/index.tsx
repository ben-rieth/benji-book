import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession } from "next-auth";
import { useState } from "react";
import TextInput from "../../components/inputs/TextInput";
import UserCard from "../../components/users/UserCard";
import { authOptions } from "../../server/auth";
import { api } from "../../utils/api";
import { BiSearchAlt } from 'react-icons/bi';

const SearchUsersPage: NextPage = () => {

    const { data, isSuccess } = api.users.getAllUsers.useQuery();

    const [query, setQuery] = useState<string>('');
 
    return (
        <main className="bg-neutral-100 h-screen flex flex-col gap-4">
            <TextInput 
                id="search"
                name="search"
                placeholder="Search for Users"
                label="Search"
                showLabel={false}
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                error={undefined}
                touched={undefined}
                leftIcon={
                    <BiSearchAlt className="w-6 h-6" />
                }
            />
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