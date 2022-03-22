import '../styles/globals.css'
import "@patternfly/react-core/dist/styles/base.css";

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
