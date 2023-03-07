import type { FC, ReactNode } from "react";
import Head from 'next/head';
import NavBar from "../navigation/NavBar";

type MainLayoutProps = {
    children: ReactNode;
    description: string;
    title: string;
}

const MainLayout:FC<MainLayoutProps> = ({ children, description, title }) => {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="bg-slate-100 max-w-screen min-h-screen h-fit pb-10">
                <NavBar />
                {children}
            </main> 
        </>
    )
}

export default MainLayout;