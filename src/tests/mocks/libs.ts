import { mocked } from 'jest-mock';
import { useSession } from 'next-auth/react';

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/',
  }),
}));

jest.mock('next-auth/react');

export function useSessionMocked(authenticated: boolean) {
  return authenticated
    ? mocked(useSession).mockReturnValueOnce({
        status: 'authenticated',
        data: { user: { name: 'John Doe' }, expires: '' },
      })
    : mocked(useSession).mockReturnValueOnce({
        status: 'unauthenticated',
        data: null,
      });
}
