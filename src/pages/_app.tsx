import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppProps } from 'next/app';
import { type ReactNode } from 'react';

import '~/styles.scss';

import Header from '~/components/Header';

export type MyApProps = AppProps<{
  session: Session;
}>;

export default function MyApp({ Component, pageProps }: MyApProps): ReactNode {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
