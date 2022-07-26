import { render, screen } from '@testing-library/react';

import HomePage, { getStaticProps } from '.';

jest.mock('~/components/SubscribeButton', () => () => null);
jest.mock('~/services/server/stripe', () => ({
  prices: {
    retrieve: () =>
      Promise.resolve({
        id: 'fake-price-id',
        unit_amount: 1000,
      }),
  },
}));

describe('component HomePage', () => {
  it('renders correctly', () => {
    render(<HomePage product={{ priceId: 'fake-price-id', amount: 10 }} />);

    expect(screen.getByText('Get access to all posts')).toBeInTheDocument();
    expect(screen.getByText(/\$10\.00/)).toBeInTheDocument();
  });

  it('loads static props correctly', async () => {
    const props = await getStaticProps({});

    expect(props).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: 10,
          },
        },
      }),
    );
  });
});
