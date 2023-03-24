import type { AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "../utils/api";

import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import NextProgress from "next-progress";

import { Roboto_Flex } from 'next/font/google';

const roboto = Roboto_Flex({ subsets: ['latin' ], variable: '--font-roboto'});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  return (
    <SessionProvider session={session}>
        <div className={`${roboto.variable} font-sans`}>
          <Component {...pageProps} />
        </div>
        <Toaster 
          position="bottom-right"
        />
        <NextProgress delay={300} options={{ showSpinner: false }} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
