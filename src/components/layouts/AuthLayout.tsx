import type { FC, ReactNode } from "react";
import Head from "next/head";

type AuthLayoutProps = {
    children: ReactNode;
    description: string;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children, description }) => {
    return (
        <>
            <Head>
                <title>Benji Book</title>
                <meta name="description" content={description} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="bg-slate-100 w-screen px-16">
                <div className="flex flex-col items-center justify-center gap-4 md:gap-24 h-screen max-w-screen-xl md:flex-row md:justify-around mx-auto">
                    {children}
                </div>
            </main>
        </>
    )
};

export default AuthLayout;