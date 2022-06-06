import { asHTML, asText } from '@prismicio/helpers';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { getPrismicClient } from '~/services/server/prismic';

import classes from './styles.module.scss';

export interface PostPreviewPageProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export default function PostPreviewPage({ post }: PostPreviewPageProps) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.data?.activeSubscription) {
      router.replace(`/posts/${post.slug}`);
    }
  }, [post.slug, router, session]);

  return (
    <>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>

      <main className={classes.wrapper}>
        <article className={classes.postWrapper}>
          <header>
            <h1>{post.title}</h1>
            <time>{post.updatedAt}</time>
          </header>
          <main
            className={classes.preview}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className={classes.continueReading}>
            Wanna continue reading?{' '}
            <Link href="/">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a>Subscribe now</a>
            </Link>{' '}
            🤗
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PostPreviewPageProps> = async ({
  params,
}) => {
  const postSlug = String(params?.slug);
  const prismicClient = getPrismicClient();
  const post = await prismicClient.getByUID('post', postSlug);

  return {
    props: {
      post: {
        slug: post.uid ?? '',
        title: asText(post.data.title) ?? '',
        content: asHTML(post.data.content.splice(0, 3)) ?? '',
        updatedAt: new Date(post.last_publication_date).toLocaleDateString(
          'pt-BR',
          {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          },
        ),
      },
    },
    revalidate: 60 * 60 * 2, // 2 hours
  };
};
