import type { FC, ReactNode } from "react";
import Head from 'next/head';
import NavBar from "../navigation/NavBar";
import Logo from "../logo/Logo";
import Link from "next/link";
import Button from "../general/Button";

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
            <div className="bg-slate-100 max-w-screen min-h-screen h-fit flex flex-col">
                <NavBar />
                <main className="flex-1">
                    {children}
                </main>
                <footer className="bg-white mt-10 flex flex-col items-center py-5">
                    <div>
                        <Link className="font-handwriting font-bold text-xl sm:text-3xl text-rose-500" href="https://benriethmeier.dev">Benji Riethmeier</Link>
                        <span className="text-xl sm:text-3xl mx-2">|</span> 
                        <Logo link={true} />
                    </div>
                    <Link href="https://github.com/ben-rieth/benji-book" className="-my-2">
                        <Button variant="minimal">
                            Project Github
                        </Button>
                    </Link>
                    <Link href="https://benriethmeier.dev" className="-my-2">
                        <Button variant="minimal">
                            Article
                        </Button>
                    </Link>
                </footer>
            </div>
        </>
    )
}

export default MainLayout;