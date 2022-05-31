import { asHTML, asText } from '@prismicio/helpers';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { getPrismicClient } from '~/services/server/prismic';

import classes from './styles.module.scss';

export interface PostPageProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export default function PostPage({ post }: PostPageProps) {
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
          <main dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<PostPageProps> = async ({
  req,
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
        content: asHTML(post.data.content) ?? '',
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
  };
};
