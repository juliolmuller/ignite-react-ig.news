/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair, @typescript-eslint/explicit-function-return-type */
import { render, screen } from '@testing-library/react';

import NavLink from '../../src/components/NavLink';

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
