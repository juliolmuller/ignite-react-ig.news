import { render, screen } from '@testing-library/react';

import { useSessionMocked } from '~/tests/mocks/libs';

import SignInButton from '.';

describe('component SignInButton', () => {
  it('renders when user is not authenticated', () => {
    useSessionMocked(false);
    render(<SignInButton />);

    expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument();
  });

  it('renders when user is authenticated', () => {
    useSessionMocked(true);
    render(<SignInButton />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
