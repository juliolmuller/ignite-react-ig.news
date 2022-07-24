import { render, screen } from '@testing-library/react';

import NavLink from '.';

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/',
  }),
}));

describe('component NavLink', () => {
  it('renders correctly', () => {
    render(<NavLink href="/">Home</NavLink>);

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('adds className "active" when link is active', () => {
    render(
      <NavLink href="/" activeClassName="active">
        Home
      </NavLink>,
    );

    expect(screen.getByText('Home')).toHaveAttribute('class', 'active');
  });
});
