import { SessionProvider } from "next-auth/react";
import "@patternfly/react-core/dist/styles/base.css";
import '../styles/globals.css';

import type { AppProps } from 'next/app'

function SPAshipManager({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default SPAshipManager
