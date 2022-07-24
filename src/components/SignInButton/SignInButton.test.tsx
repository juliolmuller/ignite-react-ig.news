import { fireEvent, render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { signIn, signOut, useSession } from 'next-auth/react';

import SignInButton from '.';

jest.mock('next-auth/react');

describe('component SignInButton', () => {
  it('renders when user is not authenticated', () => {
    mocked(useSession).mockReturnValueOnce({
      status: 'unauthenticated',
      data: null,
    });
    render(<SignInButton />);

    const signInButton = screen.getByText('Sign in with GitHub');
    const signInMocked = mocked(signIn);
    fireEvent.click(signInButton);

    expect(signInButton).toBeInTheDocument();
    expect(signInMocked).toHaveBeenCalled();
  });

  it('renders when user is authenticated', () => {
    mocked(useSession).mockReturnValueOnce({
      status: 'authenticated',
      data: { user: { name: 'John Doe' }, expires: '' },
    });
    render(<SignInButton />);

    const signInButton = screen.getByText('John Doe');
    const signOutButton = screen.getByTitle('Sign out');
    const signOutMocked = mocked(signOut);
    fireEvent.click(signOutButton);

    expect(signInButton).toBeInTheDocument();
    expect(signOutButton).toBeInTheDocument();
    expect(signOutMocked).toHaveBeenCalled();
  });
});
