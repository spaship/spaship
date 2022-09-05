import type { AppProps } from 'next/app';
import '@patternfly/react-core/dist/styles/base.css';
import '../styles/globals.css';

// eslint-disable-next-line react/jsx-props-no-spreading
const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => <Component {...pageProps} />;
export default MyApp;
