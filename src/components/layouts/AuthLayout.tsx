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
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
            </Head>

            <main className="bg-slate-100 w-screen px-2">
                <div className="flex flex-col items-center justify-center gap-4 h-screen max-w-screen-xl mx-auto">
                    {children}
                </div>
            </main>
        </>
    )
};

export default AuthLayout;