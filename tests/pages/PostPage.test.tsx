import { render, screen } from '@testing-library/react';
import { getSession } from 'next-auth/react';

import PostPage, { getServerSideProps } from '../../src/pages/posts/[slug]';

jest.mock('next-auth/react');
jest.mock('@prismicio/helpers', () => ({
  asHTML: (value: any) => value,
  asText: (value: any) => value,
}));
jest.mock('~/services/server/prismic', () => ({
  getPrismicClient: () => ({
    getByUID: () =>
      Promise.resolve({
        uid: 'test-post',
        last_publication_date: '2022-01-01T12:00:00.000Z',
        data: {
          title: 'Test Post',
          content: 'Post with a long content',
        },
      }),
  }),
}));

describe('component PostPage', () => {
  const postMocked = {
    title: 'Test Post',
    content: 'Post with a long content',
    slug: 'test-post',
    updatedAt: '01 de janeiro de 2022',
  };

  it('renders correctly', () => {
    render(<PostPage post={postMocked} />);

    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Post with a long content')).toBeInTheDocument();
    expect(screen.getByText('01 de janeiro de 2022')).toBeInTheDocument();
  });

  it('loads server-side props when user is subscribed', async () => {
    jest.mocked(getSession).mockResolvedValueOnce({
      activeSubscription: 'fake-subscription-id',
    } as any);

    const props = await getServerSideProps({} as any);

    expect(props).toEqual(
      expect.objectContaining({
        props: {
          post: postMocked,
        },
      }),
    );
  });

  it('prepares for redirect when user is NOT subscribed', async () => {
    jest.mocked(getSession).mockResolvedValueOnce({
      activeSubscription: null,
    } as any);

    const props = await getServerSideProps({
      params: { slug: 'test-post' },
    } as any);

    expect(props).toEqual(
      expect.objectContaining({
        redirect: {
          destination: '/posts/test-post/preview',
          permanent: false,
        },
      }),
    );
  });
});
