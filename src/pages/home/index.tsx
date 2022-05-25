import { GetStaticProps } from 'next';
import Head from 'next/head';

import stripe from '~/services/server/stripe';

import classes from './styles.module.scss';

export interface HomePageProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function HomePage({ product }: HomePageProps) {
  const subscriptionPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.amount);

  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={classes.wrapper}>
        <img src="/img/avatar.svg" alt="girl coding React" />

        <section>
          <small className={classes.greetings}>👋 Hello, there!</small>

          <h1 className={classes.slogan}>
            News about <br />
            the <strong>React</strong> world
          </h1>

          <p className={classes.actionCall}>
            Get access to all the publications
            <span>for {subscriptionPrice}/month</span>
          </p>

          <button className={classes.subscribeBtn} type="button">
            Subscribe now
          </button>
        </section>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID!, {
    expand: ['product'],
  });

  return {
    props: {
      product: {
        priceId: price.id,
        amount: (price.unit_amount ?? 0) / 100,
      },
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
