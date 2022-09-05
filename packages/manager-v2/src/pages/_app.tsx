/* eslint-disable react/jsx-props-no-spreading */
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import type { NextPageWithLayout } from '@app/types';

import '@patternfly/react-core/dist/styles/base.css';
import '@app/styles/globals.css';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps }
}: AppPropsWithLayout): JSX.Element => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return <SessionProvider>{getLayout(<Component {...pageProps} />)}</SessionProvider>;
};
export default MyApp;
