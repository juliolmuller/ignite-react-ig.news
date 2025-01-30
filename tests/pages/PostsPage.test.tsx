import { render, screen } from '@testing-library/react';

import PostsPage, { getStaticProps } from '../../src/pages/posts';

jest.mock('@prismicio/helpers', () => ({
  asText: (value: any) => value,
}));
jest.mock('~/services/server/prismic', () => ({
  getPrismicClient: () => ({
    getAllByType: () => [
      {
        uid: 'post-1',
        last_publication_date: '2022-01-01T12:00:00.000Z',
        data: {
          title: 'Post 1',
          content: [{ type: 'paragraph', text: 'Post 1 overview' }],
        },
      },
      {
        uid: 'post-2',
        last_publication_date: '2022-02-01T12:00:00.000Z',
        data: {
          title: 'Post 2',
          content: [{ type: 'paragraph', text: 'Post 2 overview' }],
        },
      },
      {
        uid: 'post-3',
        last_publication_date: '2022-03-01T12:00:00.000Z',
        data: {
          title: 'Post 3',
          content: [{ type: 'paragraph', text: 'Post 3 overview' }],
        },
      },
    ],
  }),
}));

describe('component PostsPage', () => {
  const postsMocked = [
    {
      title: 'Post 1',
      overview: 'Post 1 overview',
      slug: 'post-1',
      updatedAt: '01 de janeiro de 2022',
    },
    {
      title: 'Post 2',
      overview: 'Post 2 overview',
      slug: 'post-2',
      updatedAt: '01 de fevereiro de 2022',
    },
    {
      title: 'Post 3',
      overview: 'Post 3 overview',
      slug: 'post-3',
      updatedAt: '01 de março de 2022',
    },
  ];

  it('renders correctly', () => {
    render(<PostsPage posts={postsMocked} />);

    postsMocked.forEach(({ title, overview, updatedAt }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(overview)).toBeInTheDocument();
      expect(screen.getByText(updatedAt)).toBeInTheDocument();
    });
  });

  it('loads static props correctly', async () => {
    const props = await getStaticProps({});

    expect(props).toEqual(
      expect.objectContaining({
        props: {
          posts: postsMocked,
        },
      }),
    );
  });
});
