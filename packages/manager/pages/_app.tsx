import Head from 'next/head'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react";
import "@patternfly/react-core/dist/styles/base.css";
import '../styles/globals.css';
import Layout from '../components/Layout';

function SPAshipManager({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>SPAship Manager</title>
        <meta name="description" content="The SPAship User Interface for managing your SPAship properties." />
        <link rel="icon" href="images/icons/favicon.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  )
}

export default SPAshipManager
