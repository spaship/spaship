import React from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react";
import "@patternfly/react-core/dist/styles/base.css";
import '../styles/globals.css';
import LayoutComponent from '../components/layout';
import { NextComponentType, NextPageContext } from 'next';
import { AuthEnabledComponentConfig } from '../utils/auth.utils';
import Auth from '../components/auth';

type AppAuthProps = AppProps & {
  Component: NextComponentType<NextPageContext, any, {}> & Partial<AuthEnabledComponentConfig>;
};

function SPAshipManager({ Component, pageProps: { session, ...pageProps } }: AppAuthProps) {
  const router = useRouter();
  const layoutLessPages = [`/login`];
  const skipLayout = layoutLessPages.includes(router.pathname);
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>SPAship Manager</title>
      </Head>
      {Component.authenticationEnabled ? (
        <Auth><LayoutComponent skipLayout={skipLayout}><Component {...pageProps} /></LayoutComponent></Auth>
      ) : (
        <LayoutComponent skipLayout={skipLayout}><Component {...pageProps} /></LayoutComponent>
      )}
    </SessionProvider>
  )
}

export default SPAshipManager
