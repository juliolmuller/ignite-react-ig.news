import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';

import '~/styles.scss';
import Header from '~/components/Header';

export type MyApProps = AppProps<{
  session: Session;
}>;

export default function MyApp({ Component, pageProps }: MyApProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
