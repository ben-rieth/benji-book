import type { AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "../utils/api";

import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import NextProgress from "next-progress";
import localFont from 'next/font/local';

const caveat = localFont({ src: './../../public/fonts/caveat.woff2', variable: '--font-caveat' });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  return (
    <SessionProvider session={session}>
      <div className={`${caveat.variable}`}>
        <Component {...pageProps} />
      </div>
        
        <Toaster />
        <NextProgress delay={300} options={{ showSpinner: false }} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
