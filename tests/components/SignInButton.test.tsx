/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair, @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from '@testing-library/react';
import { signIn, signOut, useSession } from 'next-auth/react';

import SignInButton from '../../src/components/SignInButton';

jest.mock('next-auth/react');

describe('component SignInButton', () => {
  it('renders when user is not authenticated', () => {
    jest.mocked(useSession).mockReturnValueOnce({
      status: 'unauthenticated',
      data: null,
    } as any);
    render(<SignInButton />);

    const signInButton = screen.getByText('Sign in with GitHub');
    const signInMocked = jest.mocked(signIn);
    fireEvent.click(signInButton);

    expect(signInButton).toBeInTheDocument();
    expect(signInMocked).toHaveBeenCalled();
  });

  it('renders when user is authenticated', () => {
    jest.mocked(useSession).mockReturnValueOnce({
      status: 'authenticated',
      data: { user: { name: 'John Doe' }, expires: '' },
    } as any);
    render(<SignInButton />);

    const signInButton = screen.getByText('John Doe');
    const signOutButton = screen.getByTitle('Sign out');
    const signOutMocked = jest.mocked(signOut);
    fireEvent.click(signOutButton);

    expect(signInButton).toBeInTheDocument();
    expect(signOutButton).toBeInTheDocument();
    expect(signOutMocked).toHaveBeenCalled();
  });
});
