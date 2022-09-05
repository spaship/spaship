/* eslint-disable react/jsx-props-no-spreading */
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import '@patternfly/react-core/dist/styles/base.css';
import '@app/styles/globals.css';

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppProps): JSX.Element => (
  <SessionProvider>
    <Component {...pageProps} />
  </SessionProvider>
);
export default MyApp;
