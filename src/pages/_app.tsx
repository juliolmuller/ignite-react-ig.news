import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';

import '~/styles.scss';
import Header from '~/components/Header';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
