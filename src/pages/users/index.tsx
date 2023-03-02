import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession } from "next-auth";
import { useState } from "react";
import TextInput from "../../components/inputs/TextInput";
import UserCard from "../../components/users/UserCard";
import { authOptions } from "../../server/auth";
import { api } from "../../utils/api";
import { BiSearchAlt } from 'react-icons/bi';
import useDebounce from "../../hooks/useDebounce";
import { AiOutlineLoading } from "react-icons/ai";
import ErrorBox from "../../components/error/ErrorBox";
import MainLayout from "../../components/layouts/MainLayout";
import Link from "next/link";

const SearchUsersPage: NextPage = () => {

    const [query, setQuery] = useState<string>('');
    const debouncedQuery = useDebounce<string>(query, 350);


    const { data, isSuccess, isLoading, isError } = api.users.getAllUsers.useQuery({ query: debouncedQuery });

    return (
        <MainLayout title="Benji Book" description="Search for other users!">
            <div className="flex flex-col gap-4 items-center px-3 py-5">
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
                {isSuccess && data.length > 0 && (
                    <section className="flex flex-col gap-5 items-center w-full">
                        {data.map(user => (
                            <Link href={`/users/${user.id}`} key={user.id}>
                                <UserCard user={user} />
                            </Link>
                        ))}
                    </section>
                )}
                {isSuccess && data.length === 0 && query === '' && (
                    <p>Search for other users!</p>
                )}
                {isSuccess && data.length === 0 && query !== '' && (
                    <p className="text-center">Cannot find a user with a name or username containing: <span className="italic">{query}</span></p>
                )}
                {isLoading && (
                    <AiOutlineLoading className="animate-spin w-14 h-14" />   
                )}
                {isError && (
                    <ErrorBox message="Cannot search due to server error. Try again later." />
                )}
            </div>
        </MainLayout>
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