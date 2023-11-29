// pfe base css needs to be top for some unknown reason to work properly
import '@patternfly/react-core/dist/styles/base.css';

/* eslint-disable react/jsx-props-no-spreading */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { SessionProvider, signOut } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import * as yup from 'yup';

import { AuthGuard } from '@app/context/AuthGuard';
import type { NextPageWithLayout } from '@app/types';

import { deleteOrchestratorAuthorizationHeader } from '@app/config/orchestratorReq';
import { pageLinks } from '@app/links';
import '@app/styles/globals.css';
import 'nprogress/nprogress.css';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  pageProps: {
    session: Session;
  };
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      onError: (error: any) => {
        if (error?.response.status === 401) {
          signOut({ redirect: false, callbackUrl: pageLinks.loginPage })
            .then((data) => {
              deleteOrchestratorAuthorizationHeader();
              // eslint-disable-next-line no-console
              console.error('data', data.url);
            })
            .catch((e) => {
              // eslint-disable-next-line no-console
              console.error('Unauthorized request', e);
            });
        }
      }
    }
  }
});

yup.addMethod(yup.string, 'noWhitespace', function noWhitespace() {
  return this.matches(/^(\S+$)/, { message: 'Whitespace not allowed', excludeEmptyString: true });
});

yup.addMethod(yup.string, 'alphabetsOnly', function noWhitespace() {
  return this.matches(/^[a-zA-Z\s]+$/, {
    message: 'Alphabet characters only',
    excludeEmptyString: true
  });
});

yup.addMethod(yup.string, 'alphaNumbericOnly', function noWhitespace() {
  return this.matches(/^[a-zA-Z0-9\s]+$/, {
    message: 'Alphanumeric characters only',
    excludeEmptyString: true
  });
});

NProgress.configure({ showSpinner: false });

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps }
}: AppPropsWithLayout): JSX.Element => {
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => NProgress.start();

    const handleStop = () => NProgress.done();

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  const { isProtected } = Component;
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider>
      <Head>
        <title>SPAship Manager</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        {isProtected ? (
          <AuthGuard>{getLayout(<Component {...pageProps} />)}</AuthGuard>
        ) : (
          getLayout(<Component {...pageProps} />)
        )}
      </QueryClientProvider>
      <Toaster position="bottom-left" />
    </SessionProvider>
  );
};
export default MyApp;
