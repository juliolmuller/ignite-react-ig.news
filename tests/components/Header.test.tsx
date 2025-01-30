import { render, screen } from '@testing-library/react';

import Header from '../../src/components/Header';

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/',
  }),
}));
jest.mock('next-auth/react', () => ({
  useSession: () => ({}),
}));

describe('component Header', () => {
  it('renders correctly', () => {
    render(<Header />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();
  });
});
