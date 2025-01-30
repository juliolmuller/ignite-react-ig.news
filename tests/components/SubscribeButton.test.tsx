import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { signIn, useSession } from 'next-auth/react';

import { getStripe } from '~/services/client/stripe';

import SubscribeButton from '../../src/components/SubscribeButton';

jest.mock('next-auth/react');
jest.mock('~/services/client/stripe');

describe('component SubscribeButton', () => {
  it('renders and work correctly when user is not authenticated', () => {
    mocked(useSession).mockReturnValueOnce({
      status: 'unauthenticated',
      data: null,
    } as any);
    render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Subscribe now');
    const signInMocked = mocked(signIn);
    fireEvent.click(subscribeButton);

    expect(subscribeButton).toBeInTheDocument();
    expect(signInMocked).toHaveBeenCalled();
  });

  it('renders and work correctly when user is authenticated but not subscribe', async () => {
    mocked(useSession).mockReturnValueOnce({
      status: 'authenticated',
      data: { user: { name: 'John Doe' }, expires: '' },
    } as any);
    render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Subscribe now');
    const subscriptionCall = jest.fn(() => Promise.resolve({}));
    const checkoutCall = jest.fn();
    Object.defineProperty(window, 'fetch', {
      value: () => Promise.resolve({ json: subscriptionCall }),
    });
    mocked(getStripe).mockResolvedValueOnce({
      redirectToCheckout: checkoutCall,
    } as any);
    fireEvent.click(subscribeButton);

    /* eslint-disable testing-library/no-wait-for-multiple-assertions */
    await waitFor(() => {
      expect(subscribeButton).toBeInTheDocument();
      expect(subscriptionCall).toHaveBeenCalled();
      expect(checkoutCall).toHaveBeenCalled();
    });
    /* eslint-enable */
  });

  it('renders and work correctly when user is authenticated and subscribe', () => {
    mocked(useSession).mockReturnValueOnce({
      status: 'authenticated',
      data: {
        user: { name: 'John Doe' },
        activeSubscription: true,
        expires: '',
      },
    } as any);
    render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Read latest posts');

    expect(subscribeButton).toBeInTheDocument();
    expect(subscribeButton).toHaveAttribute('href', '/posts');
  });
});
