/* eslint-disable react/jsx-props-no-spreading */
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthGuard } from '@app/context/AuthGuard';
import type { NextPageWithLayout } from '@app/types';

import '@patternfly/react-core/dist/styles/base.css';
import '@app/styles/globals.css';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps }
}: AppPropsWithLayout): JSX.Element => {
  const { isProtected } = Component;
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {isProtected
          ? getLayout(
              <AuthGuard>
                <Component {...pageProps} />
              </AuthGuard>
            )
          : getLayout(<Component {...pageProps} />)}
      </QueryClientProvider>
    </SessionProvider>
  );
};
export default MyApp;
