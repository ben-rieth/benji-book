import type { AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "../utils/api";

import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import NextProgress from "next-progress";
import { allCapsToDash } from "../utils/toast";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  const { data: location } = api.settings.getNotificationLocation.useQuery();

  return (
    <SessionProvider session={session}>
        <Component {...pageProps} />
        <Toaster 
          position={location ? allCapsToDash(location) : 'bottom-right'}
        />
        <NextProgress delay={300} options={{ showSpinner: false }} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
