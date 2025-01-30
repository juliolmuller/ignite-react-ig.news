import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import PostPreviewPage, {
  getStaticProps,
} from '../../src/pages/posts/[slug]/preview';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('next-auth/react');
jest.mock('@prismicio/helpers', () => ({
  asHTML: (value: any) => value.join(''),
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
          content: ['Post with a long content'],
        },
      }),
  }),
}));

describe('component PostPreviewPage', () => {
  const postMocked = {
    title: 'Test Post',
    content: 'Post with a long content',
    slug: 'test-post',
    updatedAt: '01 de janeiro de 2022',
  };

  it('renders correctly', () => {
    mocked(useRouter).mockReturnValueOnce({} as any);
    mocked(useSession).mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    } as any);

    render(<PostPreviewPage post={postMocked} />);

    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Post with a long content')).toBeInTheDocument();
    expect(screen.getByText('01 de janeiro de 2022')).toBeInTheDocument();
    expect(screen.getByText(/Wanna continue reading\?/)).toBeInTheDocument();
  });

  it('redirects user with active subscription', () => {
    const redirectMock = jest.fn();
    mocked(useRouter).mockReturnValueOnce({ replace: redirectMock } as any);
    mocked(useSession).mockReturnValueOnce({
      data: { activeSubscription: true, expires: '' },
      status: 'authenticated',
    } as any);

    render(<PostPreviewPage post={postMocked} />);

    expect(redirectMock).toHaveBeenCalledWith('/posts/test-post');
  });

  it('loads static props correctly', async () => {
    mocked(getSession).mockResolvedValueOnce({
      activeSubscription: null,
    } as any);

    const props = await getStaticProps({} as any);

    expect(props).toEqual(
      expect.objectContaining({
        props: {
          post: postMocked,
        },
      }),
    );
  });
});
