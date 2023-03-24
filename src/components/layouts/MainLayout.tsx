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
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
            </Head>
            <main className="bg-slate-100 max-w-screen min-h-screen h-fit pb-10">
                <NavBar />
                {children}
            </main> 
        </>
    )
}

export default MainLayout;