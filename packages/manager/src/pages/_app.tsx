/* eslint-disable react/jsx-props-no-spreading */
import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import * as yup from 'yup';
import NProgress from 'nprogress';

import { AuthGuard } from '@app/context/AuthGuard';
import type { NextPageWithLayout } from '@app/types';

import '@patternfly/react-core/dist/styles/base.css';
import 'nprogress/nprogress.css';
import '@app/styles/globals.css';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
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
        {isProtected
          ? getLayout(
              <AuthGuard>
                <Component {...pageProps} />
              </AuthGuard>
            )
          : getLayout(<Component {...pageProps} />)}
      </QueryClientProvider>
      <Toaster position="bottom-left" />
    </SessionProvider>
  );
};
export default MyApp;
