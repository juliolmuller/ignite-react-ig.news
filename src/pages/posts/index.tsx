import { GetStaticProps } from 'next';
import Head from 'next/head';

import SubscribeButton from '~/components/SubscribeButton';
import stripe from '~/services/server/stripe';

import classes from './styles.module.scss';

export interface PostsPageProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function PostsPage({ product }: PostsPageProps) {
  const subscriptionPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.amount);

  return (
    <>
      <Head>
        <title>Postagens | ig.news</title>
      </Head>

      <main className={classes.wrapper}>
        <ul className={classes.postsList}>
          <li className={classes.postItem}>
            <a href="#">
              <time>30 de março de 2019</time>
              <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
              <p>
                In this guide, you will learn how to create a Monorepo to manage
                multiple packages with a shared build, test, and release
                process.
              </p>
            </a>
          </li>
          <li className={classes.postItem}>
            <a href="#">
              <time>30 de março de 2019</time>
              <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
              <p>
                In this guide, you will learn how to create a Monorepo to manage
                multiple packages with a shared build, test, and release
                process.
              </p>
            </a>
          </li>
          <li className={classes.postItem}>
            <a href="#">
              <time>30 de março de 2019</time>
              <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
              <p>
                In this guide, you will learn how to create a Monorepo to manage
                multiple packages with a shared build, test, and release
                process.
              </p>
            </a>
          </li>
        </ul>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<PostsPageProps> = async () => {
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
