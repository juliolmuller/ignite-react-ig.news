import { render, screen } from '@testing-library/react';

import { useSessionMocked } from '~/tests/mocks/libs';

import Header from '.';

describe('component Header', () => {
  it('renders correctly', () => {
    useSessionMocked(false);
    render(<Header />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();
  });
});
